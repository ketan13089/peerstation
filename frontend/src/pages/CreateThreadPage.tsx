// src/pages/CreateThreadPage.tsx

import React, { useState } from "react";
import { Container, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateThreadPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        "http://localhost:8000/threads",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        navigate(`/thread/${response.data.id}`);
      })
      .catch((error) => {
        console.error("Error creating thread:", error);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create New Thread
      </Typography>
      <TextField
        label="Title"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="Content"
        fullWidth
        margin="normal"
        multiline
        rows={10}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="You can use Markdown and LaTeX here..."
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        style={{ marginTop: "16px" }}
      >
        Submit
      </Button>
    </Container>
  );
};

export default CreateThreadPage;
