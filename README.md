# PeerStation

A full-stack forum application built with FastAPI (backend) and React (frontend). Users can register, log in, create threads, comment, upvote, and view user profiles.

## Prerequisites

- **Python 3.8 or higher**
- **Node.js and npm**
- **MongoDB** running locally on `mongodb://localhost:27017`

## Backend Setup

### 1. Navigate to the Backend Directory

```bash
cd backend
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

### 3. Activate the Virtual Environment

- **Windows:**

  ```bash
  venv\Scripts\activate
  ```

- **Unix/Linux/MacOS:**

  ```bash
  source venv/bin/activate
  ```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Set Up Environment Variables

- Create a `.env` file in the `backend` directory.
- Add the following line to `.env`:

  ```plaintext
  SECRET_KEY=your-secret-key
  ```

  Replace `your-secret-key` with a strong, unique secret key.

### 6. Start the Backend Server

```bash
uvicorn main:app --reload
```

The backend server will start at `http://localhost:8000`.

## Frontend Setup

### 1. Navigate to the Frontend Directory

```bash
cd ../frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Frontend Server

```bash
npm start
```

The frontend server will start at `http://localhost:3000`.

## Accessing the Application

Open your web browser and go to `http://localhost:3000` to access the forum application.

## Notes

- Ensure **MongoDB** is running on `mongodb://localhost:27017`.
- Both the **frontend** and **backend** servers need to be running simultaneously.
- The application uses **JWT for authentication**; tokens are stored in `localStorage`.
- Replace `your-secret-key` in the `.env` file with a strong, unique key.

## Project Structure

- **backend**: Contains the FastAPI backend code (`main.py`).
- **frontend**: Contains the React frontend code.

## Backend Dependencies (`backend/requirements.txt`)

```plaintext
fastapi==0.85.0
uvicorn==0.18.2
pymongo==4.2.0
passlib[bcrypt]==1.7.4
python-jose[cryptography]==3.3.0
python-dotenv==0.20.0
email-validator==1.2.1
```

## Frontend Dependencies

- Listed in `frontend/package.json`.
