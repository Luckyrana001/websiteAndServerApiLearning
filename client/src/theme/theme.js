import { createTheme } from "@mui/material/styles";

export function createAppTheme(mode = "light") {
  const dark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: { main: dark ? "#6ee7d8" : "#0b7e70", contrastText: dark ? "#06111f" : "#ffffff" },
      secondary: { main: dark ? "#8aaeff" : "#496fca" },
      background: { default: dark ? "#081321" : "#f3f6fb", paper: dark ? "#101e31" : "#ffffff" },
      text: { primary: dark ? "#f3f7ff" : "#10213d", secondary: dark ? "#a8b7ca" : "#607089" },
      divider: dark ? "#263952" : "#dbe3ef",
    },
    typography: {
      fontFamily: "Montserrat, system-ui, sans-serif",
      h1: { fontWeight: 900, letterSpacing: "-0.04em" },
      h2: { fontWeight: 900, letterSpacing: "-0.04em" },
      h3: { fontWeight: 900, letterSpacing: "-0.035em" },
      h4: { fontWeight: 900, letterSpacing: "-0.03em" },
      button: { fontWeight: 800, textTransform: "none" },
    },
    shape: { borderRadius: 16 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { margin: 0, backgroundColor: dark ? "#081321" : "#f3f6fb" },
          "*, *::before, *::after": { boxSizing: "border-box" },
        },
      },
      MuiCard: { styleOverrides: { root: { border: `1px solid ${dark ? "#263952" : "#dbe3ef"}`, boxShadow: dark ? "0 20px 48px rgba(0,0,0,.28)" : "0 18px 42px rgba(31,52,84,.10)" } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiButton: { styleOverrides: { root: { borderRadius: 12, paddingInline: 18 } } },
      MuiTextField: { defaultProps: { variant: "outlined" } },
    },
  });
}
