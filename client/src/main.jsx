import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import AppProviders from "./AppProviders.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>
);
