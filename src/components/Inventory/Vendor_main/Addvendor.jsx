import { useEffect, useState } from "react";
import { getVendor, createVendor, updateVendor } from "../../../api/vendor";

const inputClass =
  "w-full h-11 px-3 rounded-xl border border-[#E5E7EB] text-[#111827] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400";

const labelClass = "block text-sm font-medium text-[#374151] mb-1";

const emptyForm = {
  vendorName: "",
  vendorCode: "",
  contactPerson: "",
  email: "",
  phone: "",
  mobile: "",
  website: "",
  gstNumber: "",
  status: "active",
  notes: "",
  address: {
    country: "",
    address: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
  },
};

export default function AddVendor({ vendorId, onCancel, onSaved }) {
  const isEditMode = Boolean(vendorId);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) return;

    const fetchVendor = async () => {
      setLoading(true);
      setError("");
      try {
        const v = await getVendor(vendorId);
        setForm({
          vendorName: v.vendorName || "",
          vendorCode: v.vendorCode || "",
          contactPerson: v.contactPerson || "",
          email: v.email || "",
          phone: v.phone || "",
          mobile: v.mobile || "",
          website: v.website || "",
          gstNumber: v.gstNumber || "",
          status: v.status || "active",
          notes: v.notes || "",
          address: {
            country: v.address?.country || "",
            address: v.address?.address || "",
            streetAddress: v.address?.streetAddress || "",
            city: v.address?.city || "",
            state: v.address?.state || "",
            zipCode: v.address?.zipCode || "",
          },
        });
      } catch (err) {
        console.error("FETCH VENDOR ERROR:", err);
        setError("Could not load this vendor. Please go back and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [vendorId, isEditMode]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAddressChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: e.target.value },
    }));
  };

  const buildPayload = () => ({
    vendor_name: form.vendorName,
    vendor_code: form.vendorCode,
    contact_person: form.contactPerson,
    email: form.email,
    phone: form.phone,
    mobile: form.mobile,
    website: form.website,
    gst_number: form.gstNumber,
    status: form.status,
    notes: form.notes,
    address: {
      country: form.address.country,
      address: form.address.address,
      street_add: form.address.streetAddress,
      city: form.address.city,
      state: form.address.state,
      zip_code: form.address.zipCode,
    },
  });

  const handleSave = async () => {
    setError("");

    if (!form.vendorName.trim() || !form.vendorCode.trim()) {
      setError("Vendor name and vendor code are required.");
      return;
    }

    setSaving(true);
    try {
      const payload = buildPayload();
      if (isEditMode) {
        await updateVendor(vendorId, payload);
      } else {
        await createVendor(payload);
      }
      onSaved?.();
    } catch (err) {
      console.error("SAVE VENDOR ERROR:", err);
      const message =
        typeof err?.response?.data === "string"
          ? err.response.data
          : "Something went wrong while saving the vendor.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-[#6B7280]">Loading vendor details...</div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">
          {isEditMode ? "Edit Vendor" : "Add Vendor"}
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
            {saving ? "Saving..." : "Save Vendor"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Vendor Information */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#111827] mb-5">
          Vendor Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <label className={labelClass}>Vendor Name *</label>
            <input
              type="text"
              className={inputClass}
              value={form.vendorName}
              onChange={handleChange("vendorName")}
            />
          </div>
          <div>
            <label className={labelClass}>Vendor Code *</label>
            <input
              type="text"
              className={inputClass}
              value={form.vendorCode}
              onChange={handleChange("vendorCode")}
            />
          </div>

          <div>
            <label className={labelClass}>Contact Person</label>
            <input
              type="text"
              className={inputClass}
              value={form.contactPerson}
              onChange={handleChange("contactPerson")}
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={handleChange("email")}
            />
          </div>

          <div>
            <label className={labelClass}>Phone</label>
            <input
              type="text"
              className={inputClass}
              value={form.phone}
              onChange={handleChange("phone")}
            />
          </div>
          <div>
            <label className={labelClass}>Mobile</label>
            <input
              type="text"
              className={inputClass}
              value={form.mobile}
              onChange={handleChange("mobile")}
            />
          </div>

          <div>
            <label className={labelClass}>Website</label>
            <input
              type="text"
              className={inputClass}
              value={form.website}
              onChange={handleChange("website")}
            />
          </div>
          <div>
            <label className={labelClass}>GST Number</label>
            <input
              type="text"
              className={inputClass}
              value={form.gstNumber}
              onChange={handleChange("gstNumber")}
            />
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
          <label className={labelClass}>Notes</label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            value={form.notes}
            onChange={handleChange("notes")}
          />
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-lg font-semibold text-[#111827] mb-5">
          Address Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <label className={labelClass}>Country / Region</label>
            <input
              type="text"
              className={inputClass}
              value={form.address.country}
              onChange={handleAddressChange("country")}
            />
          </div>
          <div>
            <label className={labelClass}>
              Flat / House No. / Building / Apartment Name
            </label>
            <input
              type="text"
              className={inputClass}
              value={form.address.address}
              onChange={handleAddressChange("address")}
            />
          </div>

          <div>
            <label className={labelClass}>Street Address</label>
            <input
              type="text"
              className={inputClass}
              value={form.address.streetAddress}
              onChange={handleAddressChange("streetAddress")}
            />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              className={inputClass}
              value={form.address.city}
              onChange={handleAddressChange("city")}
            />
          </div>

          <div>
            <label className={labelClass}>State / Province</label>
            <input
              type="text"
              className={inputClass}
              value={form.address.state}
              onChange={handleAddressChange("state")}
            />
          </div>
          <div>
            <label className={labelClass}>Zip / Postal Code</label>
            <input
              type="text"
              className={inputClass}
              value={form.address.zipCode}
              onChange={handleAddressChange("zipCode")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}