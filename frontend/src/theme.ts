// src/theme.ts

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FF4500", // Reddit's orange color
    },
    background: {
      default: "#1a1a1b", // Dark background
      paper: "#1a1a1b",
    },
    text: {
      primary: "#d7dadc",
      secondary: "#818384",
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          cursor: "pointer",
          color: "#1976d2",
          "&:hover": {
            textDecoration: "underline",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

export default theme;
