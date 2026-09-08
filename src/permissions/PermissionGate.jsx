import React from "react";
import usePermissions from "./usePermissions";

/**
 * PermissionGate Component
 * Conditionally renders children if the active user possesses the required permission(s).
 *
 * Props:
 * - permission: string (single permission key, e.g. "lead.create")
 * - anyPermissions: string[] (renders if user has at least one of these)
 * - allPermissions: string[] (renders if user has all of these)
 * - fallback: ReactNode (rendered when access is denied, default: null)
 * - children: ReactNode
 */
export default function PermissionGate({
  permission,
  anyPermissions,
  allPermissions,
  fallback = null,
  children,
}) {
  const { hasPermission, hasAny, hasAll } = usePermissions();

  if (permission && !hasPermission(permission)) {
    return fallback;
  }

  if (anyPermissions && anyPermissions.length > 0 && !hasAny(anyPermissions)) {
    return fallback;
  }

  if (allPermissions && allPermissions.length > 0 && !hasAll(allPermissions)) {
    return fallback;
  }

  return <>{children}</>;
}
