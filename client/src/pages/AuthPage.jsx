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
    <Box sx={{ minHeight: "100svh", display: "grid", placeItems: "center", p: { xs: 2, sm: 5 }, bgcolor: "#071426", backgroundImage: "radial-gradient(circle at 12% 10%, rgba(62,128,255,.25), transparent 32%), radial-gradient(circle at 90% 90%, rgba(0,217,174,.16), transparent 28%)" }}>
      <Container maxWidth="lg" sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 480px" }, alignItems: "center", gap: { xs: 4, md: 10, lg: 15 } }}>
        <Box sx={{ position: "relative", minHeight: { xs: "auto", md: 560 }, py: 4, color: "#fff", overflow: "hidden" }}>
          <Typography sx={{ color: "#67e8d2", fontSize: 14, fontWeight: 900, letterSpacing: 3 }}>QUIZFORGE</Typography>
          <Typography variant="h2" component="h1" sx={{ maxWidth: 620, my: 3, color: "#fff", fontSize: { xs: 48, md: 76 }, lineHeight: .98, letterSpacing: "-0.06em" }}>
            Learn fast.<br />Earn your place.
          </Typography>
          <Typography sx={{ maxWidth: 430, color: "#a9bad3", fontSize: 18, lineHeight: 1.6 }}>
            A focused space for challenges, progress, rewards, and friendly competition.
          </Typography>
          <Box sx={{ display: { xs: "none", md: "block" }, position: "absolute", right: "3%", bottom: 80, width: 250, height: 250 }}><Box sx={{ position: "absolute", inset: 0, border: "1px solid rgba(103,232,210,.26)", borderRadius: "50%", transform: "rotate(24deg) scaleX(1.8)" }} /><Box sx={{ position: "absolute", inset: 0, border: "1px solid rgba(91,137,255,.3)", borderRadius: "50%", transform: "rotate(-36deg) scaleX(1.8)" }} /><Box sx={{ position: "absolute", inset: 82, display: "grid", placeItems: "center", border: "1px solid rgba(103,232,210,.6)", borderRadius: "50%", color: "#67e8d2", bgcolor: "rgba(103,232,210,.08)", fontSize: 42, boxShadow: "0 0 70px rgba(103,232,210,.2)" }}>★</Box></Box>
          <Stack direction="row" spacing={3} sx={{ mt: { xs: 4, md: 0 }, position: { md: "absolute" }, bottom: { md: 22 }, left: 0 }}>{[["5k+", "players"], ["120+", "challenges"], ["4.9", "community rating"]].map(([value, label]) => <Box key={label} sx={{ display: "flex", flexDirection: "column", minWidth: 100 }}><Typography sx={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>{value}</Typography><Typography sx={{ color: "#7890ad", fontSize: 12 }}>{label}</Typography></Box>)}</Stack>
        </Box>
        <Card elevation={0} sx={{ borderRadius: 4, bgcolor: "background.paper", boxShadow: "0 28px 80px rgba(0,0,0,.3)" }}>
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            <Stack spacing={3} component="form" onSubmit={handleSubmit}>
              <Box>
                <Typography color="primary" variant="overline" fontWeight={800} letterSpacing={1.5}>
                  {isRegistering ? "Join the community" : "Welcome back"}
                </Typography>
                <Typography variant="h3" component="h1" fontWeight={900} sx={{ my: 1, fontSize: { xs: 32, sm: 42 } }}>
                  {isRegistering ? "Create your account" : "Sign in to QuizForge"}
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
              <Button type="submit" variant="contained" size="large" disabled={isSubmitting} sx={{ minHeight: 52, borderRadius: 1.5, bgcolor: "primary.main", boxShadow: "0 10px 20px rgba(11,126,112,.22)" }}>
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
