import { useEffect, useMemo, useState } from "react";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";
import { usePicklist } from "../../hooks/usePicklist";
import { getLeads, getLeadToCustomerPrefill } from "../../api/lead";


function validateCustomer(form) {
  const errors = {};
  if (!form.companyName.trim()) errors.companyName = "Company name is required";
  if (!form.contactName.trim()) errors.contactName = "Contact name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  if (!form.phone.trim()) errors.phone = "Phone is required";
  if (!form.industry) errors.industry = "Industry is required";
  if (!form.status) errors.status = "Status is required";
  const value = Number(form.lifetimeValue);
  if (!form.lifetimeValue || Number.isNaN(value) || value < 0) errors.lifetimeValue = "Valid lifetime value is required";
  return errors;
}

export default function CustomerFormModal({
    open,
    onClose,
    onSubmit,
    loading = false,
    initialData = null,

    leadId = null,
    convertMode = false,
    onContinue = null,
  }){
  const industryOptions = usePicklist("customer_industry");
  const statusOptions = usePicklist("customer_status");

  const blankForm = useMemo(() => ({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    industry: "Technology",
    status: "Active",
    lifetimeValue: "",
    dealId: "",
    leadId: "",
  }), []);

  const [form, setForm] = useState(blankForm);
  const [touched, setTouched] = useState({});
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    if (!open || convertMode || initialData) return;

    getLeads()
      .then(setLeads)
      .catch(console.error);
  }, [open, convertMode, initialData]);


  useEffect(() => {
    if (initialData) {
      setForm({
        companyName: initialData.companyName || "",
        contactName: initialData.contactName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        industry: initialData.industry || "Technology",
        status: initialData.status || "Active",
        lifetimeValue: initialData.lifetimeValue || "",
        dealId: "",
        leadId: "",
      });
    } else {
      setForm(blankForm);
    }
    setTouched({});
  }, [initialData, blankForm]);

  useEffect(() => {
    if (!open || !convertMode || !leadId) return;

    const loadLead = async () => {
      try {
        const data = await getLeadToCustomerPrefill(leadId);

        setForm({
          companyName: data.company_name || "",
          contactName: data.contact_name || "",
          email: data.email || "",
          phone: data.phone_number || "",
          industry: data.industry || "Technology",
          status: "Active",
          lifetimeValue: "",
          dealId: "",
          leadId: "",
        });

      } catch (err) {
        console.error(err);
      }
    };

    loadLead();
  }, [open, convertMode, leadId]);

  const errors = validateCustomer(form);
  const hasErrors = Object.keys(errors).length > 0;

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const closeAndReset = () => {
    if (loading) return;
    setForm(blankForm);
    setTouched({});
    onClose();
  };

  const submit = () => {
    setTouched({
      companyName: true,
      contactName: true,
      email: true,
      phone: true,
      industry: true,
      status: true,
      lifetimeValue: true,
    });

    if (hasErrors) return;

    if (convertMode) {
      onContinue(form);
    } else {
      onSubmit(form);
    }
  };

  return (
    <Modal
      open={open}
      title={
          convertMode
              ? "Convert Lead to Customer"
              : initialData
              ? "Edit Customer"
              : "Add New Customer"
      }
      subtitle={
          convertMode
              ? "Review the customer information before continuing."
              : initialData
              ? "Update the customer details below"
              : "Fill in the details below to add a new customer to your CRM"
      }
      onClose={closeAndReset}
      maxWidthClassName="max-w-3xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {!initialData && !convertMode && (
          <div className="md:col-span-2">
            <label className="text-sm text-[#111827] font-medium">
              Link to Lead <span className="text-[#64748B] font-normal">(optional)</span>
            </label>
            <select
                value={form.leadId}
                onChange={(e)=>{
                    const lead = leads.find(
                        l => l.id === Number(e.target.value)
                    );

                    setField("leadId", e.target.value);

                    if(lead){
                        setField("companyName", lead.companyName || "");
                        setField("contactName", lead.name || "");
                        setField("phone", lead.phone || "");
                        setField("email", lead.email || "");
                    }
                }}
                className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
            >
                <option value="">No Lead</option>

                {leads.map(lead=>(
                    <option key={lead.id} value={lead.id}>
                        {lead.name} — {lead.companyName}
                    </option>
                ))}
            </select>
          </div>
        )}

        <div>
          <label className="text-sm text-[#111827] font-medium">Company Name <span className="text-red-500">*</span></label>
          <input
            value={form.companyName}
            onChange={(e) => setField("companyName", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, companyName: true }))}
            placeholder="e.g. ABC Solutions"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 cursor-text"
          />
          {touched.companyName && errors.companyName && <p className="text-xs text-red-600 mt-1">{errors.companyName}</p>}
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">Contact Name <span className="text-red-500">*</span></label>
          <input
            value={form.contactName}
            onChange={(e) => setField("contactName", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, contactName: true }))}
            placeholder="e.g. John Smith"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 cursor-text"
          />
          {touched.contactName && errors.contactName && <p className="text-xs text-red-600 mt-1">{errors.contactName}</p>}
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">Email <span className="text-red-500">*</span></label>
          <input
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, email: true }))}
            placeholder="john@abcsolutions.com"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 cursor-text"
          />
          {touched.email && errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">Phone <span className="text-red-500">*</span></label>
          <input
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
            placeholder="+1 555-123-4567"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 cursor-text"
          />
          {touched.phone && errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">Industry <span className="text-red-500">*</span></label>
          <select
            value={form.industry}
            onChange={(e) => setField("industry", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, industry: true }))}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            {industryOptions.map((o) => <option key={o.id} value={o.value}>{o.label}</option>)}
          </select>
          {touched.industry && errors.industry && <p className="text-xs text-red-600 mt-1">{errors.industry}</p>}
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">Status <span className="text-red-500">*</span></label>
          <select
            value={form.status}
            onChange={(e) => setField("status", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, status: true }))}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            {statusOptions.map((o) => <option key={o.id} value={o.value}>{o.label}</option>)}
          </select>
          {touched.status && errors.status && <p className="text-xs text-red-600 mt-1">{errors.status}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-[#111827] font-medium">Lifetime Value <span className="text-red-500">*</span></label>
          <input
            inputMode="decimal"
            value={form.lifetimeValue}
            onChange={(e) => setField("lifetimeValue", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, lifetimeValue: true }))}
            placeholder="$ 45000.00"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 cursor-text"
          />
          {touched.lifetimeValue && errors.lifetimeValue && <p className="text-xs text-red-600 mt-1">{errors.lifetimeValue}</p>}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-[#EEF2F7] flex items-center justify-end gap-3">
        <button type="button" onClick={closeAndReset} disabled={loading} className="h-11 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] disabled:opacity-60 cursor-pointer">
          Cancel
        </button>
        <button type="button" onClick={submit} disabled={loading} className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2 disabled:opacity-60 cursor-pointer">
          {loading && <Spinner size={16} className="text-white" />}
          {convertMode
            ? "Save & Continue"
            : initialData
            ? "Save Changes"
            : "Add Customer"}
        </button>
      </div>
    </Modal>
  );
}