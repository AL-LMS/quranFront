import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/styles/index.css";
import "./assets/styles/fonts.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./api/axios";
import AppProviders from "./app/AppProviders";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AppProviders>
      <App />
    </AppProviders>
  </BrowserRouter>
);
