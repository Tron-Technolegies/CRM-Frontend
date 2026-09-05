import { useState, useEffect } from "react";
import { Phone, PhoneCall, PhoneForwarded, AlertCircle, CheckCircle2, X, User, Building, Info } from "lucide-react";
import Spinner from "../ui/Spinner";
import { dialOut } from "../../api/call";
import { useToast } from "../ui/toastContext";

export default function CallModal({
  open,
  onClose,
  lead,
  onSuccess,
}) {
  const { pushToast } = useToast();
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [callStatus, setCallStatus] = useState("idle"); // "idle" | "calling" | "success" | "error"
  const [statusMessage, setStatusMessage] = useState("");
  const [callSid, setCallSid] = useState("");

  const COUNTRY_CODES = [
    { code: "+91", label: "🇮🇳 India (+91)" },
    { code: "+1", label: "🇺🇸/🇨🇦 USA/Canada (+1)" },
    { code: "+44", label: "🇬🇧 UK (+44)" },
    { code: "+971", label: "🇦🇪 UAE (+971)" },
    { code: "+966", label: "🇸🇦 Saudi Arabia (+966)" },
    { code: "+61", label: "🇦🇺 Australia (+61)" },
    { code: "+65", label: "🇸🇬 Singapore (+65)" },
    { code: "+49", label: "🇩🇪 Germany (+49)" },
    { code: "+33", label: "🇫🇷 France (+33)" },
    { code: "+81", label: "🇯🇵 Japan (+81)" },
  ];

  useEffect(() => {
    if (open && lead) {
      let rawPhone = (lead.phone || "").trim();
      let matchedCode = "+91";
      let localNumber = rawPhone;

      if (rawPhone.startsWith("+")) {
        const found = COUNTRY_CODES.find((c) => rawPhone.startsWith(c.code));
        if (found) {
          matchedCode = found.code;
          localNumber = rawPhone.slice(found.code.length).trim();
        }
      }

      setCountryCode(matchedCode);
      setPhoneNumber(localNumber);
      setSubject(`Call to ${lead.name || "Lead"}`);
      setCallStatus("idle");
      setStatusMessage("");
      setCallSid("");
    }
  }, [open, lead]);

  if (!open || !lead) return null;

  const handleInitiateCall = async (e) => {
    if (e) e.preventDefault();
    let cleanPhone = phoneNumber.replace(/[^\d+]/g, "").trim();

    if (!cleanPhone) {
      setCallStatus("error");
      setStatusMessage("Please provide a valid destination phone number.");
      return;
    }

    // Auto-attach country code if not present
    if (!cleanPhone.startsWith("+")) {
      cleanPhone = `${countryCode}${cleanPhone}`;
    }

    setLoading(true);
    setCallStatus("calling");
    setStatusMessage("Dialing out via Twilio...");

    try {
      const payload = {
        to_number: cleanPhone,
        subject: subject.trim() || `Call to ${lead.name}`,
        lead_id: lead.id || null,
      };

      const response = await dialOut(payload);
      const data = response?.data || response;

      setCallStatus("success");
      setCallSid(data.call_sid || "");
      setStatusMessage("Call initiated successfully! Twilio is calling your registered phone number now. Please answer it to connect to the lead.");

      pushToast({
        title: "Call Initiated",
        message: "Twilio is ringing your phone to bridge the call.",
        variant: "success",
      });

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      console.error("Twilio dial-out error:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to initiate call. Please check your Twilio configuration and phone numbers.";

      setCallStatus("error");
      setStatusMessage(errorMsg);

      pushToast({
        title: "Call Failed",
        message: errorMsg,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-[#E5E7EB]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#EEF2F7] bg-gradient-to-r from-emerald-50/50 to-blue-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-200">
              <PhoneCall size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#111827]">Twilio Direct Call</h2>
              <p className="text-xs text-[#64748B]">Connect outbound call to lead</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#111827] transition p-1 rounded-lg hover:bg-white/80"
          >
            <X size={20} />
          </button>
        </div>

        {/* Lead Info Summary */}
        <div className="p-6 space-y-5">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#111827]">
                <User size={15} className="text-[#64748B]" />
                <span>{lead.name}</span>
              </div>
              {lead.companyName && (
                <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  <Building size={13} />
                  <span>{lead.companyName}</span>
                </div>
              )}
            </div>
            {lead.email && (
              <p className="text-xs text-[#64748B]">Email: {lead.email}</p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleInitiateCall} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] uppercase tracking-wider mb-1.5">
                Destination Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  disabled={loading || callStatus === "calling"}
                  className="h-11 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition cursor-pointer font-medium"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <Phone size={16} />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="9876543210"
                    disabled={loading || callStatus === "calling"}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-white"
                  />
                </div>
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                Enter local phone number (e.g. <span className="font-mono text-[#374151]">9876543210</span>) or full international format.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] uppercase tracking-wider mb-1.5">
                Call Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Introductory Call"
                disabled={loading || callStatus === "calling"}
                className="w-full h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-white"
              />
            </div>

            {/* How it works info box */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5">
              <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-800 space-y-1">
                <p className="font-medium">How Twilio Outbound works:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-blue-700">
                  <li>Twilio calls <strong>your registered staff phone</strong> first.</li>
                  <li>When you answer, you will be connected to <strong>{lead.name}</strong>.</li>
                </ol>
              </div>
            </div>

            {/* Live Status Messages */}
            {callStatus === "calling" && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center gap-3 animate-pulse">
                <Spinner size={18} className="text-amber-600" />
                <div>
                  <p className="font-semibold">Placing Call...</p>
                  <p className="text-xs text-amber-700">Connecting to Twilio voice gateway...</p>
                </div>
              </div>
            )}

            {callStatus === "success" && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm space-y-2">
                <div className="flex items-center gap-2 font-semibold text-emerald-800">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>Call Connected!</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  {statusMessage}
                </p>
                {callSid && (
                  <p className="text-[11px] text-emerald-600 font-mono">
                    Call SID: {callSid}
                  </p>
                )}
              </div>
            )}

            {callStatus === "error" && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5">
                <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Call Error</p>
                  <p className="text-xs text-rose-700 leading-relaxed">{statusMessage}</p>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EEF2F7]">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="h-11 px-5 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#111827] hover:bg-gray-50 transition cursor-pointer disabled:opacity-60"
              >
                {callStatus === "success" ? "Done" : "Cancel"}
              </button>

              {callStatus !== "success" && (
                <button
                  type="submit"
                  disabled={loading || !phoneNumber.trim()}
                  className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-md shadow-emerald-200"
                >
                  {loading ? (
                    <>
                      <Spinner size={16} className="text-white" />
                      <span>Dialing...</span>
                    </>
                  ) : (
                    <>
                      <PhoneForwarded size={16} />
                      <span>Start Call</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
