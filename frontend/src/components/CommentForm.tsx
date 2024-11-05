// src/components/CommentForm.tsx

import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";

interface CommentFormProps {
  parentId: string;
  parentType: "thread" | "comment";
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  parentId,
  parentType,
  onCommentAdded,
}) => {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        "http://localhost:8000/comments",
        { content, parentId, parentType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setContent("");
        onCommentAdded();
      })
      .catch((error) => {
        console.error("Error posting comment:", error);
      });
  };

  return (
    <div style={{ marginTop: "16px" }}>
      <TextField
        multiline
        rows={3}
        variant="outlined"
        fullWidth
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment here..."
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        style={{ marginTop: "8px" }}
      >
        Submit
      </Button>
    </div>
  );
};

export default CommentForm;
