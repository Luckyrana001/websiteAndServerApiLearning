import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import AppProviders from "./AppProviders.jsx";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>
);
