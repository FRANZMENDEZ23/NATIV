import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "./styles.css";
import App from "./App.jsx";
import AdminPanel from "./components/AdminPanel.jsx";

const isAdminRoute = window.location.pathname === "/admin";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isAdminRoute ? <AdminPanel /> : <App />}
  </React.StrictMode>,
);