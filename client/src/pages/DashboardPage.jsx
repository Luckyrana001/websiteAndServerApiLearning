import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

import useAuth from "../hooks/useAuth";
import UserPage from "./UserPage";
import medalImage from "../assets/badges/achievement-medal.png";
import {
  createQuiz,
  allowQuizRetake,
  getAdminDashboard,
  getDashboard,
  getLeaderboard,
  startQuiz,
  submitQuiz,
  updateQuizStatus,
} from "../services/dashboardApi";

function Metric({ label, value, color = "primary" }) {
  return <Card className="metric-card"><CardContent><Typography color="text.secondary" variant="body2" fontWeight={700}>{label}</Typography><Typography variant="h4" color={color} fontWeight={900}>{value}</Typography></CardContent></Card>;
}

function BadgeTile({ badge, index }) {
  return <Box className="badge-tile"><Box className="badge-image" component="img" src={medalImage} alt="Achievement badge" sx={{ width: "36px !important", height: "36px !important", filter: `hue-rotate(${index * 38}deg)` }} /><Typography variant="caption" fontWeight={800}>{badge.replaceAll("-", " ")}</Typography></Box>;
}

function LeaderboardTile({ entry, index }) {
  const rankClass = index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : "standard";
  return <Box className={`leaderboard-tile ${rankClass}`}><Box className="rank-number">{index + 1}</Box><Box sx={{ flexGrow: 1, minWidth: 0 }}><Typography fontWeight={800} noWrap>{entry.name}</Typography><Typography variant="caption" color="text.secondary">Quiz champion</Typography></Box><Typography fontWeight={900}>{entry.points}<Typography component="span" variant="caption" color="text.secondary"> pts</Typography></Typography></Box>;
}

function QuizCard({ quiz, onRefresh, inProgress = false }) {
  const [answers, setAnswers] = useState({});
  const [started, setStarted] = useState(inProgress);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleOption(question, optionId) {
    setAnswers((current) => {
      const selected = new Set(current[question._id] || []);
      if (question.allowMultiple) {
        selected.has(optionId) ? selected.delete(optionId) : selected.add(optionId);
      } else {
        selected.clear();
        selected.add(optionId);
      }
      return { ...current, [question._id]: [...selected] };
    });
  }

  async function begin() {
    setLoading(true);
    try { setError(""); await startQuiz(quiz._id); setStarted(true); } catch (requestError) { setError(requestError.response?.data?.message || "Unable to start quiz"); } finally { setLoading(false); }
  }

  async function finish() {
    setLoading(true);
    try {
      const response = await submitQuiz(quiz._id, Object.entries(answers).map(([questionId, optionIds]) => ({ questionId, optionIds })));
      setResult(response);
      onRefresh();
    } catch (requestError) { setError(requestError.response?.data?.message || "Unable to submit quiz"); } finally { setLoading(false); }
  }

  return <Card sx={{ height: "100%" }}>
    <CardContent>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" fontWeight={800}>{quiz.title}</Typography>
          <Typography color="text.secondary">{quiz.description}</Typography>
        </Box>
        {error && <Alert severity="warning">{error}</Alert>}
        {quiz.imageUrl && <Box component="img" src={quiz.imageUrl} alt={quiz.title} sx={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 2 }} />}
        {!started && !result && <Button variant="contained" onClick={begin} disabled={loading}>{loading ? "Starting..." : "Start quiz"}</Button>}
        {started && !result && quiz.questions.map((question, index) => <Box key={question._id}>
          <Typography fontWeight={700}>{index + 1}. {question.text}</Typography>
          {question.imageUrl && <Box component="img" src={question.imageUrl} alt="Question" sx={{ maxWidth: "100%", maxHeight: 180, mt: 1, borderRadius: 2 }} />}
          <Stack spacing={1} sx={{ mt: 1 }}>{question.options.map((option) => <Button key={option._id} variant={(answers[question._id] || []).includes(option._id) ? "contained" : "outlined"} onClick={() => toggleOption(question, optionId(option))} sx={{ justifyContent: "flex-start" }}>{option.text}</Button>)}</Stack>
        </Box>)}
        {started && !result && <Button variant="contained" onClick={finish} disabled={loading}>{loading ? "Submitting..." : "Submit quiz"}</Button>}
        {result && <Alert severity="success">Score: {result.attempt.score}% · Points earned: {result.attempt.pointsAwarded}</Alert>}
      </Stack>
    </CardContent>
  </Card>;
}

function optionId(option) { return option._id; }

