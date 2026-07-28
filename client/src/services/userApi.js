import apiClient from "../api/apiClient";

export async function getUsers() {
  const response = await apiClient.get("/users");
  return response.data;
}

export async function createUser(userData) {
  const response = await apiClient.post("/users", userData);
  return response.data;
}

export async function updateUser(userId, userData) {
  const response = await apiClient.put(`/users/${userId}`, userData);
  return response.data;
}

export async function deleteUser(userId) {
  const response = await apiClient.delete(`/users/${userId}`);
  return response.data;
}