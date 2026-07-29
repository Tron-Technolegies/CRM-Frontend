// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//     const token = localStorage.getItem("access_token");

//     if (!token) {
//         return <Navigate to="/login" replace />;
//     }

//     return children;
// };

// export default ProtectedRoute;


import React from "react";
import { Navigate } from "react-router-dom";

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    // exp is in seconds; Date.now() is in ms
    return payload.exp * 1000 < Date.now();
  } catch (err) {
    // Malformed token — treat as expired/invalid
    return true;
  }
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;