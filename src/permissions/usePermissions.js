import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getStoredUserRole,
  setStoredUserRole,
  hasPermission as checkPermission,
  hasAnyPermission,
  hasAllPermissions,
  normalizeRole,
  ROLES,
} from "./permissions";
import api from "../api/Api";

export default function usePermissions() {
  const [role, setRole] = useState(() => getStoredUserRole());
  const [loading, setLoading] = useState(false);

  // Sync role if missing or on mount when token exists
  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("access_token");

    const syncRoleFromProfile = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const res = await api.get("profile/view/");
        const fetchedRole = res.data?.role;
        if (fetchedRole && isMounted) {
          const normalized = normalizeRole(fetchedRole);
          setRole((prev) => {
            if (prev !== normalized) {
              setStoredUserRole(normalized);
              return normalized;
            }
            return prev;
          });
        }
      } catch (err) {
        // Profile fetch might fail if offline or token expired
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // If role is not yet in storage or we just loaded, ensure it matches profile
    if (!role && token) {
      syncRoleFromProfile();
    }

    const handleRoleChanged = (e) => {
      if (e.detail?.role) {
        setRole(normalizeRole(e.detail.role));
      }
    };

    const handleProfileUpdated = (e) => {
      if (e.detail?.role) {
        const normalized = normalizeRole(e.detail.role);
        setRole(normalized);
        setStoredUserRole(normalized);
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === "user" || e.key === "access_token") {
        setRole(getStoredUserRole());
      }
    };

    window.addEventListener("authRoleChanged", handleRoleChanged);
    window.addEventListener("profileUpdated", handleProfileUpdated);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      isMounted = false;
      window.removeEventListener("authRoleChanged", handleRoleChanged);
      window.removeEventListener("profileUpdated", handleProfileUpdated);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [role]);

  const hasPermission = useCallback(
    (permissionKey) => checkPermission(role, permissionKey),
    [role]
  );

  const hasAny = useCallback(
    (permissionKeys) => hasAnyPermission(role, permissionKeys),
    [role]
  );

  const hasAll = useCallback(
    (permissionKeys) => hasAllPermissions(role, permissionKeys),
    [role]
  );

  const isRole = useCallback(
    (expectedRole) => normalizeRole(role) === normalizeRole(expectedRole),
    [role]
  );

  const isAdmin = useMemo(() => isRole(ROLES.ADMIN), [isRole]);
  const isManager = useMemo(() => isRole(ROLES.MANAGER), [isRole]);
  const isSalesAgent = useMemo(() => isRole(ROLES.SALES_AGENT), [isRole]);
  const isSupportAgent = useMemo(() => isRole(ROLES.SUPPORT_AGENT), [isRole]);

  return {
    role,
    loading,
    hasPermission,
    hasAny,
    hasAll,
    isRole,
    isAdmin,
    isManager,
    isSalesAgent,
    isSupportAgent,
  };
}
