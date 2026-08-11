import { useEffect, useMemo, useState } from "react";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";
import { getLead } from "../../api/lead";

function validateAccount(form) {
  const errors = {};
  if (!form.accountName.trim()) errors.accountName = "Account name is required";
  if (!form.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
  return errors;
}

function AddressFields({ title, value, onChange }) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] p-4">
      <h3 className="text-sm font-semibold text-[#111827]">{title}</h3>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-[#111827] font-medium">Country</label>
          <input
            value={value.country}
            onChange={(e) => onChange("country", e.target.value)}
            placeholder="Country"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="text-sm text-[#111827] font-medium">Address</label>
          <input
            value={value.address}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Address"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-[#111827] font-medium">Street Address</label>
          <input
            value={value.streetAdd}
            onChange={(e) => onChange("streetAdd", e.target.value)}
            placeholder="Street address"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="text-sm text-[#111827] font-medium">City</label>
          <input
            value={value.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="City"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="text-sm text-[#111827] font-medium">State</label>
          <input
            value={value.state}
            onChange={(e) => onChange("state", e.target.value)}
            placeholder="State"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="text-sm text-[#111827] font-medium">Zip Code</label>
          <input
            value={value.zipCode}
            onChange={(e) => onChange("zipCode", e.target.value)}
            placeholder="Zip code"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
    </div>
  );
}

