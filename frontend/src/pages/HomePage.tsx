// src/pages/HomePage.tsx

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Pagination,
  Box,
  Avatar,
  Divider,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { Thread, ThreadListResponse } from "../types";

const HomePage: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10; // Number of threads per page

  const fetchThreads = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:8000/threads?page=${page}&limit=${limit}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((response) => {
        const data: ThreadListResponse = response.data;
        setThreads(data.threads);
        setTotalPages(Math.ceil(data.total / data.limit));
      })
      .catch((error) => {
        console.error("Error fetching threads:", error);
      });
  };

  useEffect(() => {
    fetchThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Threads
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={RouterLink}
        to="/create-thread"
        sx={{ mb: 4 }}
      >
        Create New Thread
      </Button>
      <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper', borderRadius: 2, p: 2 }}>
        {threads.map((thread, index) => (
          <Box key={thread.id}>
            <ListItem
              component={RouterLink}
              to={`/thread/${thread.id}`}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                p: 2,
                borderRadius: 1,
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
                mb: index !== threads.length - 1 ? 1 : 0, // margin only between items
              }}
            >
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                {thread.author.name.charAt(0)}
              </Avatar>

              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {thread.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    Posted by <strong>{thread.author.name}</strong> •{' '}
                    {new Date(thread.createdAt).toLocaleString()}
                  </Typography>
                }
              />
            </ListItem>

            {index !== threads.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
      <Box display="flex" justifyContent="center" sx={{ mt: 4, mb: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default HomePage;
