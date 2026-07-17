import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/admin/",
});

api.interceptors.request.use((config) => {
  // Skip auth header for public endpoints
  if (config.url === "staff/login/" || config.url === "staff/signup/") {
    return config;
  }

  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