export default function AccountFormModal({
  open,
  onClose,
  onSubmit,
  loading = false,
  initialData = null,
  staff = [],
  accounts = [],

  // Conversion-mode props (mirrors CustomerFormModal)
  leadId = null,
  convertMode = false,
  onContinue = null,
}) {
  const blankForm = useMemo(
    () => ({
      accountName: "",
      assignedTo: "",
      phoneNumber: "",
      accountSite: "",
      parentAccount: "",
      website: "",
      accountType: "",
      industry: "",
      ownership: "",
      employees: "",
      billingAddress: {
        country: "", address: "", streetAdd: "", city: "", state: "", zipCode: "",
      },
      shippingAddress: {
        country: "", address: "", streetAdd: "", city: "", state: "", zipCode: "",
      },
    }),
    [],
  );

  const [form, setForm] = useState(blankForm);
  const [touched, setTouched] = useState({});
  const [prefillError, setPrefillError] = useState(null);

  useEffect(() => {
    if (convertMode) return; // convert-mode prefill is handled separately below

    if (initialData) {
      setForm({
        accountName: initialData.account_name || "",
        assignedTo: initialData.assigned_to || "",
        phoneNumber: initialData.phone_number || "",
        accountSite: initialData.account_site || "",
        parentAccount: initialData.parent_account || "",
        website: initialData.website || "",
        accountType: initialData.account_type || "",
        industry: initialData.industry || "",
        ownership: initialData.ownership || "",
        employees: initialData.employees || "",
        billingAddress: {
          country: initialData.billing_address?.country || "",
          address: initialData.billing_address?.address || "",
          streetAdd: initialData.billing_address?.street_address || "",
          city: initialData.billing_address?.city || "",
          state: initialData.billing_address?.state || "",
          zipCode: initialData.billing_address?.zip_code || "",
        },
        shippingAddress: {
          country: initialData.shipping_address?.country || "",
          address: initialData.shipping_address?.address || "",
          streetAdd: initialData.shipping_address?.street_address || "",
          city: initialData.shipping_address?.city || "",
          state: initialData.shipping_address?.state || "",
          zipCode: initialData.shipping_address?.zip_code || "",
        },
      });
    } else {
      setForm(blankForm);
    }
    setTouched({});
  }, [initialData, blankForm, convertMode]);

  // Prefill from the lead when converting. There's no dedicated
  // lead->account prefill endpoint on the backend, so this reuses
  // getLead (same one LeadViewModal uses) and maps what overlaps —
  // a Lead record has no industry/website, so those stay blank.
  useEffect(() => {
    if (!open || !convertMode || !leadId) return;

    setPrefillError(null);

    const loadLead = async () => {
      try {
        const lead = await getLead(leadId);

        setForm({
          ...blankForm,
          accountName: lead.companyName || "",
          phoneNumber: lead.phone || "",
        });
      } catch (err) {
        console.error(err);
        setPrefillError("Couldn't load lead details to prefill this form.");
      }
    };

    loadLead();
  }, [open, convertMode, leadId, blankForm]);

  const errors = validateAccount(form);
  const hasErrors = Object.keys(errors).length > 0;

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const setAddressField = (group, key, value) =>
    setForm((prev) => ({
      ...prev,
      [group]: { ...prev[group], [key]: value },
    }));

  const closeAndReset = () => {
    if (loading) return;
    setForm(blankForm);
    setTouched({});
    onClose();
  };

  const submit = () => {
    setTouched({ accountName: true, phoneNumber: true });

    if (hasErrors) return;

    // NOTE: the add/update backend views (add_account / update_account) read
    // these specific request keys — acc_name, phone, acc_site, parent_acc,
    // acc_type, billing_add / shipping_add with street_add — which differ
    // from the field names the view/list endpoints return (account_name,
    // phone_number, street_address, zip_code, etc, read back above in the
    // initialData effect). Sending the "read" shape here was causing the
    // backend's account_name/phone_number lookup to always come back
    // undefined -> 400 "mandatory fields" error on every submit.
    const payload = {
      acc_name: form.accountName,
      assigned_to: form.assignedTo || null,
      phone: form.phoneNumber,
      acc_site: form.accountSite,
      parent_acc: form.parentAccount || null,
      website: form.website,
      acc_type: form.accountType,
      industry: form.industry,
      ownership: form.ownership,
      employees: form.employees,
      billing_add: {
        country: form.billingAddress.country,
        address: form.billingAddress.address,
        street_add: form.billingAddress.streetAdd,
        city: form.billingAddress.city,
        state: form.billingAddress.state,
        zip_code: form.billingAddress.zipCode,
      },
      shipping_add: {
        country: form.shippingAddress.country,
        address: form.shippingAddress.address,
        street_add: form.shippingAddress.streetAdd,
        city: form.shippingAddress.city,
        state: form.shippingAddress.state,
        zip_code: form.shippingAddress.zipCode,
      },
    };

    if (convertMode) {
      onContinue(payload);
      return;
    }

    if (initialData) {
      onSubmit(initialData.id, payload);
    } else {
      onSubmit(payload);
    }
  };

  const accountOptions = accounts.filter(
    (account) => String(account.id) !== String(initialData?.id),
  );

  return (
    <Modal
      open={open}
      title={
        convertMode
          ? "Convert Lead to Account"
          : initialData
          ? "Edit Account"
          : "Add New Account"
      }
      subtitle={
        convertMode
          ? "Review the account information before continuing."
          : initialData
          ? "Update the account details below"
          : "Fill in the details below to add a new account to your CRM"
      }
      onClose={closeAndReset}
      maxWidthClassName="max-w-5xl"
    >
      <div className="space-y-5">
        {convertMode && prefillError && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-sm">
            {prefillError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="text-sm text-[#111827] font-medium">
              Account Name <span className="text-red-500">*</span>
            </label>
            <input
              value={form.accountName}
              onChange={(e) => setField("accountName", e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, accountName: true }))}
              placeholder="Enter account name"
              className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
            {touched.accountName && errors.accountName && (
              <p className="text-xs text-red-600 mt-1">{errors.accountName}</p>
            )}
          </div>

          {!convertMode && (
            <div>
              <label className="text-sm text-[#111827] font-medium">Assigned To</label>
              <select
                value={form.assignedTo}
                onChange={(e) => setField("assignedTo", e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select team member</option>
                {staff.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.fullName || member.name || `Staff #${member.id}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-sm text-[#111827] font-medium">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              value={form.phoneNumber}
              onChange={(e) => setField("phoneNumber", e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, phoneNumber: true }))}
              placeholder="Enter phone number"
              className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <p className="text-xs text-red-600 mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-[#111827] font-medium">Account Site</label>
            <input
              value={form.accountSite}
              onChange={(e) => setField("accountSite", e.target.value)}
              placeholder="Enter account site"
              className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {!convertMode && (
            <div>
              <label className="text-sm text-[#111827] font-medium">Parent Account</label>
              <select
                value={form.parentAccount}
                onChange={(e) => setField("parentAccount", e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="">No parent account</option>
                {accountOptions.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.account_name || `Account #${account.id}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-sm text-[#111827] font-medium">Website</label>
            <input
              value={form.website}
              onChange={(e) => setField("website", e.target.value)}
              placeholder="https://example.com"
              className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-sm text-[#111827] font-medium">Account Type</label>
            <input
              value={form.accountType}
              onChange={(e) => setField("accountType", e.target.value)}
              placeholder="Enter account type"
              className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-sm text-[#111827] font-medium">Industry</label>
            <input
              value={form.industry}
              onChange={(e) => setField("industry", e.target.value)}
              placeholder="Enter industry"
              className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-sm text-[#111827] font-medium">Ownership</label>
            <input
              value={form.ownership}
              onChange={(e) => setField("ownership", e.target.value)}
              placeholder="Enter ownership"
              className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-sm text-[#111827] font-medium">Employees</label>
            <input
              value={form.employees}
              onChange={(e) => setField("employees", e.target.value)}
              placeholder="Enter employee count"
              className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <AddressFields
            title="Billing Address"
            value={form.billingAddress}
            onChange={(key, value) => setAddressField("billingAddress", key, value)}
          />
          <AddressFields
            title="Shipping Address"
            value={form.shippingAddress}
            onChange={(key, value) => setAddressField("shippingAddress", key, value)}
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
          {convertMode ? "Save & Continue" : initialData ? "Save Changes" : "Save Account"}
        </button>
      </div>
    </Modal>
  );
}