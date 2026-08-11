import axios from "axios";

const api = axios.create({
  baseURL: "https://crm-backend-ejfr.onrender.com/api/admin/",
});

api.interceptors.request.use((config) => {
  if (
    config.url === "staff/login/" ||
    config.url === "staff/signup/"
  ) {
    return config;
  }

  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;