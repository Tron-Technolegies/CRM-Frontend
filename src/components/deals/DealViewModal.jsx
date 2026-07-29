import { Calendar, DollarSign, Flag, Tag, Users, Pencil, Briefcase, Building2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Modal from "../ui/Modal";
import { getDeal } from "../../api/deal";

const priorityConfig = {
  High:   { style: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",    dot: "bg-rose-500",  label: "High Priority" },
  Medium: { style: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", dot: "bg-amber-500", label: "Medium Priority" },
  Low:    { style: "bg-green-50 text-green-700 ring-1 ring-green-200", dot: "bg-green-500", label: "Low Priority" },
};

const stageConfig = {
  Discussion:  { style: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",      dot: "bg-slate-400" },
  Demo:        { style: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",          dot: "bg-blue-500" },
  Proposal:    { style: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",    dot: "bg-violet-500" },
  Negotiation: { style: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",       dot: "bg-amber-500" },
  Won:         { style: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  Lost:        { style: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",          dot: "bg-rose-500" },
};

function Badge({ value, config }) {
  const cfg = config[value] || { style: "bg-slate-100 text-slate-600 ring-1 ring-slate-200", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.style}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      {cfg.label || value}
    </span>
  );
}

function Avatar({ name }) {
  const initials = name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "??";
  const colors = ["from-violet-500 to-purple-600", "from-blue-500 to-indigo-600", "from-emerald-500 to-teal-600", "from-rose-500 to-pink-600", "from-amber-500 to-orange-600"];
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
      <div className="h-40 rounded-2xl bg-[#F0F2F5]" />
    </div>
  );
}

function ErrorState({ onClose }) {
  return (
    <div className="py-12 flex flex-col items-center gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center">
        <span className="text-rose-500 text-xl font-bold">!</span>
      </div>
      <p className="text-sm font-medium text-[#111827]">Failed to load deal</p>
      <p className="text-xs text-[#9CA3AF]">Check your connection or try again.</p>
      <button type="button" onClick={onClose} className="mt-2 h-9 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#374151] font-medium hover:bg-[#F9FAFB] transition">Close</button>
    </div>
  );
}

export default function DealViewModal({ open, onClose, onEdit, dealId = null }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!open || !dealId) return;

    const thisRequestId = ++requestIdRef.current;

    setLoading(true);
    setData(null);
    setError(false);

    getDeal(dealId)
      .then((d) => {
        if (thisRequestId !== requestIdRef.current) return;
        setData(d);
      })
      .catch((err) => {
        if (thisRequestId !== requestIdRef.current) return;
        console.error("Failed to load deal:", err);
        setError(true);
      })
      .finally(() => {
        if (thisRequestId === requestIdRef.current) setLoading(false);
      });
  }, [open, dealId]);

  const formattedValue = data?.value
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(data.value)
    : "—";

  return (
    <Modal open={open} title="Deal Details" subtitle="Full profile for this deal" onClose={onClose} maxWidthClassName="max-w-2xl">
      {loading && <Skeleton />}
      {error && <ErrorState onClose={onClose} />}
      {!loading && !error && data && (
        <>
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-[#F5F0FF] to-white border border-[#E5D9FF]">
              <Avatar name={data.name} />
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-xl font-bold text-[#0F172A] truncate">{data.name || "Unknown Deal"}</h3>
                <p className="text-sm text-[#6B7280] truncate mt-0.5 font-medium">{data.company_name || "No company"}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge value={data.stage} config={stageConfig} />
                  <Badge value={data.priority} config={priorityConfig} />
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                    <DollarSign size={11} />{formattedValue}
                  </span>
                </div>
              </div>
            </div>

            <Section title="Deal Details">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                <Field label="Stage" icon={Briefcase} value={data.stage} />
                <Field label="Deal Value" icon={DollarSign} value={formattedValue} />
                <Field label="Priority" icon={Flag} value={data.priority} />
                <Field label="Source" icon={Tag} value={data.source} />
                <Field label="Assigned To" icon={Users} value={data.assignedTo} />
                <Field label="Expected Close" icon={Calendar} value={data.expectedCloseDate} />
              </div>
            </Section>

            <Section title="Related To">
              {data.relatedTo ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#6B7280]">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">{data.relatedTo.name}</p>
                    <span className="text-xs text-[#9CA3AF] capitalize">{data.relatedTo.type}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#D1D5DB]">Not linked to a customer or account</p>
              )}
            </Section>

            {data.description && (
              <Section title="Notes">
                <p className="text-sm text-[#374151] leading-relaxed">{data.description}</p>
              </Section>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-[#F0F2F5] flex items-center justify-between">
            <p className="text-xs text-[#9CA3AF]">Expected close {data.expectedCloseDate || "—"}</p>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#374151] font-medium hover:bg-[#F9FAFB] transition"
              >
                Close
              </button>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => { onClose(); onEdit(data); }}
                  className="h-10 px-5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.98] transition text-white text-sm font-semibold flex items-center gap-2 shadow-sm"
                >
                  <Pencil size={13} />Edit Deal
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}