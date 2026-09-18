import { useEffect, useMemo, useState } from "react";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";
import { usePicklist } from "../../hooks/usePicklist";
import { getProducts } from "../../api/products";
import { getServices } from "../../api/service";

const defaultCountryCodes = ["+91", "+1", "+44", "+65", "+971"];

function parsePhoneNumber(rawPhone) {
  if (!rawPhone) return { countryCode: "+91", phoneNumber: "" };
  let str = String(rawPhone).trim();
  let matchedCode = "+91";

  for (const code of defaultCountryCodes) {
    if (str.startsWith(code)) {
      matchedCode = code;
      break;
    }
  }

  // Strip any duplicate country codes from the phone number
  for (const code of defaultCountryCodes) {
    const regex = new RegExp(`^(\\${code}\\s*)+`, "i");
    str = str.replace(regex, "");
  }

  return {
    countryCode: matchedCode,
    phoneNumber: str.trim(),
  };
}

function validateLead(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = "Full name is required";
  if (!form.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
  return errors;
}

export default function LeadFormModal({
  open,
  onClose,
  onSubmit,
  loading = false,
  initialData = null,
  staff = [],
}) {
  const sourceOptions = usePicklist("lead_source");
  const priorityOptions = usePicklist("lead_priority");
  const statusOptions = usePicklist("lead_status");

  // Products and services for enquiry dropdowns
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setListLoading(true);
    Promise.all([getProducts(), getServices()])
      .then(([prods, servs]) => {
        if (cancelled) return;
        setProducts(Array.isArray(prods) ? prods : []);
        setServices(Array.isArray(servs) ? servs : []);
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn("Could not load products/services for enquiry:", err?.message);
      })
      .finally(() => {
        if (!cancelled) setListLoading(false);
      });
    return () => { cancelled = true; };
  }, [open]);

  const blankForm = useMemo(
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
      status: "new",
      enquiryType: "not_specified",
      productId: "",
      serviceId: "",
    }),
    [],
  );

  const [form, setForm] = useState(blankForm);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      const { countryCode, phoneNumber } = parsePhoneNumber(
        initialData.phone || initialData.phoneNumber || initialData.phone_number || ""
      );

      // Resolve product/service ids from nested objects if present
      const enquiryType =
        initialData.enquiry_type ||
        initialData.enquiryType ||
        "not_specified";

      const productId =
        initialData.product_id ||
        initialData.productId ||
        (initialData.product && initialData.product.id ? String(initialData.product.id) : "") ||
        "";

      const serviceId =
        initialData.service_id ||
        initialData.serviceId ||
        (initialData.service && initialData.service.id ? String(initialData.service.id) : "") ||
        "";

      setForm({
        fullName: initialData.name || initialData.fullName || initialData.full_name || "",
        countryCode,
        phoneNumber,
        email: initialData.email || "",
        companyName: initialData.companyName || initialData.company_name || "",
        leadSource: initialData.source || initialData.leadSource || initialData.lead_source || "Website",
        assignedTo: initialData.assignedToId || initialData.assignedTo || initialData.assigned_to || "",
        priority: initialData.priority || "Medium",
        expectedClosingDate: initialData.expectedClosingDate || initialData.expected_closing_date || "",
        description: initialData.description || initialData.leadDescription || initialData.lead_description || "",
        status: (initialData.status || "new").toLowerCase(),
        enquiryType,
        productId: String(productId),
        serviceId: String(serviceId),
      });
    } else {
      setForm(blankForm);
    }
    setTouched({});
  }, [initialData, blankForm]);

  const errors = validateLead(form);
  const hasErrors = Object.keys(errors).length > 0;

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  // Handle enquiry type change with clearing logic
  const handleEnquiryTypeChange = (newType) => {
    setForm((prev) => ({
      ...prev,
      enquiryType: newType,
      productId: newType !== "product" ? "" : prev.productId,
      serviceId: newType !== "service" ? "" : prev.serviceId,
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

  const inputClass = "mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100";
  const selectClass = "mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100";
  const labelClass = "text-sm text-[#111827] font-medium";

  return (
    <Modal
      open={open}
      title={initialData ? "Edit Lead" : "Add New Lead"}
      subtitle={
        initialData
          ? "Update the lead details below"
          : "Fill in the details below to add a new lead to your CRM"
      }
      onClose={closeAndReset}
      maxWidthClassName="max-w-3xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className={labelClass}>
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            value={form.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, fullName: true }))}
            placeholder="Enter full name"
            className={inputClass}
          />
          {touched.fullName && errors.fullName && (
            <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>
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
          <label className={labelClass}>Email</label>
          <input
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="Enter email address"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Company Name
          </label>
          <input
            value={form.companyName}
            onChange={(e) => setField("companyName", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, companyName: true }))}
            placeholder="Enter company name"
            className={inputClass}
          />
          {touched.companyName && errors.companyName && (
            <p className="text-xs text-red-600 mt-1">{errors.companyName}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Lead Source
          </label>
          <select
            value={form.leadSource}
            onChange={(e) => setField("leadSource", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, leadSource: true }))}
            className={selectClass}
          >
            <option value="">Select Lead Source</option>

            {sourceOptions.map((o) => (
              <option key={o.id} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {touched.leadSource && errors.leadSource && (
            <p className="text-xs text-red-600 mt-1">{errors.leadSource}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Assigned To</label>
          <select
            value={form.assignedTo}
            onChange={(e) => setField("assignedTo", e.target.value)}
            className={selectClass}
          >
            <option value="">Select team member</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>
            Priority
          </label>
          <select
            value={form.priority}
            onChange={(e) => setField("priority", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, priority: true }))}
            className={selectClass}
          >
            <option value="">Select Priority</option>

            {priorityOptions.map((o) => (
              <option key={o.id} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {touched.priority && errors.priority && (
            <p className="text-xs text-red-600 mt-1">{errors.priority}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Expected Closing Date</label>
          <input
            type="date"
            value={form.expectedClosingDate}
            onChange={(e) => setField("expectedClosingDate", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select
            value={form.status}
            onChange={(e) => setField("status", e.target.value)}
            className={selectClass}
          >
            <option value="">Select Status</option>

            {statusOptions.map((o) => (
              <option key={o.id} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* ── Enquiry For ────────────────────────────────────── */}
        <div>
          <label className={labelClass}>Enquiry For</label>
          <select
            value={form.enquiryType}
            onChange={(e) => handleEnquiryTypeChange(e.target.value)}
            className={selectClass}
          >
            <option value="not_specified">Not Specified</option>
            <option value="product">Product</option>
            <option value="service">Service</option>
          </select>
        </div>

        {/* ── Product dropdown (only when enquiryType === "product") ── */}
        {form.enquiryType === "product" && (
          <div>
            <label className={labelClass}>
              Product
              {listLoading && (
                <span className="ml-2 text-xs text-[#9CA3AF] font-normal">Loading…</span>
              )}
            </label>
            <select
              value={form.productId}
              onChange={(e) => setField("productId", e.target.value)}
              disabled={listLoading}
              className={selectClass}
            >
              <option value="">Select Product (optional)</option>
              {products.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ── Service dropdown (only when enquiryType === "service") ── */}
        {form.enquiryType === "service" && (
          <div>
            <label className={labelClass}>
              Service
              {listLoading && (
                <span className="ml-2 text-xs text-[#9CA3AF] font-normal">Loading…</span>
              )}
            </label>
            <select
              value={form.serviceId}
              onChange={(e) => setField("serviceId", e.target.value)}
              disabled={listLoading}
              className={selectClass}
            >
              <option value="">Select Service (optional)</option>
              {services.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Spacer to keep the grid balanced when only one of product/service is shown */}
        {(form.enquiryType === "product" || form.enquiryType === "service") && (
          <div className="hidden md:block" />
        )}

        <div className="md:col-span-2">
          <label className={labelClass}>Lead Description</label>
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
