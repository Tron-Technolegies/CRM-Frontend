import { useMemo, useState } from "react";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";

const defaultStages = ["Proposal", "Negotiation", "Discussion"];
const defaultPriorities = ["Low", "Medium", "High"];
const defaultSources = ["Website", "WhatsApp", "Referral", "Google Ads", "Facebook Ads"];
const defaultAssignees = ["Mark Brown", "Sarah Wilson", "David Lee"];

function validateDeal(form) {
  const errors = {};
  if (!form.dealName.trim()) errors.dealName = "Deal name is required";
  if (!form.companyName.trim()) errors.companyName = "Company name is required";
  const amount = Number(form.dealAmount);
  if (!form.dealAmount || Number.isNaN(amount) || amount <= 0) errors.dealAmount = "Valid amount is required";
  if (!form.stage) errors.stage = "Stage is required";
  if (!form.assignedTo) errors.assignedTo = "Assignee is required";
  if (!form.expectedCloseDate) errors.expectedCloseDate = "Expected close date is required";
  return errors;
}

export default function DealFormModal({ open, onClose, onSubmit, loading = false }) {
  const initialForm = useMemo(
    () => ({
      dealName: "",
      companyName: "",
      dealAmount: "",
      stage: "Proposal",
      assignedTo: "",
      expectedCloseDate: "",
      dealSource: "Website",
      priority: "Medium",
      description: "",
    }),
    [],
  );

  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});

  const errors = validateDeal(form);
  const hasErrors = Object.keys(errors).length > 0;

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const closeAndReset = () => {
    if (loading) return;
    setForm(initialForm);
    setTouched({});
    onClose();
  };

  const submit = () => {
    setTouched({
      dealName: true,
      companyName: true,
      dealAmount: true,
      stage: true,
      assignedTo: true,
      expectedCloseDate: true,
    });
    if (hasErrors) return;
    onSubmit(form);
  };

  return (
    <Modal
      open={open}
      title="Add New Deal"
      subtitle="Fill in the details below to add a new deal to your pipeline"
      onClose={closeAndReset}
      maxWidthClassName="max-w-3xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="text-sm text-[#111827] font-medium">
            Deal Name <span className="text-red-500">*</span>
          </label>
          <input
            value={form.dealName}
            onChange={(e) => setField("dealName", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, dealName: true }))}
            placeholder="Enter deal name"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 cursor-text"
          />
          {touched.dealName && errors.dealName && <p className="text-xs text-red-600 mt-1">{errors.dealName}</p>}
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            value={form.companyName}
            onChange={(e) => setField("companyName", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, companyName: true }))}
            placeholder="Enter company name"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 cursor-text"
          />
          {touched.companyName && errors.companyName && (
            <p className="text-xs text-red-600 mt-1">{errors.companyName}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">
            Deal Amount <span className="text-red-500">*</span>
          </label>
          <input
            inputMode="decimal"
            value={form.dealAmount}
            onChange={(e) => setField("dealAmount", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, dealAmount: true }))}
            placeholder="$ 0.00"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 cursor-text"
          />
          {touched.dealAmount && errors.dealAmount && (
            <p className="text-xs text-red-600 mt-1">{errors.dealAmount}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">
            Stage <span className="text-red-500">*</span>
          </label>
          <select
            value={form.stage}
            onChange={(e) => setField("stage", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, stage: true }))}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            {defaultStages.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {touched.stage && errors.stage && <p className="text-xs text-red-600 mt-1">{errors.stage}</p>}
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">
            Assigned To <span className="text-red-500">*</span>
          </label>
          <select
            value={form.assignedTo}
            onChange={(e) => setField("assignedTo", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, assignedTo: true }))}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            <option value="" disabled>
              Assigned to
            </option>
            {defaultAssignees.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          {touched.assignedTo && errors.assignedTo && (
            <p className="text-xs text-red-600 mt-1">{errors.assignedTo}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">
            Expected Close Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={form.expectedCloseDate}
            onChange={(e) => setField("expectedCloseDate", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, expectedCloseDate: true }))}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
          />
          {touched.expectedCloseDate && errors.expectedCloseDate && (
            <p className="text-xs text-red-600 mt-1">{errors.expectedCloseDate}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">Deal Source</label>
          <select
            value={form.dealSource}
            onChange={(e) => setField("dealSource", e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            {defaultSources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => setField("priority", e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            {defaultPriorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-[#111827] font-medium">Deal Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Enter description..."
            className="mt-2 w-full min-h-[110px] rounded-xl border border-[#E5E7EB] p-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 resize-none cursor-text"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={closeAndReset}
          disabled={loading}
          className="h-11 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] disabled:opacity-60 cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {loading && <Spinner size={16} className="text-white" />}
          Save Deal
        </button>
      </div>
    </Modal>
  );
}
