/**
 * Centralized Role-Based Access Control (RBAC) System
 * Source of Truth: Backend RBAC Implementation Documentation
 *
 * 4 Recognized Staff Roles:
 * - 'admin'
 * - 'manager'
 * - 'sales agent'
 * - 'support agent'
 */

// Normalized Role Constants
export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  SALES_AGENT: "sales agent",
  SUPPORT_AGENT: "support agent",
};

/**
 * Normalizes a role string to lowercase trimmed representation.
 */
export function normalizeRole(role) {
  if (!role || typeof role !== "string") return "";
  return role.trim().toLowerCase();
}

/**
 * Centralized Permissions Matrix
 * Exactly reflects the backend RBAC implementation (AdminApp/permissions.py)
 */
export const ROLE_PERMISSIONS = {
  // ADMIN: Full access to all 84 CRM permission keys
  [ROLES.ADMIN]: [
    "*", // Wildcard grants all permissions
  ],

  // MANAGER: 76 permissions (Full operational CRUD, staff create/edit, report export)
  // Strictly denied: staff.delete, picklist create/edit/delete, twilio settings, meta integration
  [ROLES.MANAGER]: [
    // Leads
    "lead.create", "lead.view", "lead.edit", "lead.delete", "lead.convert",
    // Deals
    "deal.create", "deal.view", "deal.edit", "deal.delete",
    // Customers
    "customer.create", "customer.view", "customer.edit", "customer.delete",
    // Accounts
    "account.create", "account.view", "account.edit", "account.delete",
    // Tasks
    "task.create", "task.view", "task.edit", "task.delete",
    // Meetings
    "meeting.create", "meeting.view", "meeting.edit", "meeting.delete",
    // Calls
    "call.create", "call.view", "call.edit", "call.delete", "call.dial",
    // Staff (create, view, edit ONLY - NO staff.delete)
    "staff.create", "staff.view", "staff.edit",
    // Products
    "product.create", "product.view", "product.edit", "product.delete",
    // Services
    "service.create", "service.view", "service.edit", "service.delete",
    // Price Books
    "pricebook.create", "pricebook.view", "pricebook.edit", "pricebook.delete",
    // Quotes
    "quote.create", "quote.view", "quote.edit", "quote.delete",
    // Sales Orders
    "salesorder.create", "salesorder.view", "salesorder.edit", "salesorder.delete",
    // Invoices
    "invoice.create", "invoice.view", "invoice.edit", "invoice.delete",
    // Vendors
    "vendor.create", "vendor.view", "vendor.edit", "vendor.delete",
    // Purchase Orders
    "purchaseorder.create", "purchaseorder.view", "purchaseorder.edit", "purchaseorder.delete",
    // Cases
    "case.create", "case.view", "case.edit", "case.delete",
    // Case Solutions
    "casesolution.create", "casesolution.view", "casesolution.edit", "casesolution.delete",
    // Picklists (view ONLY)
    "picklist.view",
    // Reports (view and export)
    "report.view", "report.export",
  ],

  // SALES AGENT: 30 permissions
  // Sales pipeline: leads, deals, customers, accounts, tasks, meetings, calls (dial/create/view)
  // View-only for: quotes, sales orders, invoices, products, services, price books, picklists, reports
  // Strictly denied: ANY delete, staff, vendors, purchase orders, cases, twilio, meta
  [ROLES.SALES_AGENT]: [
    // Leads (create, view, edit, convert - NO delete)
    "lead.create", "lead.view", "lead.edit", "lead.convert",
    // Deals (create, view, edit - NO delete)
    "deal.create", "deal.view", "deal.edit",
    // Customers (create, view, edit - NO delete)
    "customer.create", "customer.view", "customer.edit",
    // Accounts (create, view, edit - NO delete)
    "account.create", "account.view", "account.edit",
    // Tasks (create, view, edit - NO delete)
    "task.create", "task.view", "task.edit",
    // Meetings (create, view, edit - NO delete)
    "meeting.create", "meeting.view", "meeting.edit",
    // Calls (create, view, dial - NO edit, NO delete)
    "call.create", "call.view", "call.dial",
    // Quotes (view ONLY)
    "quote.view",
    // Sales Orders (view ONLY)
    "salesorder.view",
    // Invoices (view ONLY)
    "invoice.view",
    // Products (view ONLY)
    "product.view",
    // Services (view ONLY)
    "service.view",
    // Price Books (view ONLY)
    "pricebook.view",
    // Picklists (view ONLY)
    "picklist.view",
    // Reports (view ONLY - NO export)
    "report.view",
  ],

  // SUPPORT AGENT: 24 permissions
  // Support operations: cases & solutions (create, view, edit), customers (view, edit)
  // Calls (dial, create, view), tasks, meetings
  // View-only for: leads, deals, accounts, products, services, picklists, reports
  // Strictly denied: ANY delete, create customer, modify leads/deals, quotes, invoices, orders, vendors, staff, twilio, meta
  [ROLES.SUPPORT_AGENT]: [
    // Customers (view, edit - NO create, NO delete)
    "customer.view", "customer.edit",
    // Cases (create, view, edit - NO delete)
    "case.create", "case.view", "case.edit",
    // Case Solutions (create, view, edit - NO delete)
    "casesolution.create", "casesolution.view", "casesolution.edit",
    // Tasks (create, view, edit - NO delete)
    "task.create", "task.view", "task.edit",
    // Meetings (create, view, edit - NO delete)
    "meeting.create", "meeting.view", "meeting.edit",
    // Calls (create, view, dial - NO edit, NO delete)
    "call.create", "call.view", "call.dial",
    // Leads (view ONLY)
    "lead.view",
    // Deals (view ONLY)
    "deal.view",
    // Accounts (view ONLY)
    "account.view",
    // Products (view ONLY)
    "product.view",
    // Services (view ONLY)
    "service.view",
    // Picklists (view ONLY)
    "picklist.view",
    // Reports (view ONLY - NO export)
    "report.view",
  ],
};

