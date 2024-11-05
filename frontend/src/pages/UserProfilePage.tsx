// src/pages/UserProfilePage.tsx

import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Avatar, Box, CircularProgress, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserProfile } from "../types";

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/users/${userId}`)
      .then((response) => {
        setProfile(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
        {profile && (
          <>
            <Avatar 
              alt={profile.name} 
              src="/static/images/avatar/1.jpg" 
              sx={{ width: 120, height: 120, mx: "auto", mb: 2 }} 
            />
            <Typography variant="h4" gutterBottom>
              {profile.name}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ textAlign: "left" }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Level:</strong> {profile.level}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Stars:</strong> {profile.stars}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Email:</strong> {profile.email}
              </Typography>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default UserProfilePage;
