// src/components/CommentItem.tsx

import React, { useState } from "react";
import { Comment } from "../types";
import {
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  Link,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";

interface CommentItemProps {
  comment: Comment;
  onCommentAdded: () => void;
  level: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onCommentAdded,
  level,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  const handleReply = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleUpvote = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `http://localhost:8000/comments/${comment.id}/upvote`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        onCommentAdded();
      });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSaveEdit = () => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `http://localhost:8000/comments/${comment.id}`,
        { content: editedContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setIsEditing(false);
        onCommentAdded();
      })
      .catch((error) => {
        console.error("Error updating comment:", error);
      });
  };

  return (
    <Box
      sx={{
        mt: 4,
        ml: `${level * 2}rem`,
        borderLeft: level > 0 ? "2px solid rgba(255, 255, 255, 0.2)" : "none",
        pl: 2,
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        <Link
          component={RouterLink}
          to={`/user/${comment.author.id}`}
          underline="hover"
        >
          {comment.author.name}
        </Link>{" "}
        ({comment.author.level}) •{" "}
        {new Date(comment.createdAt).toLocaleString()}
      </Typography>
      {isEditing ? (
        <>
          <TextField
            multiline
            rows={3}
            variant="outlined"
            fullWidth
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="You can use Markdown and LaTeX here..."
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveEdit}
            sx={{ mr: 2 }}
          >
            Save
          </Button>
          <Button variant="outlined" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </>
      ) : (
        <>
          <div style={{ marginBottom: "16px" }}>
            <ReactMarkdown
              children={comment.content}
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            />
          </div>
          <Button
            size="small"
            onClick={handleReply}
            sx={{ mr: 2 }}
            variant="text"
          >
            Reply
          </Button>
          <Button
            size="small"
            onClick={handleUpvote}
            sx={{ mr: 2 }}
            variant="text"
          >
            Upvote ({comment.upvotes})
          </Button>
          {comment.canEdit && (
            <Button size="small" onClick={handleEdit} variant="text">
              Edit
            </Button>
          )}
        </>
      )}
      {showReplyForm && (
        <CommentForm
          parentId={comment.id}
          parentType="comment"
          onCommentAdded={onCommentAdded}
        />
      )}
      {comment.replies && comment.replies.length > 0 && (
        <CommentList
          comments={comment.replies}
          onCommentAdded={onCommentAdded}
          level={level + 1}
        />
      )}
      <Divider sx={{ mt: 4 }} />
    </Box>
  );
};

export default CommentItem;