/**
 * Decodes a JWT token without requiring external dependencies.
 */
export function decodeJwt(token) {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Extracts the user's role from localStorage ('user' object or JWT access_token).
 */
export function getStoredUserRole() {
  // 1. Try reading from localStorage "user"
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const role = user?.role || user?.staff?.role || user?.user?.role;
      if (role) return normalizeRole(role);
    }
  } catch (e) {
    console.error("Failed to parse stored user from localStorage:", e);
  }

  // 2. Try decoding JWT access token
  const token = localStorage.getItem("access_token");
  if (token) {
    const payload = decodeJwt(token);
    const jwtRole = payload?.role || payload?.staff_role || payload?.user?.role;
    if (jwtRole) return normalizeRole(jwtRole);
  }

  return "";
}

/**
 * Updates the stored user role in localStorage and dispatches a change event.
 */
export function setStoredUserRole(role) {
  const normalized = normalizeRole(role);
  try {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : {};
    user.role = normalized;
    localStorage.setItem("user", JSON.stringify(user));
  } catch (e) {
    console.error("Failed to save updated role to localStorage:", e);
  }
  window.dispatchEvent(new CustomEvent("authRoleChanged", { detail: { role: normalized } }));
}

/**
 * Evaluates whether a role possesses a specific permission.
 * - 'admin' has wildcard access ("*")
 * - Handles role normalization
 */
export function hasPermission(role, permissionKey) {
  if (!permissionKey) return true;
  const normalizedRole = normalizeRole(role);
  if (!normalizedRole) return false;

  const allowedList = ROLE_PERMISSIONS[normalizedRole];
  if (!allowedList) return false;

  // Wildcard admin check
  if (allowedList.includes("*")) return true;

  return allowedList.includes(permissionKey);
}

/**
 * Checks if the role has ANY of the specified permissions.
 */
export function hasAnyPermission(role, permissionKeys = []) {
  if (!permissionKeys || permissionKeys.length === 0) return true;
  return permissionKeys.some((perm) => hasPermission(role, perm));
}

/**
 * Checks if the role has ALL of the specified permissions.
 */
export function hasAllPermissions(role, permissionKeys = []) {
  if (!permissionKeys || permissionKeys.length === 0) return true;
  return permissionKeys.every((perm) => hasPermission(role, perm));
}
