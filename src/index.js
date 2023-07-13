import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/styles/index.css";
import "./assets/styles/fonts.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/system";
import { theme } from "./theme/materialTheme";
import { AuthProvider } from "./context/AuthContext";
import "./api/axios";
import DefiProvider from "./context/DefiContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <DefiProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </DefiProvider>
    </AuthProvider>
  </BrowserRouter>
);
