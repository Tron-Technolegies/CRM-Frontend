import { useEffect, useState } from "react";
import { getProduct, createProduct, updateProduct } from "../../../api/products";
import useVendor from "../../../hooks/useVendor";

const inputClass =
  "w-full h-11 px-3 rounded-xl border border-[#E5E7EB] text-[#111827] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400";

const labelClass = "block text-sm font-medium text-[#374151] mb-1";

const emptyForm = {
  name: "",
  productCode: "",
  sku: "",
  productType: "goods",
  category: "",
  manufacturer: "",
  vendorId: "",
  unitPrice: "",
  costPrice: "0",
  taxPercentage: "0",
  quantityInStock: "0",
  reorderLevel: "0",
  unit: "Nos",
  description: "",
  status: "active",
};

export default function AddProduct({ productId, onCancel, onSaved }) {
  const isEditMode = Boolean(productId);

  const { vendors, loading: vendorsLoading } = useVendor();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const p = await getProduct(productId);
        setForm({
          name: p.name || "",
          productCode: p.productCode || "",
          sku: p.sku || "",
          productType: p.productType || "goods",
          category: p.category || "",
          manufacturer: p.manufacturer || "",
          vendorId: p.vendorId || "",
          unitPrice: p.unitPrice ?? "",
          costPrice: p.costPrice ?? "0",
          taxPercentage: p.taxPercentage ?? "0",
          quantityInStock: p.quantityInStock ?? "0",
          reorderLevel: p.reorderLevel ?? "0",
          unit: p.unit || "Nos",
          description: p.description || "",
          status: p.status || "active",
        });
      } catch (err) {
        console.error("FETCH PRODUCT ERROR:", err);
        setError("Could not load this product. Please go back and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, isEditMode]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const buildPayload = () => ({
    name: form.name,
    product_code: form.productCode,
    sku: form.sku,
    product_type: form.productType,
    category: form.category,
    manufacturer: form.manufacturer,
    vendor_id: form.vendorId,
    unit_price: form.unitPrice,
    cost_price: form.costPrice,
    tax_percentage: form.taxPercentage,
    quantity_in_stock: form.quantityInStock,
    reorder_level: form.reorderLevel,
    unit: form.unit,
    description: form.description,
    status: form.status,
  });

  const handleSave = async () => {
    setError("");

    if (!form.name.trim() || !form.productCode.trim() || !form.sku.trim() || !form.unitPrice) {
      setError("Product name, product code, SKU and unit price are required.");
      return;
    }

    setSaving(true);
    try {
      const payload = buildPayload();
      if (isEditMode) {
        await updateProduct(productId, payload);
      } else {
        await createProduct(payload);
      }
      onSaved?.();
    } catch (err) {
      console.error("SAVE PRODUCT ERROR:", err);
      const message =
        typeof err?.response?.data === "string"
          ? err.response.data
          : "Something went wrong while saving the product.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-[#6B7280]">Loading product details...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">
          {isEditMode ? "Edit Product" : "Add Product"}
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
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Product Information */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#111827] mb-5">
          Product Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <label className={labelClass}>Product Name *</label>
            <input
              type="text"
              className={inputClass}
              value={form.name}
              onChange={handleChange("name")}
            />
          </div>
          <div>
            <label className={labelClass}>Product Code *</label>
            <input
              type="text"
              className={inputClass}
              value={form.productCode}
              onChange={handleChange("productCode")}
            />
          </div>

          <div>
            <label className={labelClass}>SKU *</label>
            <input
              type="text"
              className={inputClass}
              value={form.sku}
              onChange={handleChange("sku")}
            />
          </div>
          <div>
            <label className={labelClass}>Product Type</label>
            <select
              className={inputClass}
              value={form.productType}
              onChange={handleChange("productType")}
            >
              <option value="goods">Goods</option>
              <option value="service">Service</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Vendor</label>
            <select
              className={inputClass}
              value={form.vendorId}
              onChange={handleChange("vendorId")}
              disabled={vendorsLoading}
            >
              <option value="">
                {vendorsLoading ? "Loading vendors..." : "None"}
              </option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.vendorName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Manufacturer</label>
            <input
              type="text"
              className={inputClass}
              value={form.manufacturer}
              onChange={handleChange("manufacturer")}
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
      </div>

      {/* Price Information */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#111827] mb-5">
          Price Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
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
            <label className={labelClass}>Cost Price</label>
            <input
              type="number"
              step="0.01"
              className={inputClass}
              value={form.costPrice}
              onChange={handleChange("costPrice")}
            />
          </div>

          <div>
            <label className={labelClass}>Tax Percentage</label>
            <select
              className={inputClass}
              value={form.taxPercentage}
              onChange={handleChange("taxPercentage")}
            >
              <option value="0">None</option>
              <option value="5">GST 5%</option>
              <option value="12">GST 12%</option>
              <option value="18">GST 18%</option>
              <option value="28">GST 28%</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stock Information */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#111827] mb-5">
          Stock Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <label className={labelClass}>Unit</label>
            <input
              type="text"
              className={inputClass}
              value={form.unit}
              onChange={handleChange("unit")}
            />
          </div>
          <div>
            <label className={labelClass}>Quantity In Stock</label>
            <input
              type="number"
              className={inputClass}
              value={form.quantityInStock}
              onChange={handleChange("quantityInStock")}
            />
          </div>

          <div>
            <label className={labelClass}>Reorder Level</label>
            <input
              type="number"
              className={inputClass}
              value={form.reorderLevel}
              onChange={handleChange("reorderLevel")}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <label className={labelClass}>Description</label>
        <textarea
          rows={3}
          className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          value={form.description}
          onChange={handleChange("description")}
        />
      </div>
    </div>
  );
}