function UserDashboard({ data, leaderboard, refresh }) {
  const user = data.user;
  return <Container maxWidth="xl" sx={{ py: 4 }}>
    <Typography variant="h4" fontWeight={800} gutterBottom>Welcome, {user?.name}</Typography>
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, sm: 4 }}><Metric label="Your points" value={user?.points ?? 0} /></Grid>
      <Grid size={{ xs: 12, sm: 4 }}><Metric label="Active quizzes" value={data.activeQuizzes?.length ?? 0} color="success.main" /></Grid>
      <Grid size={{ xs: 12, sm: 4 }}><Metric label="Badges" value={user?.badges?.length ?? 0} color="secondary.main" /></Grid>
    </Grid>
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}><Typography variant="h5" fontWeight={800} gutterBottom>Active quizzes</Typography><Grid container spacing={2}>{data.activeQuizzes?.map((quiz) => <Grid size={{ xs: 12, md: 6 }} key={quiz._id}><QuizCard quiz={quiz} inProgress={data.inProgress?.some((attempt) => attempt.quiz?._id === quiz._id || attempt.quiz === quiz._id)} onRefresh={refresh} /></Grid>)}</Grid></Grid>
      <Grid size={{ xs: 12, md: 4 }}><SidePanel title="In progress"><Stack spacing={1}>{data.inProgress?.length ? data.inProgress.map((attempt) => <Box className="progress-row" key={attempt._id}><Box className="progress-dot" /><Typography fontWeight={700}>{attempt.quiz?.title || "Quiz attempt"}</Typography><Chip size="small" label="Resume" color="primary" variant="outlined" /></Box>) : <Typography color="text.secondary">No quizzes in progress.</Typography>}</Stack></SidePanel><SidePanel title="Your badges"><Box className="badge-grid">{user?.badges?.length ? user.badges.map((badge, index) => <BadgeTile key={badge} badge={badge} index={index} />) : <Typography color="text.secondary">Complete quizzes to earn badges.</Typography>}</Box></SidePanel><SidePanel title="Leaderboard"><Stack spacing={1}>{leaderboard.slice(0, 5).map((entry, index) => <LeaderboardTile key={entry._id} entry={entry} index={index} />)}</Stack></SidePanel><SidePanel title="Rewards">{data.rewards?.map((reward) => <Box className="reward-row" key={reward._id}><Box><Typography fontWeight={700}>{reward.name}</Typography><Typography variant="caption" color="text.secondary">Redeem your points</Typography></Box><Chip size="small" label={`${reward.pointsCost} pts`} /></Box>)}</SidePanel></Grid>
    </Grid>
  </Container>;
}

function SidePanel({ title, children }) { return <Paper className="side-panel" sx={{ p: 2.5, mb: 2 }}><Typography variant="overline" color="primary" fontWeight={900}>{title}</Typography><Typography variant="h6" fontWeight={900} gutterBottom>{title === "Leaderboard" ? "Top performers" : title}</Typography><Stack spacing={1}>{children}</Stack></Paper>; }

