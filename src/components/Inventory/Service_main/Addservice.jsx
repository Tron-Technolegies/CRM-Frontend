import { useEffect, useState } from "react";
import { getService, createService, updateService } from "../../../api/service";

const inputClass =
  "w-full h-11 px-3 rounded-xl border border-[#E5E7EB] text-[#111827] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400";

const labelClass = "block text-sm font-medium text-[#374151] mb-1";

const emptyForm = {
  serviceName: "",
  serviceCode: "",
  category: "",
  description: "",
  unitPrice: "",
  taxPercentage: "0",
  billingType: "fixed",
  duration: "",
  status: "active",
};

export default function AddService({ serviceId, onCancel, onSaved }) {
  const isEditMode = Boolean(serviceId);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) return;

    const fetchService = async () => {
      setLoading(true);
      setError("");
      try {
        const s = await getService(serviceId);
        setForm({
          serviceName: s.serviceName || "",
          serviceCode: s.serviceCode || "",
          category: s.category || "",
          description: s.description || "",
          unitPrice: s.unitPrice ?? "",
          taxPercentage: s.taxPercentage ?? "0",
          billingType: s.billingType || "fixed",
          duration: s.duration || "",
          status: s.status || "active",
        });
      } catch (err) {
        console.error("FETCH SERVICE ERROR:", err);
        setError("Could not load this service. Please go back and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId, isEditMode]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const buildPayload = () => ({
    service_name: form.serviceName,
    service_code: form.serviceCode,
    category: form.category,
    description: form.description,
    unit_price: form.unitPrice,
    tax_percentage: form.taxPercentage,
    billing_type: form.billingType,
    duration: form.duration,
    status: form.status,
  });

  const handleSave = async () => {
    setError("");

    if (!form.serviceName.trim() || !form.serviceCode.trim() || !form.unitPrice) {
      setError("Service name, service code and unit price are required.");
      return;
    }

    setSaving(true);
    try {
      const payload = buildPayload();
      if (isEditMode) {
        await updateService(serviceId, payload);
      } else {
        await createService(payload);
      }
      onSaved?.();
    } catch (err) {
      console.error("SAVE SERVICE ERROR:", err);
      const message =
        typeof err?.response?.data === "string"
          ? err.response.data
          : "Something went wrong while saving the service.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-[#6B7280]">Loading service details...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">
          {isEditMode ? "Edit Service" : "Add Service"}
        </h1>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 h-11 rounded-xl border border-[#E5E7EB] text-[#111827] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Service"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Service Information */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-lg font-semibold text-[#111827] mb-5">
          Service Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <label className={labelClass}>Service Name *</label>
            <input
              type="text"
              className={inputClass}
              value={form.serviceName}
              onChange={handleChange("serviceName")}
            />
          </div>
          <div>
            <label className={labelClass}>Service Code *</label>
            <input
              type="text"
              className={inputClass}
              value={form.serviceCode}
              onChange={handleChange("serviceCode")}
            />
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <input
              type="text"
              className={inputClass}
              value={form.category}
              onChange={handleChange("category")}
            />
          </div>
          <div>
            <label className={labelClass}>Duration</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. 2 Hours, 30 Days, 1 Month"
              value={form.duration}
              onChange={handleChange("duration")}
            />
          </div>

          <div>
            <label className={labelClass}>Unit Price *</label>
            <input
              type="number"
              step="0.01"
              className={inputClass}
              value={form.unitPrice}
              onChange={handleChange("unitPrice")}
            />
          </div>
          <div>
            <label className={labelClass}>Tax Percentage</label>
            <input
              type="number"
              step="0.01"
              className={inputClass}
              value={form.taxPercentage}
              onChange={handleChange("taxPercentage")}
            />
          </div>

          <div>
            <label className={labelClass}>Billing Type</label>
            <select
              className={inputClass}
              value={form.billingType}
              onChange={handleChange("billingType")}
            >
              <option value="fixed">Fixed Price</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              className={inputClass}
              value={form.status}
              onChange={handleChange("status")}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className={labelClass}>Description</label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            value={form.description}
            onChange={handleChange("description")}
          />
        </div>
      </div>
    </div>
  );
}