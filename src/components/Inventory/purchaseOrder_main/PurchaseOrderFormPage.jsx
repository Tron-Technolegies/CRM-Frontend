import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import usePurchaseOrders from "../../../hooks/usePurchaseOrders";
import useProducts from "../../../hooks/useProducts";
import useAccount from "../../../hooks/useAccount"; // gives us `staff` for PO Owner
import useVendor from "../../../hooks/useVendor";
import { getVendorPrefill } from "../../../api/vendor";
import {
  blankPurchaseOrderForm,
  fromApiResponse,
  toApiPayload,
  emptyLineItem,
  lineTotal,
} from "../../../utils/purchaseOrderMapping";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value || 0);

const PurchaseOrderFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { loadPurchaseOrder, savePurchaseOrder, loading: saving } = usePurchaseOrders();
  const { products, fetchProducts } = useProducts();
  const { staff } = useAccount();
  const { vendors } = useVendor();

  const [form, setForm] = useState(blankPurchaseOrderForm());
  const [errors, setErrors] = useState({});
  const [initializing, setInitializing] = useState(!!id);
  const [prefilling, setPrefilling] = useState(false);

  useEffect(() => {
    fetchProducts?.();
  }, []);

  useEffect(() => {
    if (!id) {
      setForm(blankPurchaseOrderForm());
      return;
    }
    (async () => {
      setInitializing(true);
      const data = await loadPurchaseOrder(id);
      if (data) setForm(fromApiResponse(data));
      setInitializing(false);
    })();
  }, [id]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const setAddressField = (group, key, value) =>
    setForm((prev) => ({ ...prev, [group]: { ...prev[group], [key]: value } }));

  // Selecting a vendor pulls their saved address into Billing Address
  const handleVendorSelect = async (vendorId) => {
    setField("vendorId", vendorId);
    if (!vendorId) return;
    setPrefilling(true);
    try {
      const data = await getVendorPrefill(vendorId);
      setForm((prev) => ({
        ...prev,
        billingAddress: {
          country: data.billingAddress?.country || "",
          address: data.billingAddress?.address || "",
          streetAdd: data.billingAddress?.streetAddress || "",
          city: data.billingAddress?.city || "",
          state: data.billingAddress?.state || "",
          zipCode: data.billingAddress?.zipCode || "",
        },
      }));
    } catch (err) {
      console.error("VENDOR PREFILL ERROR:", err);
    } finally {
      setPrefilling(false);
    }
  };

  const handleLineChange = (key, field, value) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((line) => {
        if (line.key !== key) return line;
        const updated = { ...line, [field]: value };
        if (field === "productId") {
          const product = (products || []).find((p) => String(p.id) === String(value));
          if (product) {
            updated.productName = product.name;
            updated.description = product.description || "";
            updated.listPrice = product.unit_price ?? product.unitPrice ?? 0;
            updated.tax = product.tax_percentage ?? product.taxPercentage ?? 0;
          }
        }
        return updated;
      }),
    }));
  };

  const addLine = () => setForm((prev) => ({ ...prev, items: [...prev.items, emptyLineItem()] }));
  const removeLine = (key) => setForm((prev) => ({ ...prev, items: prev.items.filter((l) => l.key !== key) }));

  useEffect(() => {
    if (form.copyBilling) {
      setForm((prev) => ({ ...prev, shippingAddress: { ...prev.billingAddress } }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.copyBilling, form.billingAddress]);

  const subtotal = form.items.reduce((sum, l) => sum + Number(l.quantity || 0) * Number(l.listPrice || 0), 0);
  const totalDiscount = form.items.reduce((sum, l) => sum + Number(l.discount || 0), 0);
  const totalTax = form.items.reduce((sum, l) => sum + Number(l.tax || 0), 0);
  const grandTotal = subtotal - totalDiscount + totalTax;

  const validate = () => {
    const next = {};
    if (!form.subject.trim()) next.subject = "Subject is required";
    if (!form.vendorId) next.vendorId = "Vendor is required";
    if (!form.purchaseDate) next.purchaseDate = "Purchase date is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      await savePurchaseOrder(toApiPayload(form), id);
      navigate("/inventory/purchase");
    } catch (err) {
      console.error("SAVE PURCHASE ORDER ERROR:", err);
    }
  };

  if (initializing) {
    return <div className="p-6 text-sm text-[#6B7280]">Loading purchase order...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">Purchase Orders</h1>
        <div className="flex gap-2">
          <button onClick={() => navigate("/inventory/purchase")} className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#111827] hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="h-11 px-4 rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
            {id ? "Update Order" : "Save Order"}
          </button>
        </div>
      </div>

      {/* Purchase Order Information */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 mb-5">
        <h2 className="text-sm font-semibold text-blue-600 mb-4">Purchase Order Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {id && (
            <div>
              <label className="text-xs font-medium text-[#6B7280]">PO NUMBER</label>
              <input value={form.purchaseOrderNumber} disabled className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm bg-gray-50 outline-none text-[#6B7280]" />
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-[#6B7280]">PURCHASE ORDER OWNER</label>
            <select value={form.ownerId} onChange={(e) => setField("ownerId", e.target.value)} className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm bg-white outline-none focus:ring-4 focus:ring-blue-100">
              <option value="">Select owner</option>
              {(staff || []).map((s) => (
                <option key={s.id} value={s.id}>{s.full_name || s.fullName || s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[#6B7280]">SUBJECT *</label>
            <input value={form.subject} onChange={(e) => setField("subject", e.target.value)} className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:ring-4 focus:ring-blue-100" />
            {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B7280]">VENDOR *</label>
            <select
              value={form.vendorId}
              onChange={(e) => handleVendorSelect(e.target.value)}
              className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm bg-white outline-none focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Select vendor</option>
              {(vendors || []).map((v) => (
                <option key={v.id} value={v.id}>{v.vendor_name || v.vendorName}</option>
              ))}
            </select>
            {errors.vendorId && <p className="text-xs text-red-600 mt-1">{errors.vendorId}</p>}
            {prefilling && <p className="text-xs text-blue-600 mt-1">Loading vendor address...</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-[#6B7280]">PURCHASE DATE *</label>
            <input type="date" value={form.purchaseDate} onChange={(e) => setField("purchaseDate", e.target.value)} className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:ring-4 focus:ring-blue-100" />
            {errors.purchaseDate && <p className="text-xs text-red-600 mt-1">{errors.purchaseDate}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B7280]">EXPECTED DELIVERY DATE</label>
            <input type="date" value={form.expectedDeliveryDate} onChange={(e) => setField("expectedDeliveryDate", e.target.value)} className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:ring-4 focus:ring-blue-100" />
          </div>

          <div>
            <label className="text-xs font-medium text-[#6B7280]">STATUS</label>
            <select value={form.status} onChange={(e) => setField("status", e.target.value)} className="w-full h-11 mt-1 px-3 rounded-xl border border-[#E5E7EB] text-sm bg-white outline-none focus:ring-4 focus:ring-blue-100">
              <option value="created">Created</option>
              <option value="sent">Sent</option>
              <option value="confirmed">Confirmed</option>
              <option value="partially_received">Partially Received</option>
              <option value="received">Received</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <h2 className="text-sm font-semibold text-blue-600 mb-4">Billing Address</h2>
          <p className="text-xs text-[#9CA3AF] mb-3">Auto-filled from the selected vendor — edit if needed.</p>
          <AddressFields value={form.billingAddress} onChange={(k, v) => setAddressField("billingAddress", k, v)} />
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-blue-600">Shipping Address</h2>
            <label className="flex items-center gap-2 text-xs text-[#6B7280]">
              Copy Billing
              <button type="button" onClick={() => setField("copyBilling", !form.copyBilling)} className={`w-9 h-5 rounded-full transition ${form.copyBilling ? "bg-blue-600" : "bg-gray-300"}`}>
                <span className={`block w-4 h-4 bg-white rounded-full shadow transform transition ${form.copyBilling ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
            </label>
          </div>
          <AddressFields value={form.shippingAddress} onChange={(k, v) => setAddressField("shippingAddress", k, v)} disabled={form.copyBilling} />
        </div>
      </div>

      {/* Ordered Items */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-blue-600">Ordered Items</h2>
          <button onClick={addLine} className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
            <Plus className="w-4 h-4" /> Add Row
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-medium text-[#6B7280] uppercase">
              <th className="py-2 pr-2">#</th>
              <th className="py-2 pr-2">Product Name</th>
              <th className="py-2 pr-2">Quantity</th>
              <th className="py-2 pr-2">List Price</th>
              <th className="py-2 pr-2">Discount</th>
              <th className="py-2 pr-2">Tax</th>
              <th className="py-2 pr-2">Total</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {form.items.map((line, idx) => (
              <tr key={line.key} className="border-t border-[#E5E7EB]">
                <td className="py-2 pr-2 text-[#6B7280]">{idx + 1}</td>
                <td className="py-2 pr-2">
                  <select value={line.productId} onChange={(e) => handleLineChange(line.key, "productId", e.target.value)} className="w-full h-9 px-2 rounded-lg border border-[#E5E7EB] text-sm">
                    <option value="">Select product...</option>
                    {(products || []).map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </td>
                <td className="py-2 pr-2">
                  <input type="number" min={1} value={line.quantity} onChange={(e) => handleLineChange(line.key, "quantity", Number(e.target.value))} className="w-20 h-9 px-2 rounded-lg border border-[#E5E7EB] text-sm" />
                </td>
                <td className="py-2 pr-2">
                  <input type="number" min={0} value={line.listPrice} onChange={(e) => handleLineChange(line.key, "listPrice", Number(e.target.value))} className="w-24 h-9 px-2 rounded-lg border border-[#E5E7EB] text-sm" />
                </td>
                <td className="py-2 pr-2">
                  <input type="number" min={0} value={line.discount} onChange={(e) => handleLineChange(line.key, "discount", Number(e.target.value))} className="w-24 h-9 px-2 rounded-lg border border-[#E5E7EB] text-sm" />
                </td>
                <td className="py-2 pr-2">
                  <input type="number" min={0} value={line.tax} onChange={(e) => handleLineChange(line.key, "tax", Number(e.target.value))} className="w-24 h-9 px-2 rounded-lg border border-[#E5E7EB] text-sm" />
                </td>
                <td className="py-2 pr-2 font-medium text-[#111827]">{formatCurrency(lineTotal(line))}</td>
                <td className="py-2">
                  {form.items.length > 1 && (
                    <button onClick={() => removeLine(line.key)} className="text-[#6B7280] hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <div className="w-64 space-y-1 text-sm">
            <div className="flex justify-between text-[#6B7280]"><span>Sub Total</span><span className="text-[#111827] font-medium">{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between text-[#6B7280]"><span>Discount</span><span className="text-red-500 font-medium">-{formatCurrency(totalDiscount)}</span></div>
            <div className="flex justify-between text-[#6B7280]"><span>Tax</span><span className="text-[#111827] font-medium">{formatCurrency(totalTax)}</span></div>
            <div className="flex justify-between pt-2 border-t border-[#E5E7EB] font-semibold text-[#111827]"><span>Grand Total</span><span className="text-blue-600">{formatCurrency(grandTotal)}</span></div>
          </div>
        </div>
      </div>

      {/* Terms & Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <h2 className="text-sm font-semibold text-blue-600 mb-3">Terms & Conditions</h2>
          <textarea value={form.termsAndConditions} onChange={(e) => setField("termsAndConditions", e.target.value)} rows={4} className="w-full p-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:ring-4 focus:ring-blue-100" />
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <h2 className="text-sm font-semibold text-blue-600 mb-3">Description</h2>
          <textarea value={form.description} onChange={(e) => setField("description", e.target.value)} rows={4} className="w-full p-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:ring-4 focus:ring-blue-100" />
        </div>
      </div>
    </div>
  );
};

const AddressFields = ({ value, onChange, disabled }) => {
  const set = (field, val) => onChange(field, val);
  return (
    <>
      <textarea value={value.streetAdd} onChange={(e) => set("streetAdd", e.target.value)} disabled={disabled} placeholder="Street Address" className="mt-2 w-full min-h-[80px] rounded-xl border border-[#E5E7EB] p-3 text-sm outline-none resize-none disabled:bg-gray-50" />
      <div className="grid grid-cols-2 gap-3 mt-3">
        <input placeholder="City" value={value.city} onChange={(e) => set("city", e.target.value)} disabled={disabled} className="h-11 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none disabled:bg-gray-50" />
        <input placeholder="State" value={value.state} onChange={(e) => set("state", e.target.value)} disabled={disabled} className="h-11 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none disabled:bg-gray-50" />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <input placeholder="Zip Code" value={value.zipCode} onChange={(e) => set("zipCode", e.target.value)} disabled={disabled} className="h-11 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none disabled:bg-gray-50" />
        <input placeholder="Country" value={value.country} onChange={(e) => set("country", e.target.value)} disabled={disabled} className="h-11 px-3 rounded-xl border border-[#E5E7EB] text-sm outline-none disabled:bg-gray-50" />
      </div>
    </>
  );
};

export default PurchaseOrderFormPage;