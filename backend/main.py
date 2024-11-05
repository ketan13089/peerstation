# main.py

from fastapi import FastAPI, HTTPException, Depends, status, Query
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pymongo import MongoClient
from bson.objectid import ObjectId
from typing import Optional, List
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Database setup
client = MongoClient('mongodb://localhost:27017')
db = client['forum_db']

# Authentication setup
SECRET_KEY = 'your-secret-key'  # Replace with your actual secret key
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 43200  # 30 days

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')

# Models


class UserIn(BaseModel):
    email: EmailStr
    name: str
    password: str


class ThreadIn(BaseModel):
    title: str
    content: str


class ThreadUpdate(BaseModel):
    title: str
    content: str


class CommentIn(BaseModel):
    content: str
    parentId: str
    parentType: str  # 'thread' or 'comment'


class CommentUpdate(BaseModel):
    content: str

# Utility functions


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_user_by_email(email: str):
    user = db.users.find_one({'email': email})
    if user:
        user['id'] = str(user['_id'])
        return user
    return None


def get_user_by_id(user_id: str):
    user = db.users.find_one({'_id': ObjectId(user_id)})
    if user:
        user['id'] = str(user['_id'])
        return user
    return None


def get_current_user(token: str = Depends(oauth2_scheme)):
    if not token:
        raise HTTPException(status_code=401, detail='Not authenticated')
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Could not validate credentials',
        headers={'WWW-Authenticate': 'Bearer'},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get('sub')
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(email)
    if user is None:
        raise credentials_exception
    return user


def get_current_user_optional(token: str = Depends(oauth2_scheme)):
    if not token:
        return None  # Allow unauthenticated users
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get('sub')
        if email is None:
            return None
    except JWTError:
        return None
    user = get_user_by_email(email)
    return user


def get_user_level(stars):
    if stars >= 100:
        return 'Master'
    elif stars >= 50:
        return 'Expert'
    elif stars >= 20:
        return 'Intermediate'
    else:
        return 'Beginner'


def get_author_data(user_id):
    author = db.users.find_one({'_id': user_id})
    if author:
        return {
            'id': str(author['_id']),
            'name': author['name'],
            'email': author['email'],
            'stars': author['stars'],
            'level': get_user_level(author['stars']),
        }
    return None

# Routes


@app.post('/register')
def register(user_in: UserIn):
    existing_user = db.users.find_one({'email': user_in.email})
    if existing_user:
        raise HTTPException(status_code=400, detail='Email already registered')
    hashed_password = get_password_hash(user_in.password)
    user = {
        'email': user_in.email,
        'name': user_in.name,
        'hashed_password': hashed_password,
        'stars': 0,
    }
    db.users.insert_one(user)
    return {'message': 'User registered successfully'}


@app.post('/login')
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user_by_email(form_data.username)
    if not user or not verify_password(form_data.password, user['hashed_password']):
        raise HTTPException(
            status_code=400, detail='Incorrect email or password')
    access_token = create_access_token(data={'sub': user['email']})
    return {'access_token': access_token, 'token_type': 'bearer'}


@app.post('/threads')
def create_thread(thread_in: ThreadIn, current_user: dict = Depends(get_current_user)):
    thread = {
        'title': thread_in.title,
        'content': thread_in.content,
        'author_id': ObjectId(current_user['id']),
        'createdAt': datetime.utcnow(),
        'upvotes': 0,
    }
    result = db.threads.insert_one(thread)
    return {'id': str(result.inserted_id)}


@app.put('/threads/{thread_id}')
def update_thread(thread_id: str, thread_update: ThreadUpdate, current_user: dict = Depends(get_current_user)):
    thread = db.threads.find_one({'_id': ObjectId(thread_id)})
    if not thread:
        raise HTTPException(status_code=404, detail='Thread not found')
    if thread['author_id'] != ObjectId(current_user['id']):
        raise HTTPException(
            status_code=403, detail='Not authorized to edit this thread')
    db.threads.update_one({'_id': ObjectId(thread_id)}, {'$set': {
        'title': thread_update.title,
        'content': thread_update.content,
    }})
    return {'message': 'Thread updated successfully'}


