import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

import useAuth from "../hooks/useAuth";
import UserPage from "./UserPage";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    window.history.pushState({}, "", "/login");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <Box className="dashboard-shell">
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
            Customer dashboard
          </Typography>
          <Typography sx={{ mr: 2, display: { xs: "none", sm: "block" } }}>
            {user?.name}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Log out</Button>
        </Toolbar>
      </AppBar>
      <UserPage />
    </Box>
  );
}
