import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  Mail,
  Briefcase,
  Shield,
  Lock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { verifyInvitation } from "../../api/auth";
import useAuth from "../../hooks/useAuth";
import { useToast } from "../ui/toastContext";

const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();
  const { acceptStaffInvitation } = useAuth();
  const { pushToast } = useToast();

  // Verification state
  const [verifying, setVerifying] = useState(true);
  const [verifyError, setVerifyError] = useState("");
  const [inviteData, setInviteData] = useState(null);

  // Form state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const runVerification = async () => {
      if (!token) {
        setVerifying(false);
        setVerifyError("No invitation token was provided in the link. Please check the URL or request a new invitation from your administrator.");
        return;
      }

      try {
        setVerifying(true);
        setVerifyError("");
        const res = await verifyInvitation(token);
        if (isMounted) {
          setInviteData(res.data || {});
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Invitation verification failed:", err);
        const data = err.response?.data;
        let message = "Invalid or expired invitation. Please contact your administrator.";
        if (typeof data === "string") {
          message = data;
        } else if (data?.detail) {
          message = data.detail;
        } else if (data?.message) {
          message = data.message;
        } else if (data?.error) {
          message = data.error;
        } else if (typeof data === "object") {
          const values = Object.values(data).flat();
          if (values.length > 0 && typeof values[0] === "string") {
            message = values.join(" ");
          }
        }
        setVerifyError(message);
      } finally {
        if (isMounted) setVerifying(false);
      }
    };

    runVerification();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Defensive data extractors
  const fullName =
    inviteData?.fullName ||
    inviteData?.full_name ||
    inviteData?.name ||
    inviteData?.staff?.full_name ||
    inviteData?.staff?.fullName ||
    inviteData?.user?.full_name ||
    "";

  const email =
    inviteData?.email ||
    inviteData?.staff?.email ||
    inviteData?.user?.email ||
    "";

  const companyName =
    inviteData?.companyName ||
    inviteData?.company_name ||
    inviteData?.company ||
    inviteData?.staff?.company_name ||
    "";

  const role =
    inviteData?.role ||
    inviteData?.staff?.role ||
    inviteData?.user?.role ||
    "Staff";

  const department =
    inviteData?.department ||
    inviteData?.staff?.department ||
    "";

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setFormError("");

    if (!password) {
      setFormError("Password is required.");
      return;
    }

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await acceptStaffInvitation(
        { token, password },
        {
          email,
          fullName,
          companyName,
          role,
          department,
        }
      );

      pushToast({
        title: "Welcome to the team!",
        message: "Your invitation has been accepted successfully.",
        variant: "success",
        durationMs: 3500,
      });

      // Redirect to dashboard matching normal login behavior
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Accept invitation error:", err);
      const data = err.response?.data;
      let message = "Failed to accept invitation. Please try again or contact your administrator.";
      if (typeof data === "string") {
        message = data;
      } else if (data?.detail) {
        message = data.detail;
      } else if (data?.message) {
        message = data.message;
      } else if (data?.error) {
        message = data.error;
      } else if (typeof data === "object") {
        const values = Object.values(data).flat();
        if (values.length > 0 && typeof values[0] === "string") {
          message = values.join(" ");
        }
      }
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-[#EFF6FF] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        {/* Verification in progress */}
        {verifying && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Loader2 size={32} className="animate-spin text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Verifying Your Invitation
            </h2>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Please wait while we validate your invitation token and set up your workspace...
            </p>
          </div>
        )}

        {/* Verification failed */}
        {!verifying && verifyError && (
          <div className="bg-white rounded-2xl border border-rose-100 shadow-xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Invitation Invalid or Expired
            </h2>
            <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
              {verifyError}
            </p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition text-white text-sm font-semibold shadow-sm shadow-blue-200"
              >
                Go to Login
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <p className="text-xs text-slate-400">
                Need assistance? Contact your workspace administrator to resend an invite.
              </p>
            </div>
          </div>
        )}

        {/* Verification Succeeded - Accept Invitation Form */}
        {!verifying && !verifyError && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-200">
                <UserCheck size={28} />
              </div>
              <h1 className="text-2xl font-bold text-[#111827]">
                Accept Invitation
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Set up your password to activate your staff account
              </p>
            </div>

            {/* Invited Staff Information Summary Box */}
            <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="flex items-center justify-between border-b border-blue-100/80 pb-2 mb-3">
                <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
                  Invitation Details
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-600 text-white capitalize shadow-xs">
                  <Shield size={12} />
                  {role}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {fullName && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <UserCheck size={14} className="text-blue-500 shrink-0" />
                    <span className="font-semibold truncate">{fullName}</span>
                  </div>
                )}
                {email && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail size={14} className="text-blue-500 shrink-0" />
                    <span className="font-medium truncate">{email}</span>
                  </div>
                )}
                {companyName && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Building2 size={14} className="text-blue-500 shrink-0" />
                    <span className="truncate">{companyName}</span>
                  </div>
                )}
                {department && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Briefcase size={14} className="text-blue-500 shrink-0" />
                    <span className="truncate">{department}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Error Notification */}
            {formError && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-600 flex items-start gap-2.5">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {/* Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#374151] flex items-center justify-between">
                  <span>Create Password</span>
                  <span className="text-xs text-slate-400 font-normal">Min. 8 characters</span>
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    disabled={submitting}
                    className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 pr-12 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#374151]">
                  Confirm Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    disabled={submitting}
                    className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 pr-12 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Password checks guidance */}
              <div className="py-1">
                <div className="flex items-center gap-2 text-xs">
                  {password.length >= 8 ? (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                  )}
                  <span className={password.length >= 8 ? "text-emerald-700 font-medium" : "text-slate-500"}>
                    At least 8 characters
                  </span>
                </div>
                {password && confirmPassword && (
                  <div className="flex items-center gap-2 text-xs mt-1.5">
                    {password === confirmPassword ? (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    ) : (
                      <AlertCircle size={14} className="text-rose-500" />
                    )}
                    <span
                      className={
                        password === confirmPassword
                          ? "text-emerald-700 font-medium"
                          : "text-rose-600 font-medium"
                      }
                    >
                      {password === confirmPassword
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition text-white text-sm font-semibold shadow-sm shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Activating Account...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Accept Invitation & Join</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Already activated your account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptInvitation;
