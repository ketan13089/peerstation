// src/App.tsx

import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ThreadPage from "./pages/ThreadPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateThreadPage from "./pages/CreateThreadPage";
import UserProfilePage from "./pages/UserProfilePage";
import Navbar from "./components/Navbar";
import Bot from "./pages/Bot";
import Profilepage from "./pages/UP";
import Courses from "./pages/courses";


const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Bot" element={<Bot/>} />
        <Route path="/thread/:id" element={<ThreadPage />} />
        <Route path="/create-thread" element={<CreateThreadPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/user/:userId" element={<UserProfilePage />} />
        <Route path="/UP" element={<Profilepage/>} />
        <Route path="/thread" element={<CreateThreadPage/>} />
        <Route path="/courses" element={<Courses/>} />
      </Routes>
    </Router>
  </ThemeProvider>
);

export default App;
