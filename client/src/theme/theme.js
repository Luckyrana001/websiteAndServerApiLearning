import { createTheme } from "@mui/material/styles";

export function createAppTheme(mode = "light") {
  const dark = mode === "dark";
  const ink = "#1d224e";
  const pink = "#ff0084";
  const cyan = "#35e6e1";
  const canvas = dark ? "#141936" : "#f6f7fc";
  const paper = dark ? "#202653" : "#ffffff";

  return createTheme({
    palette: {
      mode,
      primary: { main: pink, contrastText: "#ffffff" },
      secondary: { main: cyan, contrastText: ink },
      background: { default: canvas, paper },
      text: { primary: dark ? "#fff" : ink, secondary: dark ? "#bdbdbd" : "#626262" },
      divider: dark ? "#343434" : "#e4e4df",
    },
    typography: {
      fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
      h1: { fontWeight: 900, letterSpacing: "-0.065em" },
      h2: { fontWeight: 900, letterSpacing: "-0.06em" },
      h3: { fontWeight: 900, letterSpacing: "-0.055em" },
      h4: { fontWeight: 900, letterSpacing: "-0.045em" },
      h5: { fontWeight: 850, letterSpacing: "-0.035em" },
      button: { fontWeight: 850, textTransform: "none", letterSpacing: "-.01em" },
    },
    shape: { borderRadius: 22 },
    components: {
      MuiCssBaseline: { styleOverrides: { body: { margin: 0, backgroundColor: canvas }, "*, *::before, *::after": { boxSizing: "border-box" } } },
      MuiCard: { styleOverrides: { root: { border: `1px solid ${dark ? "#333" : "#e5e5df"}`, boxShadow: dark ? "0 18px 45px rgba(0,0,0,.24)" : "0 14px 36px rgba(20,20,20,.07)" } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiButton: { styleOverrides: { root: { borderRadius: 999, minHeight: 44, paddingInline: 22 }, containedPrimary: { boxShadow: "none", "&:hover": { backgroundColor: "#d90070", boxShadow: "none" } }, outlined: { borderWidth: 2 } } },
      MuiChip: { styleOverrides: { root: { borderRadius: 999, fontWeight: 800 } } },
      MuiTextField: { defaultProps: { variant: "outlined" } },
      MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 14, color: dark ? "#ffffff" : ink }, notchedOutline: { borderColor: dark ? "#626a9b" : "#cbd1e5" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: dark ? cyan : ink }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: pink } } },
      MuiInputLabel: { styleOverrides: { root: { color: dark ? "#d5d9f2" : "#5e6684", "&.Mui-focused": { color: dark ? cyan : ink } } } },
      MuiSelect: { styleOverrides: { icon: { color: dark ? "#d5d9f2" : ink } } },
      MuiFormHelperText: { styleOverrides: { root: { color: dark ? "#b9c0df" : "#68708d" } } },
      MuiDataGrid: { styleOverrides: { root: { color: dark ? "#ffffff" : ink, borderColor: dark ? "#454d7d" : "#e2e5f0" }, columnHeaders: { backgroundColor: dark ? "#292f63" : "#f1f3fa", color: dark ? "#ffffff" : ink, borderColor: dark ? "#454d7d" : "#e2e5f0" }, cell: { borderColor: dark ? "#343b69" : "#e2e5f0" }, footerContainer: { backgroundColor: dark ? "#292f63" : "#f1f3fa", color: dark ? "#ffffff" : ink, borderColor: dark ? "#454d7d" : "#e2e5f0" } } },
    },
  });
}
