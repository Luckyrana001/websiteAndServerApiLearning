import { useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { createAppTheme } from "./theme/theme.js";

export default function AppProviders() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(() => createAppTheme(prefersDark ? "dark" : "light"), [prefersDark]);

  return <ThemeProvider theme={theme}><CssBaseline /><AuthProvider><App /></AuthProvider></ThemeProvider>;
}
