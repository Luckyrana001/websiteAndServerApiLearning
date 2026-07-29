import { useEffect, useState } from "react";

import useAuth from "./hooks/useAuth";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const { isLoading, isAuthenticated } = useAuth();
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleNavigation = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handleNavigation);
    window.addEventListener("auth:logout", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handleNavigation);
      window.removeEventListener("auth:logout", handleNavigation);
    };
  }, []);

  if (isLoading) return null;
  if (isAuthenticated) return <DashboardPage />;
  return <AuthPage mode={path === "/register" ? "register" : "login"} />;
}

export default App;
