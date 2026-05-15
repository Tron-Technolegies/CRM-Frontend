import { useMemo, useState } from "react";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";

const defaultSources = ["Website", "WhatsApp", "Facebook Ads", "Google Ads", "Referral"];
const defaultPriorities = ["Low", "Medium", "High"];
const defaultAssignees = ["Mark Brown", "Sarah Wilson", "David Lee"];
const defaultCountryCodes = ["+91", "+1", "+44", "+65", "+971"];

function validateLead(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = "Full name is required";
  if (!form.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
  if (!form.companyName.trim()) errors.companyName = "Company name is required";
  if (!form.assignedTo) errors.assignedTo = "Assignee is required";
  if (!form.leadSource) errors.leadSource = "Lead source is required";
  if (!form.priority) errors.priority = "Priority is required";
  return errors;
}

export default function LeadFormModal({ open, onClose, onSubmit, loading = false }) {
  const initialForm = useMemo(
    () => ({
      fullName: "",
      countryCode: "+91",
      phoneNumber: "",
      email: "",
      companyName: "",
      leadSource: "Website",
      assignedTo: "",
      priority: "Medium",
      expectedClosingDate: "",
      description: "",
    }),
    [],
  );

  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});

  const errors = validateLead(form);
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
      fullName: true,
      phoneNumber: true,
      companyName: true,
      assignedTo: true,
      leadSource: true,
      priority: true,
    });
    if (hasErrors) return;
    onSubmit(form);
  };

  return (
    <Modal
      open={open}
      title="Add New Lead"
      subtitle="Fill in the details below to add a new lead to your CRM"
      onClose={closeAndReset}
      maxWidthClassName="max-w-3xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="text-sm text-[#111827] font-medium">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            value={form.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, fullName: true }))}
            placeholder="Enter full name"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
          {touched.fullName && errors.fullName && (
            <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="mt-2 flex items-center gap-2">
            <select
              value={form.countryCode}
              onChange={(e) => setField("countryCode", e.target.value)}
              className="h-11 rounded-xl border border-[#E5E7EB] px-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
            >
              {defaultCountryCodes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              value={form.phoneNumber}
              onChange={(e) => setField("phoneNumber", e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, phoneNumber: true }))}
              placeholder="Enter phone number"
              className="h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          {touched.phoneNumber && errors.phoneNumber && (
            <p className="text-xs text-red-600 mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">Email</label>
          <input
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="Enter email address"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
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
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
          {touched.companyName && errors.companyName && (
            <p className="text-xs text-red-600 mt-1">{errors.companyName}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">
            Lead Source <span className="text-red-500">*</span>
          </label>
          <select
            value={form.leadSource}
            onChange={(e) => setField("leadSource", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, leadSource: true }))}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
          >
            {defaultSources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {touched.leadSource && errors.leadSource && (
            <p className="text-xs text-red-600 mt-1">{errors.leadSource}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">
            Assigned To <span className="text-red-500">*</span>
          </label>
          <select
            value={form.assignedTo}
            onChange={(e) => setField("assignedTo", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, assignedTo: true }))}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="" disabled>
              Select team member
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
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            value={form.priority}
            onChange={(e) => setField("priority", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, priority: true }))}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
          >
            {defaultPriorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {touched.priority && errors.priority && (
            <p className="text-xs text-red-600 mt-1">{errors.priority}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">Expected Closing Date</label>
          <input
            type="date"
            value={form.expectedClosingDate}
            onChange={(e) => setField("expectedClosingDate", e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-[#111827] font-medium">Lead Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Enter description..."
            className="mt-2 w-full min-h-[110px] rounded-xl border border-[#E5E7EB] p-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 resize-none"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={closeAndReset}
          disabled={loading}
          className="h-11 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2 disabled:opacity-60"
        >
          {loading && <Spinner size={16} className="text-white" />}
          Save Lead
        </button>
      </div>
    </Modal>
  );
}

