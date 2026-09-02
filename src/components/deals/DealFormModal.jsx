import { useEffect, useMemo, useState } from "react";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";
import { usePicklist } from "../../hooks/usePicklist";
import api from "../../api/Api";
import { getLead } from "../../api/lead";
import { getCustomers } from "../../api/customer";
import { getAccounts } from "../../api/account";

function validateDeal(form, convertMode = false) {
  const errors = {};

  if (!form.dealName.trim()) {
    errors.dealName = "Deal name is required";
  }

  if (!form.companyName.trim()) {
    errors.companyName = "Company name is required";
  }

  const amount = Number(form.dealAmount);

  if (!form.dealAmount || Number.isNaN(amount) || amount <= 0) {
    errors.dealAmount = "Valid amount is required";
  }

  if (!form.stage) {
    errors.stage = "Stage is required";
  }

  if (!form.expectedCloseDate) {
    errors.expectedCloseDate = "Expected close date is required";
  }

  // "Related To" only applies to the standalone Add/Edit Deal flow —
  // in conversion mode the deal is inherently related to the entity
  // just created in the prior step, so don't require it here.
  if (!convertMode && (!form.relatedType || !form.relatedId)) {
    errors.related = "Select a customer or account to link this deal to";
  }

  return errors;
}

export default function DealFormModal({
  open,
  onClose,
  onSubmit,
  loading = false,
  initialData = null,

  // Conversion-flow props (all optional, no-op for standalone add/edit use)
  convertMode = false,
  leadId = null,
  onBack = null,
  prefill = null, // e.g. { companyName } — from whatever the Customer/Account step collected
}) {
  const [staff, setStaff] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [leadPrefill, setLeadPrefill] = useState(null); // { companyName, source } from the lead itself

  const stageOptions = usePicklist("deal_stage");
  const sourceOptions = usePicklist("deal_source");
  const priorityOptions = usePicklist("deal_priority");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const { data } = await api.get("/staff/view/");

        if (Array.isArray(data)) {
          setStaff(data);
        } else if (Array.isArray(data.staff)) {
          setStaff(data.staff);
        } else {
          setStaff([]);
        }
      } catch (err) {
        console.error("Failed to fetch staff:", err);
        setStaff([]);
      }
    };

    fetchStaff();
  }, []);

  useEffect(() => {
    // "Related To" picker only applies to the standalone Add/Edit Deal flow.
    if (convertMode) return;

    getCustomers()
      .then((data) => setCustomers(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Failed to fetch customers:", err);
        setCustomers([]);
      });

    getAccounts()
      .then((data) => setAccounts(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Failed to fetch accounts:", err);
        setAccounts([]);
      });
  }, [convertMode]);

  // In conversion mode, pull the original lead's source/company as a fallback
  // prefill — parent-supplied `prefill` (from the Customer/Account step) still
  // wins for companyName if present.
  useEffect(() => {
    if (!open || !convertMode || !leadId) return;

    const loadLead = async () => {
      try {
        const lead = await getLead(leadId);
        setLeadPrefill({
          companyName: lead.companyName || "",
          source: lead.source || "",
        });
      } catch (err) {
        console.error("Failed to load lead for deal prefill:", err);
      }
    };

    loadLead();
  }, [open, convertMode, leadId]);

  const effectiveCompanyName = prefill?.companyName || leadPrefill?.companyName || "";
  const effectiveSource = leadPrefill?.source || "Website";

  const blankForm = useMemo(
    () => ({
      dealName: effectiveCompanyName ? `${effectiveCompanyName} Deal` : "",
      companyName: effectiveCompanyName,
      dealAmount: "",
      stage: "Proposal",
      assignedTo: "",
      expectedCloseDate: "",
      dealSource: effectiveSource,
      priority: "Medium",
      description: "",
      relatedType: "",
      relatedId: "",
    }),
    [effectiveCompanyName, effectiveSource]
  );

  const [form, setForm] = useState(blankForm);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        dealName: initialData.name || "",
        companyName: initialData.company_name || "",
        dealAmount: initialData.value || "",
        stage: initialData.stage || "Proposal",
        assignedTo: initialData.assignedToId || "",
        expectedCloseDate: initialData.expectedCloseDate || "",
        dealSource: initialData.source || "Website",
        priority: initialData.priority || "Medium",
        description: initialData.description || "",
        relatedType: initialData.relatedTo?.type || "",
        relatedId: initialData.relatedTo?.id ? String(initialData.relatedTo.id) : "",
      });
    } else {
      setForm(blankForm);
    }

    setTouched({});
  }, [initialData, blankForm]);

  // Re-seed on open so a fresh conversion attempt starts from the current prefill.
  useEffect(() => {
    if (open && convertMode && !initialData) {
      setForm(blankForm);
      setTouched({});
    }
  }, [open, convertMode, initialData, blankForm]);

  const errors = validateDeal(form, convertMode);
  const hasErrors = Object.keys(errors).length > 0;

  const setField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const closeAndReset = () => {
    if (loading) return;

    setForm(blankForm);
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
    related: true,
  });

  if (hasErrors) return;

  onSubmit({
    ...form,
    relatedType: form.relatedType,
    relatedId: form.relatedId ? String(form.relatedId) : "",
  });
};


  return (
    <Modal
      open={open}
      title={
        convertMode
          ? "Deal Details"
          : initialData
          ? "Edit Deal"
          : "Add New Deal"
      }
      subtitle={
        convertMode
          ? "Add the deal information to complete this conversion."
          : initialData
          ? "Update the deal details below"
          : "Fill in the details below to add a new deal to your pipeline"
      }
      onClose={closeAndReset}
      maxWidthClassName="max-w-3xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {!convertMode && (
          <div className="md:col-span-2">
            <label className="text-sm text-[#111827] font-medium">
              Related To <span className="text-red-500">*</span>
            </label>

            <div className="mt-2 flex gap-3">
              <select
                value={form.relatedType}
                onChange={(e) => {
                  setField("relatedType", e.target.value);
                  setField("relatedId", "");
                }}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, related: true }))
                }
                className="h-11 w-40 rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                <option value="">Select type</option>
                <option value="customer">Customer</option>
                <option value="account">Account</option>
              </select>

              {form.relatedType === "customer" && (
                <select
                  value={form.relatedId}
                  onChange={(e) => {
                    const id = e.target.value;
                    const customer = customers.find(
                      (c) => String(c.id) === id
                    );

                    setField("relatedId", id);

                    if (customer) {
                      setField(
                        "companyName",
                        customer.companyName || form.companyName
                      );
                    }
                  }}
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, related: true }))
                  }
                  className="h-11 flex-1 rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                >
                  <option value="">Select customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.contactName || c.name || c.contact_name || c.companyName}
                    </option>
                  ))}
                </select>
              )}

              {form.relatedType === "account" && (
                <select
                  value={form.relatedId}
                  onChange={(e) => {
                    const id = e.target.value;
                    const account = accounts.find(
                      (a) => String(a.id) === id
                    );

                    setField("relatedId", id);

                    if (account) {
                      setField(
                        "companyName",
                        account.account_name || form.companyName
                      );
                    }
                  }}
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, related: true }))
                  }
                  className="h-11 flex-1 rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                >
                  <option value="">Select account</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.account_name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {touched.related && errors.related && (
              <p className="text-xs text-red-600 mt-1">
                {errors.related}
              </p>
            )}
          </div>
        )}

        <div className="md:col-span-2">
          <label className="text-sm font-medium">
            Deal Name <span className="text-red-500">*</span>
          </label>

          <input
            value={form.dealName}
            onChange={(e) => setField("dealName", e.target.value)}
            onBlur={() =>
              setTouched((prev) => ({ ...prev, dealName: true }))
            }
            placeholder="Enter deal name"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm"
          />

          {touched.dealName && errors.dealName && (
            <p className="text-xs text-red-600 mt-1">
              {errors.dealName}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">
            Company Name <span className="text-red-500">*</span>
          </label>

          <input
            value={form.companyName}
            onChange={(e) => setField("companyName", e.target.value)}
            onBlur={() =>
              setTouched((prev) => ({ ...prev, companyName: true }))
            }
            placeholder="Enter company name"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm"
          />

          {touched.companyName && errors.companyName && (
            <p className="text-xs text-red-600 mt-1">
              {errors.companyName}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">
            Deal Amount <span className="text-red-500">*</span>
          </label>

          <input
            inputMode="decimal"
            value={form.dealAmount}
            onChange={(e) => setField("dealAmount", e.target.value)}
            onBlur={() =>
              setTouched((prev) => ({ ...prev, dealAmount: true }))
            }
            placeholder="$0.00"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm"
          />

          {touched.dealAmount && errors.dealAmount && (
            <p className="text-xs text-red-600 mt-1">
              {errors.dealAmount}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">
            Stage
          </label>

          <select
            value={form.stage}
            onChange={(e) => setField("stage", e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, stage: true }))}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm"
          >
            {stageOptions.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {touched.stage && errors.stage && (
            <p className="text-xs text-red-600 mt-1">
              {errors.stage}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">
            Assigned To
          </label>

          <select
            value={form.assignedTo}
            onChange={(e) => setField("assignedTo", e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm"
          >
            <option value="">Select team member</option>

            {Array.isArray(staff) &&
              staff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.full_name ||
                    member.fullName ||
                    member.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">
            Expected Close Date{" "}
            <span className="text-red-500">*</span>
          </label>

          <input
            type="date"
            value={form.expectedCloseDate}
            onChange={(e) =>
              setField("expectedCloseDate", e.target.value)
            }
            onBlur={() =>
              setTouched((prev) => ({ ...prev, expectedCloseDate: true }))
            }
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm"
          />

          {touched.expectedCloseDate && errors.expectedCloseDate && (
            <p className="text-xs text-red-600 mt-1">
              {errors.expectedCloseDate}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">
            Deal Source
          </label>

          <select
            value={form.dealSource}
            onChange={(e) => setField("dealSource", e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm"
          >
            {sourceOptions.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">
            Priority
          </label>

          <select
            value={form.priority}
            onChange={(e) => setField("priority", e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm"
          >
            {priorityOptions.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">
            Deal Description
          </label>

          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Enter description..."
            className="mt-2 w-full min-h-[120px] rounded-xl border border-[#E5E7EB] p-4 text-sm resize-none"
          />
        </div>

      </div>

      <div className="mt-6 flex justify-end gap-3">

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="h-11 px-5 rounded-xl border border-[#E5E7EB] mr-auto"
          >
            Back
          </button>
        )}

        <button
          type="button"
          onClick={closeAndReset}
          disabled={loading}
          className="h-11 px-5 rounded-xl border border-[#E5E7EB]"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          {loading && <Spinner size={16} className="text-white" />}
          Save Deal
        </button>

      </div>

    </Modal>
  );
}