@app.get('/threads')
def get_threads(
    current_user: Optional[dict] = Depends(get_current_user_optional),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    threads = []
    skip = (page - 1) * limit
    total_threads = db.threads.count_documents({})
    cursor = db.threads.find().sort('createdAt', -1).skip(skip).limit(limit)
    for thread in cursor:
        author = get_author_data(thread['author_id'])
        can_edit = current_user and thread['author_id'] == ObjectId(
            current_user['id'])
        thread_data = {
            'id': str(thread['_id']),
            'title': thread['title'],
            'content': thread['content'],
            'author': author,
            'createdAt': thread['createdAt'],
            'upvotes': thread.get('upvotes', 0),
            'comments': [],
            'canEdit': can_edit,
        }
        threads.append(thread_data)
    return {
        'threads': threads,
        'total': total_threads,
        'page': page,
        'limit': limit,
    }


@app.get('/threads/{thread_id}')
def get_thread(thread_id: str, current_user: Optional[dict] = Depends(get_current_user_optional)):
    thread = db.threads.find_one({'_id': ObjectId(thread_id)})
    if not thread:
        raise HTTPException(status_code=404, detail='Thread not found')
    author = get_author_data(thread['author_id'])
    can_edit = current_user and thread['author_id'] == ObjectId(
        current_user['id'])
    thread_data = {
        'id': str(thread['_id']),
        'title': thread['title'],
        'content': thread['content'],
        'author': author,
        'createdAt': thread['createdAt'],
        'upvotes': thread.get('upvotes', 0),
        'canEdit': can_edit,
        'comments': get_comments(thread['_id'], current_user),
    }
    return thread_data


def get_comments(parent_id, current_user):
    comments = []
    for comment in db.comments.find({'parentId': parent_id}).sort('createdAt', 1):
        author = get_author_data(comment['author_id'])
        can_edit = current_user and comment['author_id'] == ObjectId(
            current_user['id'])
        comment_data = {
            'id': str(comment['_id']),
            'content': comment['content'],
            'author': author,
            'createdAt': comment['createdAt'],
            'upvotes': comment.get('upvotes', 0),
            'replies': get_comments(comment['_id'], current_user),
            'canEdit': can_edit,
        }
        comments.append(comment_data)
    return comments


@app.post('/comments')
def post_comment(comment_in: CommentIn, current_user: dict = Depends(get_current_user)):
    comment = {
        'content': comment_in.content,
        'author_id': ObjectId(current_user['id']),
        'parentId': ObjectId(comment_in.parentId),
        'parentType': comment_in.parentType,
        'createdAt': datetime.utcnow(),
        'upvotes': 0,
    }
    db.comments.insert_one(comment)
    return {'message': 'Comment posted successfully'}


@app.put('/comments/{comment_id}')
def update_comment(comment_id: str, comment_update: CommentUpdate, current_user: dict = Depends(get_current_user)):
    comment = db.comments.find_one({'_id': ObjectId(comment_id)})
    if not comment:
        raise HTTPException(status_code=404, detail='Comment not found')
    if comment['author_id'] != ObjectId(current_user['id']):
        raise HTTPException(
            status_code=403, detail='Not authorized to edit this comment')
    db.comments.update_one({'_id': ObjectId(comment_id)}, {'$set': {
        'content': comment_update.content,
    }})
    return {'message': 'Comment updated successfully'}


@app.post('/threads/{thread_id}/upvote')
def upvote_thread(thread_id: str, current_user: dict = Depends(get_current_user)):
    db.threads.update_one({'_id': ObjectId(thread_id)},
                          {'$inc': {'upvotes': 1}})
    thread = db.threads.find_one({'_id': ObjectId(thread_id)})
    db.users.update_one({'_id': thread['author_id']}, {'$inc': {'stars': 1}})
    return {'message': 'Thread upvoted'}


@app.post('/comments/{comment_id}/upvote')
def upvote_comment(comment_id: str, current_user: dict = Depends(get_current_user)):
    db.comments.update_one({'_id': ObjectId(comment_id)}, {
                           '$inc': {'upvotes': 1}})
    comment = db.comments.find_one({'_id': ObjectId(comment_id)})
    db.users.update_one({'_id': comment['author_id']}, {'$inc': {'stars': 1}})
    return {'message': 'Comment upvoted'}


@app.get('/users/{user_id}')
def get_user_profile(user_id: str):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    user_profile = {
        'id': user['id'],
        'name': user['name'],
        'email': user['email'],
        'stars': user['stars'],
        'level': get_user_level(user['stars']),
        # You can add more user-related data here
    }
    return user_profile
