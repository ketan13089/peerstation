// src/pages/ThreadPage.tsx

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Divider,
  Button,
  TextField,
  Link,
} from "@mui/material";
import { useParams, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { Thread } from "../types";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";

const ThreadPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [thread, setThread] = useState<Thread | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  const fetchThread = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:8000/threads/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((response) => {
        setThread(response.data);
      });
  };

  useEffect(() => {
    fetchThread();
  }, [id]);

  const handleUpvote = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `http://localhost:8000/threads/${thread?.id}/upvote`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        fetchThread();
      });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTitle(thread?.title || "");
    setEditedContent(thread?.content || "");
  };

  const handleSaveEdit = () => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `http://localhost:8000/threads/${thread?.id}`,
        {
          title: editedTitle,
          content: editedContent,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setIsEditing(false);
        fetchThread();
      })
      .catch((error) => {
        console.error("Error updating thread:", error);
      });
  };

  return (
    <Container sx={{ mt: 4 }}>
      {thread ? (
        <>
          {isEditing ? (
            <>
              <TextField
                label="Title"
                fullWidth
                margin="normal"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
              <TextField
                label="Content"
                fullWidth
                margin="normal"
                multiline
                rows={10}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder="You can use Markdown and LaTeX here..."
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveEdit}
                sx={{ mr: 2, mt: 2 }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsEditing(false)}
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h4" gutterBottom>
                {thread.title}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Posted by{" "}
                <Link
                  component={RouterLink}
                  to={`/user/${thread.author.id}`}
                  underline="hover"
                >
                  {thread.author.name}
                </Link>{" "}
                ({thread.author.level}) •{" "}
                {new Date(thread.createdAt).toLocaleString()}
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={handleUpvote}
                sx={{ mr: 2, mt: 2 }}
              >
                Upvote ({thread.upvotes})
              </Button>
              {thread.canEdit && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleEdit}
                  sx={{ mt: 2 }}
                >
                  Edit
                </Button>
              )}
              <Divider sx={{ my: 4 }} />
              <div style={{ marginBottom: "16px" }}>
                <ReactMarkdown
                  children={thread.content}
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                />
              </div>
            </>
          )}
          <Divider sx={{ my: 4 }} />
          <CommentForm
            parentId={thread.id}
            parentType="thread"
            onCommentAdded={fetchThread}
          />
          <CommentList
            comments={thread.comments}
            onCommentAdded={fetchThread}
          />
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Container>
  );
};

export default ThreadPage;
