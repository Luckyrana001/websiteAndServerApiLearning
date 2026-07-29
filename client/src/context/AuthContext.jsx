import { useCallback, useEffect, useMemo, useState } from "react";

import { AuthContext } from "./authContext";
import { loginUser, registerUser } from "../services/authApi";

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("authUser")) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    const handleLogout = () => setUser(null);

    window.addEventListener("auth:logout", handleLogout);

    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const saveSession = useCallback((response) => {
    localStorage.setItem("accessToken", response.token);
    localStorage.setItem("authUser", JSON.stringify(response.user));
    setUser(response.user);
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await loginUser(credentials);
    saveSession(response);
    return response;
  }, [saveSession]);

  const register = useCallback(async (userData) => {
    const response = await registerUser(userData);
    saveSession(response);
    return response;
  }, [saveSession]);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading: false, isAuthenticated: Boolean(user), login, register, logout }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
