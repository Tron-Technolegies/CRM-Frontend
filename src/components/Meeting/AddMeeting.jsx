import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import Spinner from "../ui/Spinner";

const venueOptions = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline / In Person" },
];

const repeatOptions = [
  { value: "none", label: "Does not Repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const relatedTypeOptions = [
  { value: "none", label: "None" },
  { value: "lead", label: "Lead" },
  { value: "customer", label: "Customer" },
  { value: "account", label: "Account" },
];

// Your GET endpoints (view_meetings / view_single_meeting) return ISO
// strings with timezone offsets (e.g. "2026-07-20T14:30:00+05:30").
// <input type="datetime-local"> needs "YYYY-MM-DDTHH:mm" in local time.
function toDatetimeLocalValue(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function validateMeeting(form) {
  const errors = {};

  if (!form.title.trim()) {
    errors.title = "Meeting title is required";
  }
  if (!form.fromDatetime) {
    errors.fromDatetime = "Start date & time is required";
  }
  if (!form.toDatetime) {
    errors.toDatetime = "End date & time is required";
  }
  if (
    form.fromDatetime &&
    form.toDatetime &&
    new Date(form.toDatetime) < new Date(form.fromDatetime)
  ) {
    errors.toDatetime = "End time cannot be before start time";
  }
  if (form.meetingVenue === "offline" && !form.location.trim()) {
    errors.location = "Location is required";
  }
  if (form.relatedType === "lead" && !form.relatedLead) {
    errors.relatedLead = "Please select a lead";
  }
  if (form.relatedType === "customer" && !form.relatedCustomer) {
    errors.relatedCustomer = "Please select a customer";
  }
  if (form.relatedType === "account" && !form.relatedAccount) {
    errors.relatedAccount = "Please select an account";
  }

  return errors;
}

export default function AddMeeting({
  onClose,
  onSubmit,
  initialData = null,
  staff = [],
  leads = [],
  customers = [],
  accounts = [],
}) {
  const blankForm = useMemo(
    () => ({
      title: "",
      meetingVenue: "online",
      provider: "",
      location: "",
      allDay: false,
      fromDatetime: "",
      toDatetime: "",
      host: "",
      participants: [],
      relatedType: "none",
      relatedLead: "",
      relatedCustomer: "",
      relatedAccount: "",
      repeat: "none",
    }),
    [],
  );

  const [form, setForm] = useState(blankForm);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // initialData comes from view_single_meeting, which is camelCase and
  // gives host as a display name (not an id) — hostId is the real FK.
  useEffect(() => {
    if (!initialData) {
      setForm(blankForm);
      setTouched({});
      return;
    }

    setForm({
      title: initialData.title || "",
      meetingVenue: initialData.meetingVenue || "online",
      provider: initialData.provider || "",
      location: initialData.location || "",
      allDay: initialData.allDay || false,
      fromDatetime: toDatetimeLocalValue(initialData.fromDatetime),
      toDatetime: toDatetimeLocalValue(initialData.toDatetime),
      host: initialData.hostId || "",
      participants: (initialData.participants || []).map((p) => p.id),
      relatedType: initialData.relatedType || "none",
      relatedLead: initialData.relatedLead?.id || "",
      relatedCustomer: initialData.relatedCustomer?.id || "",
      relatedAccount: initialData.relatedAccount?.id || "",
      repeat: initialData.repeat || "none",
    });
    setTouched({});
  }, [initialData, blankForm]);

  const errors = validateMeeting(form);
  const hasErrors = Object.keys(errors).length > 0;

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleParticipant = (id) => {
    setForm((prev) => {
      const exists = prev.participants.includes(id);
      return {
        ...prev,
        participants: exists
          ? prev.participants.filter((p) => p !== id)
          : [...prev.participants, id],
      };
    });
  };

  const submit = async () => {
    setTouched({
      title: true,
      fromDatetime: true,
      toDatetime: true,
      location: true,
      relatedLead: true,
      relatedCustomer: true,
      relatedAccount: true,
    });

    if (hasErrors) return;

    // add_meeting / update_meeting expect snake_case in the request body,
    // even though the GET views return camelCase — this payload matches
    // the POST/PUT views exactly.
    const payload = {
      title: form.title,
      meeting_venue: form.meetingVenue,
      provider: form.meetingVenue === "online" ? form.provider : "",
      location: form.meetingVenue === "offline" ? form.location : "",
      all_day: form.meetingVenue === "offline" ? form.allDay : false,
      from_datetime: form.fromDatetime,
      to_datetime: form.toDatetime,
      host: form.host || null,
      participants: form.participants,
      related_type: form.relatedType,
      related_lead: form.relatedType === "lead" ? form.relatedLead : null,
      related_customer:
        form.relatedType === "customer" ? form.relatedCustomer : null,
      related_account:
        form.relatedType === "account" ? form.relatedAccount : null,
      repeat: form.repeat,
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100";
  const labelClass = "text-sm text-[#111827] font-medium";
  const sectionClass = "rounded-xl border border-[#E5E7EB] p-5";
  const sectionTitleClass = "text-sm font-semibold text-[#111827] mb-5";

  return (
    // flex-col + max-h on the OUTER wrapper is what keeps the footer
    // pinned and visible no matter how tall the form content gets.
    <div className="bg-white rounded-2xl shadow-xl border border-[#E5E7EB] max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB] shrink-0">
        <div>
          <h2 className="text-xl font-bold text-[#111827]">
            {initialData ? "Edit Meeting" : "Schedule New Meeting"}
          </h2>
          <p className="text-sm text-[#6B7280] mt-1">
            {initialData
              ? "Update the meeting details below"
              : "Fill in the details below to schedule a new meeting"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="p-2 rounded-lg text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827] transition disabled:opacity-60"
        >
          <X size={20} />
        </button>
      </div>

      {/* Scrollable body — takes remaining space, footer stays outside it */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
        {/* Meeting Details */}
        <div className={sectionClass}>
          <h3 className={sectionTitleClass}>Meeting Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={labelClass}>
                Meeting Title <span className="text-red-500">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, title: true }))}
                className={inputClass}
                placeholder="Enter meeting title"
              />
              {touched.title && errors.title && (
                <p className="text-xs text-red-600 mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Meeting Venue</label>
              <select
                value={form.meetingVenue}
                onChange={(e) => setField("meetingVenue", e.target.value)}
                className={`${inputClass} bg-white`}
              >
                {venueOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {form.meetingVenue === "online" ? (
              <div>
                <label className={labelClass}>Provider</label>
                <input
                  value={form.provider}
                  onChange={(e) => setField("provider", e.target.value)}
                  className={inputClass}
                  placeholder="Google Meet / Zoom"
                />
              </div>
            ) : (
              <div>
                <label className={labelClass}>
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.location}
                  onChange={(e) => setField("location", e.target.value)}
                  onBlur={() =>
                    setTouched((p) => ({ ...p, location: true }))
                  }
                  className={inputClass}
                  placeholder="Meeting location"
                />
                {touched.location && errors.location && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.location}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Date & Time */}
        <div className={sectionClass}>
          <h3 className={sectionTitleClass}>Date & Time</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>
                From <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={form.fromDatetime}
                onChange={(e) => setField("fromDatetime", e.target.value)}
                onBlur={() =>
                  setTouched((p) => ({ ...p, fromDatetime: true }))
                }
                className={inputClass}
              />
              {touched.fromDatetime && errors.fromDatetime && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.fromDatetime}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                To <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={form.toDatetime}
                onChange={(e) => setField("toDatetime", e.target.value)}
                onBlur={() =>
                  setTouched((p) => ({ ...p, toDatetime: true }))
                }
                className={inputClass}
              />
              {touched.toDatetime && errors.toDatetime && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.toDatetime}
                </p>
              )}
            </div>

            {form.meetingVenue === "offline" && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  id="allDay"
                  type="checkbox"
                  checked={form.allDay}
                  onChange={(e) => setField("allDay", e.target.checked)}
                  className="h-4 w-4 rounded border-[#E5E7EB] text-blue-600 focus:ring-blue-100"
                />
                <label htmlFor="allDay" className="text-sm text-[#111827]">
                  All Day Event
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Host & Repeat */}
        <div className={sectionClass}>
          <h3 className={sectionTitleClass}>Meeting Organizer</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Host</label>
              <select
                value={form.host}
                onChange={(e) => setField("host", e.target.value)}
                className={`${inputClass} bg-white`}
              >
                <option value="">Select Host</option>
                {staff.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Repeat</label>
              <select
                value={form.repeat}
                onChange={(e) => setField("repeat", e.target.value)}
                className={`${inputClass} bg-white`}
              >
                {repeatOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className={sectionClass}>
          <h3 className={sectionTitleClass}>Participants</h3>

          {staff.length === 0 ? (
            <div className="text-sm text-[#6B7280]">No staff available.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {staff.map((person) => {
                const active = form.participants.includes(person.id);
                return (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => toggleParticipant(person.id)}
                    className={`h-8 px-3 rounded-full text-xs font-medium border transition ${
                      active
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-[#E5E7EB] text-[#111827] hover:bg-[#F9FAFB]"
                    }`}
                  >
                    {person.fullName}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Related Record */}
        <div className={sectionClass}>
          <h3 className={sectionTitleClass}>Related Record</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Related To</label>
              <select
                value={form.relatedType}
                onChange={(e) => setField("relatedType", e.target.value)}
                className={`${inputClass} bg-white`}
              >
                {relatedTypeOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {form.relatedType === "lead" && (
              <div>
                <label className={labelClass}>
                  Lead <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.relatedLead}
                  onChange={(e) => setField("relatedLead", e.target.value)}
                  onBlur={() =>
                    setTouched((p) => ({ ...p, relatedLead: true }))
                  }
                  className={`${inputClass} bg-white`}
                >
                  <option value="">Select Lead</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name}
                    </option>
                  ))}
                </select>
                {touched.relatedLead && errors.relatedLead && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.relatedLead}
                  </p>
                )}
              </div>
            )}

            {form.relatedType === "customer" && (
              <div>
                <label className={labelClass}>
                  Customer <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.relatedCustomer}
                  onChange={(e) =>
                    setField("relatedCustomer", e.target.value)
                  }
                  onBlur={() =>
                    setTouched((p) => ({ ...p, relatedCustomer: true }))
                  }
                  className={`${inputClass} bg-white`}
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.contactName || customer.name || customer.contact_name || customer.companyName}
                    </option>
                  ))}
                </select>
                {touched.relatedCustomer && errors.relatedCustomer && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.relatedCustomer}
                  </p>
                )}
              </div>
            )}

            {form.relatedType === "account" && (
              <div>
                <label className={labelClass}>
                  Account <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.relatedAccount}
                  onChange={(e) =>
                    setField("relatedAccount", e.target.value)
                  }
                  onBlur={() =>
                    setTouched((p) => ({ ...p, relatedAccount: true }))
                  }
                  className={`${inputClass} bg-white`}
                >
                  <option value="">Select Account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.account_name}
                    </option>
                  ))}
                </select>
                {touched.relatedAccount && errors.relatedAccount && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.relatedAccount}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer — shrink-0 + outside the scroll area, so it's always visible */}
      <div className="border-t border-[#E5E7EB] px-6 py-4 flex justify-end gap-3 shrink-0">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="h-11 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2 disabled:opacity-60"
        >
          {submitting && <Spinner size={16} className="text-white" />}
          {initialData ? "Update Meeting" : "Save Meeting"}
        </button>
      </div>
    </div>
  );
}