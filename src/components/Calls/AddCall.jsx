import { useEffect, useState } from "react";
import { X } from "lucide-react";


const callTypeOptions = ["inbound", "outbound"];
const statusOptions = ["scheduled", "completed", "missed", "cancelled"];

export default function AddCall({
    open,
    onClose,
    onSubmit,
    loading,
    initialData = null,
    staff = [],
    leads = [],
    customers = [],
    deals = [],
    }) {


  const [form, setForm] = useState({
    subject: "",
    call_type: "outbound",
    status: "scheduled",
    start_time: "",
    duration: "",
    notes: "",
    assigned_to: "",
    related_type: "none",
    related_lead: "",
    related_contact: "",
    related_deal: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
        setForm({
        subject: initialData.subject || "",
        call_type: initialData.call_type || "outbound",
        status: initialData.status || "scheduled",
        start_time: initialData.start_time || "",
        duration: initialData.duration || "",
        notes: initialData.notes || "",
        assigned_to: initialData.assigned_to || "",
        related_type: initialData.related_type || "none",
        related_lead: initialData.related_lead || "",
        related_contact: initialData.related_contact || "",
        related_deal: initialData.related_deal || "",
        });
    }
  }, [initialData]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.subject || !form.call_type || !form.start_time || !form.duration) {
        setError("Subject, call type, start time and duration are required");
        return;
    }

    setError("");

    onSubmit({
        subject: form.subject,
        call_type: form.call_type,
        status: form.status,
        start_time: form.start_time,
        duration: Number(form.duration),
        notes: form.notes,
        assigned_to: form.assigned_to || null,
        related_type: form.related_type,
        related_lead:
        form.related_type === "lead" ? form.related_lead : null,
        related_contact:
        form.related_type === "contact" ? form.related_contact : null,
        related_deal:
        form.related_type === "deal" ? form.related_deal : null,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#EEF2F7]">
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">Log New Call</h2>
            <p className="text-sm text-[#64748B] mt-1">Record a new call activity</p>
          </div>
          <button type="button" onClick={onClose} className="text-[#94A3B8] hover:text-[#111827] transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="text-sm text-[#111827] font-medium">Subject <span className="text-red-500">*</span></label>
              <input
                value={form.subject}
                onChange={(e) => setField("subject", e.target.value)}
                placeholder="e.g. Follow up call with ABC Solutions"
                className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm text-[#111827] font-medium">Call Type <span className="text-red-500">*</span></label>
              <select
                value={form.call_type}
                onChange={(e) => setField("call_type", e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
              >
                {callTypeOptions.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-[#111827] font-medium">Status</label>
              <select
                value={form.status}
                onChange={(e) => setField("status", e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-[#111827] font-medium">Start Time <span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                value={form.start_time}
                onChange={(e) => setField("start_time", e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm text-[#111827] font-medium">Duration (minutes) <span className="text-red-500">*</span></label>
              <input
                type="number"
                min="1"
                value={form.duration}
                onChange={(e) => setField("duration", e.target.value)}
                placeholder="e.g. 15"
                className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm text-[#111827] font-medium">Assigned To</label>
              <select
                value={form.assigned_to}
                onChange={(e) => setField("assigned_to", e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select team member</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>{s.fullName}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-[#111827] font-medium">Related To</label>
              <select
                value={form.related_type}
                onChange={(e) => setField("related_type", e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="none">None</option>
                <option value="lead">Lead</option>
                <option value="contact">Contact (Customer)</option>
                <option value="deal">Deal</option>
              </select>
            </div>

            {form.related_type === "lead" && (
              <div className="md:col-span-2">
                <label className="text-sm text-[#111827] font-medium">Select Lead</label>
                <select
                  value={form.related_lead}
                  onChange={(e) => setField("related_lead", e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select lead</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
            )}

            {form.related_type === "contact" && (
              <div className="md:col-span-2">
                <label className="text-sm text-[#111827] font-medium">Select Contact</label>
                <select
                  value={form.related_contact}
                  onChange={(e) => setField("related_contact", e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select contact</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.companyName}</option>
                  ))}
                </select>
              </div>
            )}

            {form.related_type === "deal" && (
              <div className="md:col-span-2">
                <label className="text-sm text-[#111827] font-medium">Select Deal</label>
                <select
                  value={form.related_deal}
                  onChange={(e) => setField("related_deal", e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select deal</option>
                  {deals.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="text-sm text-[#111827] font-medium">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                placeholder="Call summary or notes..."
                className="mt-2 w-full min-h-[90px] rounded-xl border border-[#E5E7EB] p-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#EEF2F7]">
          <button type="button" onClick={onClose} disabled={loading} className="h-11 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] disabled:opacity-60">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={loading} className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium disabled:opacity-60">
            Create
          </button>
        </div>
      </div>
    </div>
  );
}