import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Spinner from "../ui/Spinner";


const callTypeOptions = ["inbound", "outbound"];
const statusOptions = ["scheduled", "follow up", "completed", "missed", "cancelled"];
const priorityOptions = ["low", "medium", "high"];

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
    accounts = [],
    lockedRelatedType = null,
    lockedRelatedId = null,
    lockedRelatedName = null,
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
    related_account: "",
    task_priority: "medium",
    task_due_date: "",
  });

  const [error, setError] = useState("");

  const isLocked = Boolean(lockedRelatedType && lockedRelatedId);

  useEffect(() => {
    let related_type = "none";
    let related_lead = "";
    let related_contact = "";
    let related_deal = "";
    let related_account = "";

    if (isLocked) {
      // Preselect the relation the modal was opened from (e.g. the lead being viewed)
      related_type = lockedRelatedType;
      if (lockedRelatedType === "lead") related_lead = lockedRelatedId;
      if (lockedRelatedType === "contact") related_contact = lockedRelatedId;
      if (lockedRelatedType === "deal") related_deal = lockedRelatedId;
      if (lockedRelatedType === "account") related_account = lockedRelatedId;
    } else if (initialData?.lead) {
      related_type = "lead";
      related_lead = initialData.lead?.id ?? initialData.lead;
    } else if (initialData?.contact) {
      related_type = "contact";
      related_contact = initialData.contact?.id ?? initialData.contact;
    } else if (initialData?.deal) {
      related_type = "deal";
      related_deal = initialData.deal?.id ?? initialData.deal;
    } else if (initialData?.account) {
      related_type = "account";
      related_account = initialData.account?.id ?? initialData.account;
    }

    setForm({
      subject: initialData?.subject || "",
      call_type: initialData?.call_type || "outbound",
      status: initialData?.status || "scheduled",
      start_time: initialData?.start_time || "",
      duration: initialData?.duration || "",
      notes: initialData?.notes || "",
      assigned_to: initialData?.assigned_to?.id ?? initialData?.assigned_to ?? "",

      related_type,
      related_lead,
      related_contact,
      related_deal,
      related_account,

      task_priority: initialData?.task_priority || "medium",
      task_due_date: initialData?.task_due_date || "",
    });
  }, [initialData, open, isLocked, lockedRelatedType, lockedRelatedId]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const isFollowUp = form.status === "follow up";

  const handleSubmit = () => {
    if (!form.subject || !form.start_time || !form.duration) {
        setError("Subject, start time and duration are required");
        return;
    }

    if (isFollowUp && (!form.task_priority || !form.task_due_date)) {
      setError("Priority and due date are required when status is Follow Up");
      return;
    }

    setError("");

    const callPayload = {
        subject: form.subject,
        call_type: form.call_type,
        status: form.status,
        start_time: form.start_time,
        duration: Number(form.duration),
        notes: form.notes,
        assigned_to: form.assigned_to || null,
        related_type: form.related_type,
        related_lead: form.related_type === "lead" ? form.related_lead || null : null,
        related_contact: form.related_type === "contact" ? form.related_contact || null : null,
        related_deal: form.related_type === "deal" ? form.related_deal || null : null,
        related_account: form.related_type === "account" ? form.related_account || null : null,
    };

    const taskPayload = isFollowUp
      ? {
          title: form.subject,
          assigned_to: form.assigned_to || null,
          related_type: form.related_type !== "none" ? form.related_type : null,
          related_lead: form.related_type === "lead" ? form.related_lead || null : null,
          related_contact: form.related_type === "contact" ? form.related_contact || null : null,
          related_deal: form.related_type === "deal" ? form.related_deal || null : null,
          related_account: form.related_type === "account" ? form.related_account || null : null,
          priority: form.task_priority,
          status: "pending",
          due_date: form.task_due_date,
        }
      : null;

    onSubmit(callPayload, taskPayload);
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
                className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                {callTypeOptions.map((c) => (
                  <option key={c} value={c}>{c === "outbound" ? "Outbound (Outgoing call to lead/client)" : "Inbound (Incoming call from lead/client)"}</option>
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

            {isFollowUp && (
              <>
                <div>
                  <label className="text-sm text-[#111827] font-medium">Task Priority <span className="text-red-500">*</span></label>
                  <select
                    value={form.task_priority}
                    onChange={(e) => setField("task_priority", e.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {priorityOptions.map((p) => (
                      <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-[#111827] font-medium">Task Due Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={form.task_due_date}
                    onChange={(e) => setField("task_due_date", e.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </>
            )}

            {isLocked ? (
              <div className="md:col-span-2">
                <label className="text-sm text-[#111827] font-medium">Related To</label>
                <div className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] bg-gray-50 px-4 text-sm flex items-center text-[#111827]">
                  {lockedRelatedType.charAt(0).toUpperCase() + lockedRelatedType.slice(1)}: {lockedRelatedName || "—"}
                </div>
              </div>
            ) : (
              <>
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
                    <option value="account">Account</option>
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

                {form.related_type === "account" && (
                  <div className="md:col-span-2">
                    <label className="text-sm text-[#111827] font-medium">Select Account</label>
                    <select
                      value={form.related_account}
                      onChange={(e) => setField("related_account", e.target.value)}
                      className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select account</option>
                      {accounts.map((a) => (
                        <option key={a.id} value={a.id}>{a.accountName || a.account_name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
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
          <button type="button" onClick={onClose} disabled={loading} className="h-11 px-5 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#111827] hover:bg-gray-50 transition cursor-pointer disabled:opacity-60">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={loading} className="h-11 px-6 rounded-xl bg-[#2B61FF] hover:bg-blue-700 active:scale-[0.98] transition text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-sm">
            {loading && <Spinner size={16} className="text-white" />}
            <span>{loading ? "Creating..." : "Create"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}