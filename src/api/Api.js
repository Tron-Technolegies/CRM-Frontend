import axios from "axios";

const RAW_API_ROOT =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://crm-backend-ejfr.onrender.com"
    : "http://127.0.0.1:8000");

const API_ROOT = RAW_API_ROOT.replace(/\/+$/, "");

const BASE_URL = `${API_ROOT}/api/admin/`;
const REFRESH_URL = `${API_ROOT}/api/token/refresh/`;

const api = axios.create({
  baseURL: BASE_URL,
});

const AUTH_ENDPOINTS = [
  "staff/login/",
  "staff/signup/",
  "staff/verify-invitation/",
  "staff/acceptinvitation/",
];

const isAuthUrl = (url = "") => {
  if (!url) return false;
  const cleanUrl = url.replace(/^\/+/, "");
  return AUTH_ENDPOINTS.some((endpoint) => cleanUrl.startsWith(endpoint));
};

api.interceptors.request.use((config) => {
  if (isAuthUrl(config.url)) {
    return config;
  }

  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

const forceLogout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthEndpoint = isAuthUrl(originalRequest?.url);

    // Bad credentials or invalid invitation on auth endpoints — not a session issue, just reject.
    if (status === 401 && isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem("refresh_token");

      // No refresh token to try — nothing to do but log out.
      if (!refreshToken) {
        forceLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Another request already triggered a refresh; wait for it.
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(REFRESH_URL, {
          refresh: refreshToken,
        });

        localStorage.setItem("access_token", data.access);
        processQueue(null, data.access);

        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        forceLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 403 Forbidden without expiring session
    if (status === 403) {
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }
      const errorData = error.response?.data;
      window.dispatchEvent(
        new CustomEvent("rbacForbidden", {
          detail: errorData || { message: "You do not have permission to perform this action." },
        })
      );
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;