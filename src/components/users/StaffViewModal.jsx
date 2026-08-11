import { Mail, Shield, Tag, Users, Pencil, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import api from "../../api/Api";

const statusConfig = {
  Active:  { style: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  Invited: { style: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",          dot: "bg-blue-500" },
};

function Badge({ value, config }) {
  const cfg = config[value] || { style: "bg-slate-100 text-slate-600 ring-1 ring-slate-200", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.style}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />{value}
    </span>
  );
}

function Avatar({ name }) {
  const initials = name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "??";
  const colors = ["from-blue-500 to-indigo-600","from-violet-500 to-purple-600","from-emerald-500 to-teal-600","from-rose-500 to-pink-600","from-amber-500 to-orange-600"];
  const color = colors[(initials.charCodeAt(0) || 0) % colors.length];
  return (
    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md`}>
      {initials}
    </div>
  );
}

function Field({ label, icon: Icon, value }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">
        {Icon && <Icon size={10} />}{label}
      </p>
      <p className={`text-sm font-medium leading-snug ${value ? "text-[#111827]" : "text-[#D1D5DB]"}`}>
        {value || "—"}
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-[#EAECF0] bg-[#FAFAFA] p-5 space-y-4">
      <p className="text-[10px] font-bold text-[#B0B7C3] uppercase tracking-[0.12em]">{title}</p>
      {children}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-28 rounded-2xl bg-[#F0F2F5]" />
      <div className="h-32 rounded-2xl bg-[#F0F2F5]" />
    </div>
  );
}

function ErrorState({ onClose }) {
  return (
    <div className="py-12 flex flex-col items-center gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center">
        <span className="text-rose-500 text-xl font-bold">!</span>
      </div>
      <p className="text-sm font-medium text-[#111827]">Failed to load staff</p>
      <p className="text-xs text-[#9CA3AF]">Check your connection or try again.</p>
      <button type="button" onClick={onClose} className="mt-2 h-9 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#374151] font-medium hover:bg-[#F9FAFB] transition">Close</button>
    </div>
  );
}

export default function StaffViewModal({ open, onClose, onEdit, staffId = null }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open || !staffId) return;
    setLoading(true);
    setData(null);
    setError(false);

    api
      .get(`/staff/single/view/${staffId}/`)
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Failed to load staff:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [open, staffId]);

  const invitedAt = data?.invitedAt
    ? new Date(data.invitedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <Modal open={open} title="Staff Details" subtitle="Full profile for this staff member" onClose={onClose} maxWidthClassName="max-w-2xl">
      {loading && <Skeleton />}
      {error && <ErrorState onClose={onClose} />}
      {!loading && !error && data && (
        <>
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-[#F0F4FF] to-white border border-[#DBEAFE]">
              <Avatar name={data.fullName} />
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-xl font-bold text-[#0F172A] truncate">{data.fullName || "Unknown"}</h3>
                <p className="text-sm text-[#6B7280] truncate mt-0.5 font-medium">{data.role || "No role"}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge value={data.status} config={statusConfig} />
                  {data.department && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 ring-1 ring-slate-200">
                      <Users size={11} />{data.department}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Section title="Staff Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Email" icon={Mail} value={data.email} />
                <Field label="Role" icon={Shield} value={data.role} />
                <Field label="Department" icon={Users} value={data.department} />
                <Field label="Status" icon={Tag} value={data.status} />
                {invitedAt && <Field label="Invited At" icon={Clock} value={invitedAt} />}
              </div>
            </Section>
          </div>

          <div className="mt-5 pt-4 border-t border-[#F0F2F5] flex items-center justify-between">
            <p className="text-xs text-[#9CA3AF]">{data.status === "Invited" ? `Invited ${invitedAt || "—"}` : "Active member"}</p>
            <div className="flex items-center gap-2.5">
              <button type="button" onClick={onClose} className="h-10 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#374151] font-medium hover:bg-[#F9FAFB] transition">Close</button>
              {onEdit && (
                <button type="button" onClick={() => { onClose(); onEdit(data); }} className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition text-white text-sm font-semibold flex items-center gap-2 shadow-sm">
                  <Pencil size={13} />Edit Staff
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}