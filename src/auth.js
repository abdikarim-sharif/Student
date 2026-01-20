// src/config/auth.js
import apiClient from "./client";

export const login = async (data) => {
  const res = await apiClient.post("/auth/login", data);
  return res.data; // { token, user }
};

export const register = async (data) => {
  const res = await apiClient.post("/auth/register", data);
  return res.data; // { message } or { token, user }
};

export const fetchMe = async () => {
  const res = await apiClient.get("/auth/me");
  return res.data; // { user }
};
