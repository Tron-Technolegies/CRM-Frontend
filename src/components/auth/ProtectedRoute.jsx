// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://crm-backend-ejfr.onrender.com/api/admin/",
// });

// api.interceptors.request.use((config) => {
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

// export default api;

import { Navigate } from "react-router-dom";
import usePermissions from "../../permissions/usePermissions";
import AccessDenied from "../../pages/AccessDenied";

const ProtectedRoute = ({
  children,
  permission,
  anyPermissions,
  allPermissions,
  requiredRole,
}) => {
  const token = localStorage.getItem("access_token");
  const { hasPermission, hasAny, hasAll, isRole } = usePermissions();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <AccessDenied message="You do not have permission to access this module." />;
  }

  if (anyPermissions && anyPermissions.length > 0 && !hasAny(anyPermissions)) {
    return <AccessDenied message="You do not have permission to access this module." />;
  }

  if (allPermissions && allPermissions.length > 0 && !hasAll(allPermissions)) {
    return <AccessDenied message="You do not have permission to access this module." />;
  }

  if (requiredRole && !isRole(requiredRole)) {
    return <AccessDenied message="Your current role is not authorized to access this module." />;
  }

  return children;
};

export default ProtectedRoute;