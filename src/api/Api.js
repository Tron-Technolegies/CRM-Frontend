// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://crm-backend-ejfr.onrender.com/api/admin/",
// });

// api.interceptors.request.use((config) => {
//   console.log("🔥 API REQUEST:", {
//     method: config.method,
//     url: config.url,
//     baseURL: config.baseURL,
//     fullURL: `${config.baseURL}${config.url || ""}`,
//     stack: new Error().stack,
//   });

//   if (
//     config.url === "staff/login/" ||
//     config.url === "staff/signup/"
//   ) {
//     return config;
//   }

//   const token = localStorage.getItem("access_token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;

//     const isAuthEndpoint =
//       error.config?.url === "staff/login/" ||
//       error.config?.url === "staff/signup/";

//     if (status === 401 && !isAuthEndpoint) {
//       localStorage.removeItem("access_token");
//       localStorage.removeItem("refresh_token");

//       if (window.location.pathname !== "/login") {
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from "axios";

const BASE_URL = "https://crm-backend-ejfr.onrender.com/api/admin/";
const REFRESH_URL = "https://crm-backend-ejfr.onrender.com/api/token/refresh/";

const api = axios.create({
  baseURL: BASE_URL,
});

const AUTH_ENDPOINTS = ["staff/login/", "staff/signup/"];

api.interceptors.request.use((config) => {
  if (AUTH_ENDPOINTS.includes(config.url)) {
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
    const isAuthEndpoint = AUTH_ENDPOINTS.includes(originalRequest?.url);

    // Bad credentials on login/signup itself — not a session issue, just reject.
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

    return Promise.reject(error);
  }
);

export default api;