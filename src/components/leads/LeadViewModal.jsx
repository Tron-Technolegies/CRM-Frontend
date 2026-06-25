import { Building2, Calendar, Flag, Mail, Phone, Tag, Users, Pencil, ArrowRightLeft } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import DealFormModal from "../deals/DealFormModal";

const BASE_URL = "http://127.0.0.1:8000/api/admin";

const priorityConfig = {
  High:   { style: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",    dot: "bg-rose-500",  label: "High Priority" },
  Medium: { style: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", dot: "bg-amber-500", label: "Medium Priority" },
  Low:    { style: "bg-green-50 text-green-700 ring-1 ring-green-200", dot: "bg-green-500", label: "Low Priority" },
};

const statusConfig = {
  New:       { style: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",          dot: "bg-blue-500" },
  Contacted: { style: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",       dot: "bg-amber-500" },
  Qualified: { style: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",    dot: "bg-violet-500" },
  Converted: { style: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
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
  const colors = ["from-blue-500 to-indigo-600", "from-violet-500 to-purple-600", "from-emerald-500 to-teal-600", "from-rose-500 to-pink-600", "from-amber-500 to-orange-600"];
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
      <p className="text-sm font-medium text-[#111827]">Failed to load lead</p>
      <p className="text-xs text-[#9CA3AF]">Check your connection or try again.</p>
      <button type="button" onClick={onClose} className="mt-2 h-9 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#374151] font-medium hover:bg-[#F9FAFB] transition">Close</button>
    </div>
  );
}

export default function LeadViewModal({ open, onClose, onEdit, leadId = null, onConvertSuccess }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const [convertLoading, setConvertLoading] = useState(false);

  useEffect(() => {
    if (!open || !leadId) return;
    setLoading(true);
    setData(null);
    setError(false);
    fetch(`${BASE_URL}/lead/single/view/${leadId}/`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [open, leadId]);

  // Prefill deal form from lead data
  const dealInitialData = data ? {
    name: "",
    company_name: data.companyName || "",
    stage: "Proposal",
    value: "",
    expectedCloseDate: "",
    source: data.source || "Website",
    priority: data.priority || "Medium",
    description: data.description || "",
    leadId: data.id,
  } : null;

  const handleConvertSubmit = async (form) => {
    setConvertLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/deal/add/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deal_name: form.dealName.trim(),
          company_name: form.companyName.trim(),
          deal_amount: Number(form.dealAmount),
          stage: form.stage,
          assigned_to: null,
          expected_close_date: form.expectedCloseDate,
          deal_source: form.dealSource,
          priority: form.priority,
          deal_description: form.description.trim(),
          lead_id: data.id,
        }),
      });
      if (!res.ok) throw new Error();
      setConvertOpen(false);
      onClose();
      if (onConvertSuccess) onConvertSuccess();
    } catch {
      console.error("Convert failed");
    } finally {
      setConvertLoading(false);
    }
  };

  const isConverted = data?.status?.toLowerCase() === "converted";

  return (
    <>
      <Modal open={open} title="Lead Details" subtitle="Full profile for this lead" onClose={onClose} maxWidthClassName="max-w-2xl">
        {loading && <Skeleton />}
        {error && <ErrorState onClose={onClose} />}
        {!loading && !error && data && (
          <>
            <div className="space-y-3">
              {/* Header card */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-[#F0F5FF] to-white border border-[#E0E9FF]">
                <Avatar name={data.name} />
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="text-xl font-bold text-[#0F172A] truncate">{data.name || "Unknown"}</h3>
                  <p className="text-sm text-[#6B7280] truncate mt-0.5 font-medium">{data.companyName || "No company"}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <Badge value={data.status} config={statusConfig} />
                    <Badge value={data.priority} config={priorityConfig} />
                    {data.assignedTo && data.assignedTo !== "—" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 ring-1 ring-slate-200">
                        <Users size={11} />{data.assignedTo}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Section title="Contact Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Phone" icon={Phone} value={data.phone} />
                  <Field label="Email" icon={Mail} value={data.email} />
                  <Field label="Company" icon={Building2} value={data.companyName} />
                </div>
              </Section>

              <Section title="Lead Details">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  <Field label="Source" icon={Tag} value={data.source} />
                  <Field label="Priority" icon={Flag} value={data.priority} />
                  <Field label="Status" icon={Tag} value={data.status} />
                  <Field label="Assigned To" icon={Users} value={data.assignedTo} />
                  <Field label="Date Added" icon={Calendar} value={data.dateAdded} />
                </div>
              </Section>

              {data.description && (
                <Section title="Notes">
                  <p className="text-sm text-[#374151] leading-relaxed">{data.description}</p>
                </Section>
              )}

              {/* Convert to Deal banner */}
              {!isConverted && (
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">Ready to convert this lead?</p>
                    <p className="text-xs text-emerald-600 mt-0.5">Create a deal directly from this lead and link them together.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConvertOpen(true)}
                    className="shrink-0 h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <ArrowRightLeft size={13} />
                    Convert to Deal
                  </button>
                </div>
              )}

              {isConverted && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="text-sm font-medium text-emerald-700">This lead has already been converted to a deal.</p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-[#F0F2F5] flex items-center justify-between">
              <p className="text-xs text-[#9CA3AF]">Added {data.dateAdded || "—"}</p>
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
                    className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition text-white text-sm font-semibold flex items-center gap-2 shadow-sm"
                  >
                    <Pencil size={13} />Edit Lead
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </Modal>

      {/* Convert to Deal Modal */}
      {convertOpen && (
        <DealFormModal
          open={convertOpen}
          onClose={() => setConvertOpen(false)}
          onSubmit={handleConvertSubmit}
          loading={convertLoading}
          initialData={dealInitialData}
        />
      )}
    </>
  );
}