import { useState, useEffect, useCallback, useRef } from "react";
import { Mail, CheckCircle2, AlertCircle, RefreshCw, ExternalLink } from "lucide-react";
import BackButton from "../common/BackButton";
import ConfirmDialog from "../ui/ConfirmDialog";
import Spinner from "../ui/Spinner";
import { useToast } from "../ui/toastContext";
import usePermissions from "../../permissions/usePermissions";
import { getEmailConnectUrl, getEmailStatus, disconnectEmail } from "../../api/email";

export default function EmailIntegration() {
  const { pushToast } = useToast();
  const { hasPermission } = usePermissions();
  const canManage = hasPermission("integration.manage");

  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusData, setStatusData] = useState({
    connected: false,
    provider: "gmail",
    email: null,
    updated_at: null,
    token_expiry: null,
  });

  // Track if we already processed URL callback parameters
  const callbackHandled = useRef(false);

  const fetchStatus = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setLoading(true);
    }
    setErrorMessage("");
    try {
      const res = await getEmailStatus();
      const data = res?.data || {};
      setStatusData({
        connected: Boolean(data.connected),
        provider: data.provider || "gmail",
        email: data.email || null,
        updated_at: data.updated_at || null,
        token_expiry: data.token_expiry || null,
      });
      return data;
    } catch (err) {
      console.error("Failed to fetch email status:", err);
      const status = err.response?.status;
      let msg = "Failed to load email integration status.";
      if (status === 403) {
        msg = "You do not have permission to view email integration.";
      } else if (err.response?.data?.message || err.response?.data?.error) {
        msg = err.response.data.message || err.response.data.error;
      }
      setErrorMessage(msg);
      return null;
    } finally {
      if (!isSilent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // Process OAuth callback query params
    if (!callbackHandled.current) {
      callbackHandled.current = true;
      const params = new URLSearchParams(window.location.search);
      const gmailParam = params.get("gmail");
      const errorParam = params.get("error");
      const errorDescription = params.get("error_description");

      if (gmailParam === "connected") {
        pushToast({
          title: "Connected",
          message: "Gmail connected successfully.",
          variant: "success",
          durationMs: 4000,
        });
      } else if (errorParam || errorDescription) {
        pushToast({
          title: "Connection Failed",
          message: errorDescription || errorParam || "Failed to connect Gmail account.",
          variant: "error",
          durationMs: 5000,
        });
      }

      // Clean OAuth query parameters from URL if any were present
      if (gmailParam || errorParam || errorDescription) {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, "", cleanUrl);
      }
    }

    // Always fetch status from backend as source of truth
    fetchStatus();
  }, [fetchStatus, pushToast]);

  const handleConnect = async () => {
    if (connecting || disconnecting) return;
    setConnecting(true);
    setErrorMessage("");

    try {
      const res = await getEmailConnectUrl();
      const authUrl = res?.data?.auth_url;
      if (authUrl) {
        // Redirect browser to Google's OAuth consent screen
        window.location.href = authUrl;
      } else {
        throw new Error("Authorization URL not received from server.");
      }
    } catch (err) {
      console.error("Failed to connect Gmail:", err);
      const status = err.response?.status;
      let msg = "Unable to start Gmail connection. Please try again.";
      if (status === 403) {
        msg = "You do not have permission to manage email integration.";
      } else if (err.response?.data?.message || err.response?.data?.error) {
        msg = err.response.data.message || err.response.data.error;
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
      pushToast({
        title: "Connection Error",
        message: msg,
        variant: "error",
      });
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (disconnecting) return;
    setDisconnecting(true);
    setErrorMessage("");

    try {
      await disconnectEmail();
      setShowConfirmDisconnect(false);
      setStatusData({
        connected: false,
        provider: "gmail",
        email: null,
        updated_at: null,
        token_expiry: null,
      });
      pushToast({
        title: "Disconnected",
        message: "Gmail disconnected successfully.",
        variant: "success",
      });
      // Refresh status from backend to ensure synchronization
      await fetchStatus(true);
    } catch (err) {
      console.error("Failed to disconnect Gmail:", err);
      const status = err.response?.status;
      let msg = "Failed to disconnect Gmail account. Please try again.";
      if (status === 403) {
        msg = "You do not have permission to disconnect email integration.";
      } else if (err.response?.data?.message || err.response?.data?.error) {
        msg = err.response.data.message || err.response.data.error;
      }
      pushToast({
        title: "Disconnect Failed",
        message: msg,
        variant: "error",
      });
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h1 className="text-2xl sm:text-[28px] font-semibold text-[#111827]">
            Email Integration
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Connect your Gmail account to send CRM emails from your company email.
          </p>
        </div>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 text-sm text-red-700 animate-in fade-in duration-200">
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
          <div className="flex-1">{errorMessage}</div>
        </div>
      )}

      {/* Main Connection Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                statusData.connected
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              <Mail size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#111827]">
                Email Integration
              </h2>
              <p className="text-sm text-[#64748B]">
                {statusData.connected
                  ? "Your Gmail account is connected and active for sending emails."
                  : "Connect your Gmail account to send CRM emails from your company email."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {loading ? (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                <Spinner size={12} /> Checking status...
              </span>
            ) : statusData.connected ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Not Connected
              </span>
            )}

            <button
              onClick={() => fetchStatus()}
              disabled={loading || connecting || disconnecting}
              title="Refresh status"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="pt-6">
          {loading ? (
            <div className="py-10 flex flex-col items-center justify-center text-gray-500">
              <Spinner size={24} />
              <p className="mt-3 text-sm">Loading email integration status...</p>
            </div>
          ) : statusData.connected ? (
            /* Connected State */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/75 rounded-xl p-5 border border-gray-100">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">
                      Connected
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Provider
                  </label>
                  <p className="text-sm font-semibold text-[#111827] mt-1 capitalize">
                    {statusData.provider || "Gmail"}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </label>
                  <p className="text-sm font-medium text-[#111827] mt-1 flex items-center gap-2">
                    <span className="font-mono bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                      {statusData.email || "Configured"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-500">
                  CRM email dispatches will originate from this connected Gmail account.
                </p>

                {canManage && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmDisconnect(true)}
                    disabled={disconnecting}
                    className="h-10 px-5 rounded-xl text-sm font-medium text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {disconnecting && <Spinner size={14} className="text-red-600" />}
                    Disconnect
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Disconnected State */
            <div className="space-y-6">
              <div className="bg-gray-50/75 rounded-xl p-5 border border-gray-100 space-y-3">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </label>
                  <p className="text-sm font-semibold text-amber-700 mt-0.5">
                    Not Connected
                  </p>
                </div>

                <p className="text-sm text-gray-600">
                  Connect your Gmail account to send CRM emails from your company email.
                  All authorization tokens are managed securely by the backend server.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500">
                  You will be redirected to Google to approve email sending permissions.
                </span>

                {canManage ? (
                  <button
                    type="button"
                    onClick={handleConnect}
                    disabled={connecting || loading}
                    className="h-11 px-6 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2.5 shadow-sm cursor-pointer"
                  >
                    {connecting ? (
                      <>
                        <Spinner size={16} className="text-white" />
                        <span>Redirecting to Google...</span>
                      </>
                    ) : (
                      <>
                        <Mail size={18} />
                        <span>Connect Gmail</span>
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-xs text-gray-500 italic">
                    Permission required: integration.manage
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Disconnect */}
      <ConfirmDialog
        open={showConfirmDisconnect}
        title="Disconnect Gmail"
        description="Are you sure you want to disconnect your Gmail account? You will no longer be able to send CRM emails from this address until reconnected."
        confirmText="Disconnect"
        cancelText="Cancel"
        danger={true}
        loading={disconnecting}
        onConfirm={handleDisconnect}
        onCancel={() => setShowConfirmDisconnect(false)}
      />
    </div>
  );
}
