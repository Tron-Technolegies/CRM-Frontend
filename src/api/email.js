import api from "./Api";

/**
 * Fetch Google OAuth authorization URL for connecting Gmail.
 * Multi-tenancy: Company is inferred by backend from authenticated user. Do NOT pass company_id.
 */
export const getEmailConnectUrl = () => api.get("/email/connect/");

/**
 * Fetch connection status for Gmail email integration.
 * Multi-tenancy: Company is inferred by backend from authenticated user. Do NOT pass company_id.
 */
export const getEmailStatus = () => api.get("/email/status/");

/**
 * Disconnect the integrated Gmail account.
 * Multi-tenancy: Company is inferred by backend from authenticated user. Do NOT pass company_id.
 */
export const disconnectEmail = () => api.post("/email/disconnect/");

/**
 * Send an email via the connected integration.
 */
export const sendEmail = (data) => api.post("/email/send/", data);
