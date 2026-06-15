import { Calendar, DollarSign, Flag, Tag, Users, Pencil, Briefcase, ArrowRightLeft } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import CustomerFormModal from "../customers/CustomerFormModal";

const BASE_URL = "http://127.0.0.1:8000/api/admin";

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

export default function DealViewModal({ open, onClose, onEdit, dealId = null, onConvertSuccess }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const [convertLoading, setConvertLoading] = useState(false);

  useEffect(() => {
    if (!open || !dealId) return;
    setLoading(true);
    setData(null);
    setError(false);
    fetch(`${BASE_URL}/deal/single/view/${dealId}/`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [open, dealId]);

  const formattedValue = data?.value
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(data.value)
    : "—";

  // Prefill customer form from deal data
  const customerInitialData = data ? {
    companyName: data.company_name || "",
    contactName: data.assignedTo !== "—" ? "" : "",
    email: "",
    phone: "",
    industry: "Technology",
    status: "Active",
    lifetimeValue: data.value || "",
    dealId: data.id,
  } : null;

  const handleConvertSubmit = async (form) => {
    setConvertLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/customer/add/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: form.companyName.trim(),
          contact_name: form.contactName.trim(),
          phone_number: form.phone.trim(),
          email: form.email.trim(),
          industry: form.industry,
          status: form.status.toLowerCase(),
          lifetime_value: Number(form.lifetimeValue || 0),
          deal_id: data.id,
        }),
      });
      if (!res.ok) throw new Error();
      setConvertOpen(false);
      onClose();
      if (onConvertSuccess) onConvertSuccess();
    } catch {
      console.error("Convert to customer failed");
    } finally {
      setConvertLoading(false);
    }
  };

  const isWon = data?.stage === "Won";

  return (
    <>
      <Modal open={open} title="Deal Details" subtitle="Full profile for this deal" onClose={onClose} maxWidthClassName="max-w-2xl">
        {loading && <Skeleton />}
        {error && <ErrorState onClose={onClose} />}
        {!loading && !error && data && (
          <>
            <div className="space-y-3">
              {/* Header card */}
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

              {data.description && (
                <Section title="Notes">
                  <p className="text-sm text-[#374151] leading-relaxed">{data.description}</p>
                </Section>
              )}

              {/* Convert to Customer banner */}
              {!isWon && (
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
                  <div>
                    <p className="text-sm font-semibold text-violet-800">Ready to close this deal?</p>
                    <p className="text-xs text-violet-600 mt-0.5">Convert this deal to a customer and mark it as Won.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConvertOpen(true)}
                    className="shrink-0 h-9 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 transition text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <ArrowRightLeft size={13} />
                    Convert to Customer
                  </button>
                </div>
              )}

              {isWon && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="text-sm font-medium text-emerald-700">This deal has been won and converted to a customer.</p>
                </div>
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

      {/* Convert to Customer Modal */}
      {convertOpen && (
        <CustomerFormModal
          open={convertOpen}
          onClose={() => setConvertOpen(false)}
          onSubmit={handleConvertSubmit}
          loading={convertLoading}
          initialData={customerInitialData}
        />
      )}
    </>
  );
}