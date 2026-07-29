import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import useAuth from "../hooks/useAuth";

export default function AuthPage({ mode = "login" }) {
  const isRegistering = mode === "register";
  const { login, register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters");
      return;
    }

    try {
      setIsSubmitting(true);
      if (isRegistering) {
        await register(form);
      } else {
        await login({ email: form.email, password: form.password });
      }
      window.history.pushState({}, "", "/dashboard");
      window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to complete authentication");
    } finally {
      setIsSubmitting(false);
    }
  }

  const alternatePath = isRegistering ? "/login" : "/register";
  const alternateLabel = isRegistering ? "Already have an account? Log in" : "Need an account? Register";

  return (
    <Box className="auth-shell">
      <Container maxWidth="sm">
        <Card className="auth-card" elevation={8}>
          <CardContent>
            <Stack spacing={3} component="form" onSubmit={handleSubmit}>
              <Box>
                <Typography color="primary" variant="overline" fontWeight={700}>
                  Secure workspace
                </Typography>
                <Typography variant="h3" component="h1" fontWeight={800}>
                  {isRegistering ? "Create your account" : "Welcome back"}
                </Typography>
                <Typography color="text.secondary">
                  {isRegistering
                    ? "Register to manage your customer API dashboard."
                    : "Sign in to access your protected customer dashboard."}
                </Typography>
              </Box>

              {error && <Alert severity="error">{error}</Alert>}

              {isRegistering && (
                <TextField name="name" label="Full name" value={form.name} onChange={handleChange} required autoFocus />
              )}
              <TextField name="email" label="Email address" type="email" value={form.email} onChange={handleChange} required autoFocus={!isRegistering} />
              <TextField name="password" label="Password" type="password" value={form.password} onChange={handleChange} required helperText="At least 6 characters" />
              <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : isRegistering ? "Create account" : "Log in"}
              </Button>
              <Link component="button" type="button" underline="hover" onClick={() => { window.history.pushState({}, "", alternatePath); window.dispatchEvent(new PopStateEvent("popstate")); }}>
                {alternateLabel}
              </Link>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
