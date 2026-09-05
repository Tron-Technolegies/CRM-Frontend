import { useState, useEffect, useCallback } from "react";
import {
  PhoneCall,
  Lock,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import BackButton from "../../common/BackButton";
import ConfirmDialog from "../../ui/ConfirmDialog";
import Spinner from "../../ui/Spinner";
import { useToast } from "../../ui/toastContext";
import {
  getTwilioSettings,
  saveTwilioSettings,
  disconnectTwilio,
} from "../../../api/call";

export default function TwilioSettings() {
  const { pushToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false);

  const [showAuthToken, setShowAuthToken] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [settings, setSettings] = useState({
    connected: false,
    account_sid: "",
    caller_id: "",
    last_verified_at: null,
  });

  const [formData, setFormData] = useState({
    account_sid: "",
    auth_token: "",
    caller_id: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const applySettingsData = (data) => {
    const isConnected = Boolean(data?.connected);
    setSettings({
      connected: isConnected,
      account_sid: data?.account_sid || "",
      caller_id: data?.caller_id || "",
      last_verified_at: data?.last_verified_at || null,
    });

    if (isConnected) {
      setFormData({
        account_sid: data?.account_sid || "",
        auth_token: "", // never populate auth token from backend
        caller_id: data?.caller_id || "",
      });
    }
  };

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await getTwilioSettings();
      applySettingsData(res?.data || {});
    } catch (err) {
      console.error("Failed to fetch Twilio settings:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to load Twilio configuration.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    getTwilioSettings()
      .then((res) => {
        if (!isSubscribed) return;
        applySettingsData(res?.data || {});
      })
      .catch((err) => {
        if (!isSubscribed) return;
        console.error("Failed to fetch Twilio settings:", err);
        const msg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to load Twilio configuration.";
        setErrorMessage(msg);
      })
      .finally(() => {
        if (isSubscribed) {
          setLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
  };

  const validate = () => {
    const errors = {};

    const sid = formData.account_sid.trim();
    if (!sid) {
      errors.account_sid = "Account SID is required.";
    } else if (!sid.startsWith("AC")) {
      errors.account_sid = "Account SID must start with 'AC'.";
    }

    const token = formData.auth_token.trim();
    if (!settings.connected && !token) {
      errors.auth_token = "Auth Token is required when connecting Twilio.";
    }

    const callerId = formData.caller_id.trim();
    if (!callerId) {
      errors.caller_id = "Twilio Caller ID number is required.";
    } else if (!callerId.startsWith("+")) {
      errors.caller_id =
        "Twilio Phone Number must be in E.164 format with country code (e.g. +1234567890).";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        account_sid: formData.account_sid.trim(),
        auth_token: formData.auth_token.trim(),
        caller_id: formData.caller_id.trim(),
      };

      const res = await saveTwilioSettings(payload);
      const data = res?.data || {};

      setSuccessMessage(data.message || "Twilio account connected successfully.");
      pushToast({
        title: "Twilio Connected",
        message: data.message || "Twilio credentials verified and saved successfully.",
        variant: "success",
      });

      // Clear the secret input from state for security
      setFormData((prev) => ({
        ...prev,
        auth_token: "",
      }));

      // Refresh connection status from backend
      await fetchSettings();
    } catch (err) {
      console.error("Failed to save Twilio settings:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to verify and save Twilio settings. Please check your credentials.";
      setErrorMessage(msg);
      pushToast({
        title: "Connection Failed",
        message: msg,
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await disconnectTwilio();

      setSettings({
        connected: false,
        account_sid: "",
        caller_id: "",
        last_verified_at: null,
      });

      setFormData({
        account_sid: "",
        auth_token: "",
        caller_id: "",
      });

      setShowConfirmDisconnect(false);

      setSuccessMessage("Twilio account has been disconnected.");
      pushToast({
        title: "Twilio Disconnected",
        message: "Twilio calling has been disconnected for your company.",
        variant: "success",
      });
    } catch (err) {
      console.error("Failed to disconnect Twilio:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to disconnect Twilio account.";
      setErrorMessage(msg);
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
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Twilio Settings
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Connect your company's Twilio account for direct outbound calling
            </p>
          </div>
        </div>

        {/* Twilio Console Button */}
        <a
          href="https://console.twilio.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition shadow-sm shrink-0"
        >
          <ExternalLink size={16} />
          <span>Open Twilio Console</span>
        </a>
      </div>

      {/* Global Alerts */}
      {errorMessage && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 text-sm text-red-700 animate-in fade-in duration-200">
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
          <div className="flex-1">{errorMessage}</div>
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-4 flex items-start gap-3 text-sm text-green-700 animate-in fade-in duration-200">
          <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-green-600" />
          <div className="flex-1">{successMessage}</div>
        </div>
      )}

      {/* Connection Status Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                settings.connected
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              <PhoneCall size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Twilio Calling Integration
              </h2>
              <p className="text-sm text-gray-500">
                {settings.connected
                  ? "Your company is connected to Twilio and ready to dial outbound calls."
                  : "Configure your Twilio Account SID, Auth Token, and Caller ID below."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {loading ? (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                <Spinner size={12} /> Checking status...
              </span>
            ) : settings.connected ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected & Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Not Connected
              </span>
            )}

            <button
              onClick={() => fetchSettings()}
              disabled={loading}
              title="Refresh status"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Connected Details Overview */}
        {settings.connected && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200/70">
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
                Account SID
              </span>
              <span className="text-sm font-semibold text-gray-800 font-mono break-all">
                {settings.account_sid || "—"}
              </span>
            </div>

            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
                Caller ID (Twilio Number)
              </span>
              <span className="text-sm font-semibold text-gray-800 font-mono">
                {settings.caller_id || "—"}
              </span>
            </div>

            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
                Last Verified
              </span>
              <span className="text-sm font-medium text-gray-600">
                {settings.last_verified_at
                  ? new Date(settings.last_verified_at).toLocaleString()
                  : "Verified"}
              </span>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-800">
          <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Security & Multi-Tenant Privacy</p>
            <p className="text-blue-700 leading-relaxed">
              Your Auth Token is encrypted using AES-256 before being stored in
              the database. It is never transmitted back to the browser or
              exposed to clients. All outbound calls dial securely through your
              dedicated credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <Lock size={20} className="text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            {settings.connected ? "Update Credentials" : "Twilio Configuration"}
          </h2>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Account SID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Account SID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="account_sid"
              value={formData.account_sid}
              onChange={handleChange}
              disabled={saving}
              placeholder="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 font-mono transition ${
                formErrors.account_sid
                  ? "border-red-300 focus:ring-red-500 bg-red-50/30"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {formErrors.account_sid ? (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle size={12} /> {formErrors.account_sid}
              </p>
            ) : (
              <p className="mt-1 text-xs text-gray-400">
                Found on your Twilio Console dashboard. Starts with 'AC' (34 characters).
              </p>
            )}
          </div>

          {/* Auth Token */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Auth Token{" "}
                {settings.connected ? (
                  <span className="text-xs font-normal text-gray-400">
                    (Leave blank to keep existing encrypted token)
                  </span>
                ) : (
                  <span className="text-red-500">*</span>
                )}
              </label>
            </div>
            <div className="relative">
              <input
                type={showAuthToken ? "text" : "password"}
                name="auth_token"
                value={formData.auth_token}
                onChange={handleChange}
                disabled={saving}
                placeholder={
                  settings.connected
                    ? "•••••••••••••••••••••••••••••••• (Unchanged)"
                    : "Enter your 32-character Auth Token"
                }
                className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 font-mono transition ${
                  formErrors.auth_token
                    ? "border-red-300 focus:ring-red-500 bg-red-50/30"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowAuthToken(!showAuthToken)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showAuthToken ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formErrors.auth_token ? (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle size={12} /> {formErrors.auth_token}
              </p>
            ) : (
              <p className="mt-1 text-xs text-gray-400">
                Your primary Twilio Auth Token. Stored with AES-256 encryption.
              </p>
            )}
          </div>

          {/* Caller ID / Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Twilio Phone Number (Caller ID) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="caller_id"
                value={formData.caller_id}
                onChange={handleChange}
                disabled={saving}
                placeholder="+17372508034"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 font-mono transition ${
                  formErrors.caller_id
                    ? "border-red-300 focus:ring-red-500 bg-red-50/30"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            </div>
            {formErrors.caller_id ? (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle size={12} /> {formErrors.caller_id}
              </p>
            ) : (
              <p className="mt-1 text-xs text-gray-400">
                Must be an active Twilio phone number in E.164 international format (e.g. <span className="font-mono text-gray-600">+1234567890</span>).
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            {settings.connected ? (
              <button
                type="button"
                onClick={() => setShowConfirmDisconnect(true)}
                disabled={saving || disconnecting}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition disabled:opacity-50"
              >
                {disconnecting ? "Disconnecting..." : "Disconnect Twilio"}
              </button>
            ) : (
              <div />
            )}

            <button
              type="submit"
              disabled={saving || disconnecting || loading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#2B61FF] hover:bg-blue-700 text-white text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {saving && <Spinner size={16} className="text-white" />}
              {saving
                ? "Validating & Saving..."
                : settings.connected
                ? "Update Credentials"
                : "Save & Connect Twilio"}
            </button>
          </div>
        </form>
      </div>

      {/* Disconnect Confirmation Dialog */}
      <ConfirmDialog
        open={showConfirmDisconnect}
        title="Disconnect Twilio Account"
        description="Are you sure you want to disconnect Twilio? Outbound phone calls will be disabled for all team members in this company until credentials are re-connected."
        confirmText="Disconnect"
        cancelText="Keep Connected"
        danger={true}
        loading={disconnecting}
        onConfirm={handleDisconnect}
        onCancel={() => setShowConfirmDisconnect(false)}
      />
    </div>
  );
}