function AdminDashboard({ data, refresh }) {
  const [form, setForm] = useState({ title: "", description: "", imageUrl: "", question: "", questionImageUrl: "", options: "", correct: "" });
  const [message, setMessage] = useState("");
  async function handleCreate(event) {
    event.preventDefault();
    const options = form.options.split(",").map((text) => text.trim()).filter(Boolean).map((text, index) => ({ text, isCorrect: form.correct.split(",").map(Number).includes(index + 1) }));
    await createQuiz({ title: form.title, description: form.description, imageUrl: form.imageUrl, questions: [{ text: form.question, imageUrl: form.questionImageUrl, options, allowMultiple: options.filter((option) => option.isCorrect).length > 1 }] });
    setForm({ title: "", description: "", imageUrl: "", question: "", questionImageUrl: "", options: "", correct: "" });
    setMessage("Quiz created as inactive. Activate it from the quiz list.");
    refresh();
  }
  return <Container maxWidth="xl" sx={{ py: 4 }}><Typography variant="h4" fontWeight={800} gutterBottom>Admin dashboard</Typography><Grid container spacing={2} sx={{ mb: 3 }}><Grid size={{ xs: 6, md: 3 }}><Metric label="Users" value={data.stats.users} /></Grid><Grid size={{ xs: 6, md: 3 }}><Metric label="Quizzes" value={data.stats.quizzes} /></Grid><Grid size={{ xs: 6, md: 3 }}><Metric label="Active quizzes" value={data.stats.activeQuizzes} color="success.main" /></Grid><Grid size={{ xs: 6, md: 3 }}><Metric label="Completed attempts" value={data.stats.completedAttempts} color="secondary.main" /></Grid></Grid><Grid container spacing={3}><Grid size={{ xs: 12, md: 5 }}><Paper component="form" onSubmit={handleCreate} sx={{ p: 3 }}><Typography variant="h6" fontWeight={800} gutterBottom>Create quiz</Typography><Stack spacing={2}>{message && <Alert severity="success">{message}</Alert>}<TextField label="Quiz title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /><TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /><TextField label="Quiz image URL (optional)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /><TextField label="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required /><TextField label="Question image URL (optional)" value={form.questionImageUrl} onChange={(e) => setForm({ ...form, questionImageUrl: e.target.value })} /><TextField label="Options (comma separated)" value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} required /><TextField label="Correct option numbers" helperText="Example: 1 or 1,3" value={form.correct} onChange={(e) => setForm({ ...form, correct: e.target.value })} required /><Button type="submit" variant="contained">Create inactive quiz</Button></Stack></Paper></Grid><Grid size={{ xs: 12, md: 7 }}><Paper sx={{ p: 3 }}><Typography variant="h6" fontWeight={800} gutterBottom>Quiz status</Typography><Stack spacing={1}>{data.quizzes.map((quiz) => <Stack direction="row" alignItems="center" justifyContent="space-between" key={quiz._id}><Box><Typography fontWeight={700}>{quiz.title}</Typography><Typography variant="body2" color="text.secondary">{quiz.questions.length} question(s)</Typography></Box><Select size="small" value={quiz.status} onChange={async (e) => { await updateQuizStatus(quiz._id, e.target.value); refresh(); }}><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem></Select></Stack>)}</Stack></Paper><Paper sx={{ p: 3, mt: 3 }}><Typography variant="h6" fontWeight={800} gutterBottom>Completed quizzes — allow retake</Typography>{data.completedAttempts?.length ? data.completedAttempts.map((attempt) => <Stack direction="row" alignItems="center" justifyContent="space-between" key={attempt._id} sx={{ py: 1, borderBottom: 1, borderColor: "divider" }}><Box><Typography fontWeight={700}>{attempt.user?.name} — {attempt.quiz?.title}</Typography><Typography variant="body2" color="text.secondary">Score: {attempt.score}%</Typography></Box><Button size="small" variant="outlined" onClick={async () => { await allowQuizRetake(attempt.quiz._id, attempt.user._id); refresh(); }}>Allow retake</Button></Stack>) : <Typography color="text.secondary">No completed attempts.</Typography>}</Paper><Paper sx={{ p: 3, mt: 3 }}><Typography variant="h6" fontWeight={800} gutterBottom>Users</Typography>{data.users.map((entry) => <Stack direction="row" justifyContent="space-between" key={entry._id} sx={{ py: 1, borderBottom: 1, borderColor: "divider" }}><Typography>{entry.name}<br /><small>{entry.email}</small></Typography><Typography>{entry.points} pts</Typography></Stack>)}</Paper></Grid></Grid></Container>;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");
  const [tab, setTab] = useState(0);
  const isAdmin = user?.role === "admin";

  const refresh = useCallback(async () => {
    try { setError(""); setData(isAdmin ? await getAdminDashboard() : await getDashboard()); if (!isAdmin) setLeaderboard((await getLeaderboard()).leaderboard); } catch (requestError) { setError(requestError.response?.data?.message || "Unable to load dashboard"); }
  }, [isAdmin]);
  useEffect(() => {
    // Dashboard data is loaded once when the authenticated dashboard mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  function handleLogout() { logout(); window.history.pushState({}, "", "/login"); window.dispatchEvent(new PopStateEvent("popstate")); }
  if (!data) return <Box sx={{ p: 8, textAlign: "center" }}>{error ? <Alert severity="error">{error}</Alert> : <CircularProgress />}</Box>;

  return <Box className="dashboard-shell"><AppBar position="sticky" elevation={0}><Toolbar><Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>Quiz rewards platform</Typography><Chip label={isAdmin ? "Admin" : "Player"} sx={{ mr: 2 }} /><Typography sx={{ mr: 2, display: { xs: "none", sm: "block" } }}>{user?.name}</Typography><Button color="inherit" onClick={handleLogout}>Log out</Button></Toolbar>{isAdmin && <Tabs value={tab} onChange={(_event, value) => setTab(value)} textColor="inherit" indicatorColor="secondary"><Tab label="Admin dashboard" /><Tab label="Manage users" /></Tabs>}</AppBar>{error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}{isAdmin ? (tab === 0 ? <AdminDashboard data={data} refresh={refresh} /> : <UserPage />) : <UserDashboard data={data} leaderboard={leaderboard} refresh={refresh} />}</Box>;
}
