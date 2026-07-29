import apiClient from "../api/apiClient";

export async function getDashboard() {
  const response = await apiClient.get("/dashboard");
  return response.data;
}

export async function getLeaderboard() {
  const response = await apiClient.get("/dashboard/leaderboard");
  return response.data;
}

export async function startQuiz(quizId) {
  const response = await apiClient.post(`/quizzes/${quizId}/start`);
  return response.data;
}

export async function submitQuiz(quizId, answers) {
  const response = await apiClient.post(`/quizzes/${quizId}/submit`, { answers });
  return response.data;
}

export async function getAdminDashboard() {
  const response = await apiClient.get("/dashboard/admin");
  return response.data;
}

export async function createQuiz(quiz) {
  const response = await apiClient.post("/quizzes", quiz);
  return response.data;
}

export async function updateQuizStatus(quizId, status) {
  const response = await apiClient.patch(`/quizzes/${quizId}/status`, { status });
  return response.data;
}

export async function allowQuizRetake(quizId, userId) {
  const response = await apiClient.post(`/quizzes/${quizId}/retake/${userId}`);
  return response.data;
}
