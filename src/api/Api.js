// import axios from "axios";

// const api = axios.create({ baseURL: "https://crm-backend-ejfr.onrender.com/api/admin/", });
// // const api = axios.create({ baseURL: "http://127.0.0.1:8000/", });

// api.interceptors.request.use((config) => {
//    console.log("🔥 API REQUEST:", {
//                   method: config.method,
//                   url: config.url,
//                   baseURL: config.baseURL,
//                 });
//   if (config.url === "staff/login/" || config.url === "staff/signup/") {
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
//       error.config?.url === "staff/login/" || error.config?.url === "staff/signup/";

//     // A 401 on the login/signup endpoints just means bad credentials —
//     // don't treat that as "session expired" and redirect.
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

const api = axios.create({
  baseURL: "https://crm-backend-ejfr.onrender.com/api/admin/",
});

api.interceptors.request.use((config) => {
  console.log("🔥 API REQUEST:", {
    method: config.method,
    url: config.url,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url || ""}`,
    stack: new Error().stack,
  });

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    const isAuthEndpoint =
      error.config?.url === "staff/login/" ||
      error.config?.url === "staff/signup/";

    if (status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;