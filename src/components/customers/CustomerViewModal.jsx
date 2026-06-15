import { Building2, Calendar, Mail, Phone, Tag, TrendingUp, User, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "../ui/Modal";

const BASE_URL = "http://127.0.0.1:8000/api/admin";

const statusConfig = {
  Active:   { style: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  Inactive: { style: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",      dot: "bg-slate-400" },
  Churned:  { style: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",          dot: "bg-rose-500" },
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
  const colors = ["from-emerald-500 to-teal-600","from-blue-500 to-indigo-600","from-violet-500 to-purple-600","from-rose-500 to-pink-600","from-amber-500 to-orange-600"];
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
      <p className="text-sm font-medium text-[#111827]">Failed to load customer</p>
      <p className="text-xs text-[#9CA3AF]">Check your connection or try again.</p>
      <button type="button" onClick={onClose} className="mt-2 h-9 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#374151] font-medium hover:bg-[#F9FAFB] transition">Close</button>
    </div>
  );
}

export default function CustomerViewModal({ open, onClose, onEdit, customerId = null }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open || !customerId) return;
    setLoading(true);
    setData(null);
    setError(false);
    fetch(`${BASE_URL}/customer/single/view/${customerId}/`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => {console.log("API Response:", d); setData(d)})
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [open, customerId]);

  const formattedLTV = data?.lifetimeValue
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(data.lifetimeValue)
    : "—";

  return (
    <Modal open={open} title="Customer Details" subtitle="Full profile for this customer" onClose={onClose} maxWidthClassName="max-w-2xl">
      {loading && <Skeleton />}
      {error && <ErrorState onClose={onClose} />}
      {!loading && !error && data && (
        <>
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-[#F0FFF8] to-white border border-[#C6F6E1]">
              <Avatar name={data.companyName} />
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-xl font-bold text-[#0F172A] truncate">{data.companyName || "Unknown"}</h3>
                <p className="text-sm text-[#6B7280] truncate mt-0.5 font-medium">{data.contactName || "No contact"}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge value={data.status} config={statusConfig} />
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                    <TrendingUp size={11} />LTV: {formattedLTV}
                  </span>
                  {data.industry && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 ring-1 ring-slate-200">
                      <Tag size={11} />{data.industry}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Section title="Contact Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Contact Name" icon={User} value={data.contactName} />
                <Field label="Phone" icon={Phone} value={data.phone} />
                <Field label="Email" icon={Mail} value={data.email} />
                <Field label="Industry" icon={Building2} value={data.industry} />
              </div>
            </Section>

            <Section title="Account Details">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                <Field label="Status" icon={Tag} value={data.status} />
                <Field label="Lifetime Value" icon={TrendingUp} value={formattedLTV} />
                <Field label="Join Date" icon={Calendar} value={data.joinDate} />
              </div>
            </Section>
          </div>

          <div className="mt-5 pt-4 border-t border-[#F0F2F5] flex items-center justify-between">
            <p className="text-xs text-[#9CA3AF]">Joined {data.joinDate || "—"}</p>
            <div className="flex items-center gap-2.5">
              <button type="button" onClick={onClose} className="h-10 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#374151] font-medium hover:bg-[#F9FAFB] transition">Close</button>
              {onEdit && (
                <button type="button" onClick={() => { onClose(); onEdit(data); }} className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition text-white text-sm font-semibold flex items-center gap-2 shadow-sm">
                  <Pencil size={13} />Edit Customer
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}