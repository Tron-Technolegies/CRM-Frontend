import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { getInvoice, addInvoice, updateInvoice, getSalesOrderPrefill } from "../../../api/invoice";
import { getStaff } from "../../../api/lead";
import { getCustomers } from "../../../api/customer";
import { getSalesOrders } from "../../../api/salesOrders";
import { getProducts } from "../../../api/products";
import { mapInvoiceFromApi, mapInvoiceToApi, emptyInvoiceForm, emptyItem } from "../../../utils/invoiceMapping";

const inputClass =
  "h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm text-[#111827] outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400";
const labelClass = "block text-xs font-medium text-[#64748B] mb-2";

const STATUS_OPTIONS = ["draft", "sent", "paid", "overdue", "cancelled"];

export default function AddInvoice({ invoiceId, onCancel, onSaved }) {
  const isEditMode = Boolean(invoiceId);

  const [form, setForm] = useState(emptyInvoiceForm());
  const [staff, setStaff] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [adjustment, setAdjustment] = useState(0);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getStaff().then(setStaff).catch((err) => console.error("FETCH STAFF ERROR:", err));
    getCustomers().then(setCustomers).catch((err) => console.error("FETCH CUSTOMERS ERROR:", err));
    getSalesOrders().then(setSalesOrders).catch((err) => console.error("FETCH SALES ORDERS ERROR:", err));
    getProducts().then(setProducts).catch((err) => console.error("FETCH PRODUCTS ERROR:", err));
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchInvoice = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getInvoice(invoiceId);
        setForm(mapInvoiceFromApi(data));
      } catch (err) {
        console.error("FETCH INVOICE ERROR:", err);
        setError("Could not load this invoice. Please go back and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId, isEditMode]);

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const updateAddressField = (type, field, value) => {
    setForm((prev) => ({ ...prev, [type]: { ...prev[type], [field]: value } }));
  };

  const updateItem = (index, field, value) => {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  };

  const addItemRow = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, emptyItem()] }));
  };

  const removeItemRow = (index) => {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const handleSalesOrderChange = async (e) => {
    const salesOrderId = e.target.value;
    setForm((prev) => ({ ...prev, salesOrderId }));
    if (!salesOrderId) return;

    try {
      const prefill = await getSalesOrderPrefill(salesOrderId);
      setForm((prev) => ({
        ...prev,
        salesOrderId,
        subject: prev.subject || prefill.subject || "",
        customerId: prefill.customerId || prev.customerId,
        purchaseOrderNumber: prefill.purchaseOrderNumber || prev.purchaseOrderNumber,
        termsAndConditions: prefill.termsAndConditions || prev.termsAndConditions,
        billingAddress: prefill.billingAddress
          ? {
              country: prefill.billingAddress.country || "",
              flatNo: prefill.billingAddress.address || "",
              streetAddress: prefill.billingAddress.streetAddress || "",
              city: prefill.billingAddress.city || "",
              state: prefill.billingAddress.state || "",
              zipCode: prefill.billingAddress.zipCode || "",
            }
          : prev.billingAddress,
        shippingAddress: prefill.shippingAddress
          ? {
              country: prefill.shippingAddress.country || "",
              flatNo: prefill.shippingAddress.address || "",
              streetAddress: prefill.shippingAddress.streetAddress || "",
              city: prefill.shippingAddress.city || "",
              state: prefill.shippingAddress.state || "",
              zipCode: prefill.shippingAddress.zipCode || "",
            }
          : prev.shippingAddress,
        items: prefill.items?.length
          ? prefill.items.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              listPrice: item.listPrice,
              discount: item.discount,
              tax: item.tax,
            }))
          : prev.items,
      }));
    } catch (err) {
      console.error("SALES ORDER PREFILL ERROR:", err);
    }
  };

  const totals = useMemo(() => {
    const subTotal = form.items.reduce(
      (sum, item) => sum + (Number(item.listPrice) || 0) * (Number(item.quantity) || 0),
      0
    );
    const discountTotal = form.items.reduce((sum, item) => sum + (Number(item.discount) || 0), 0);
    const taxTotal = form.items.reduce((sum, item) => sum + (Number(item.tax) || 0), 0);
    const grandTotal = subTotal - discountTotal + taxTotal + (Number(adjustment) || 0);
    return { subTotal, discountTotal, taxTotal, grandTotal };
  }, [form.items, adjustment]);

  const handleSave = async (andNew = false) => {
    setError("");

    if (!form.subject.trim() || !form.customerId || !form.invoiceDate) {
      setError("Subject, customer and invoice date are required.");
      return;
    }

    setSaving(true);
    try {
      const payload = mapInvoiceToApi(form);
      if (isEditMode) {
        await updateInvoice(invoiceId, payload);
        onSaved?.();
      } else {
        await addInvoice(payload);
        if (andNew) {
          setForm(emptyInvoiceForm());
          setAdjustment(0);
        } else {
          onSaved?.();
        }
      }
    } catch (err) {
      console.error("SAVE INVOICE ERROR:", err);
      const message =
        typeof err?.response?.data === "string"
          ? err.response.data
          : "Something went wrong while saving the invoice.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-[#6B7280]">Loading invoice details...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">
          {isEditMode ? "Edit Invoice" : "Add Invoice"}
        </h1>
        <div className="flex gap-3">
          <button type="button" onClick={() => onCancel?.()} className="px-4 h-11 rounded-xl border border-[#E5E7EB] text-[#111827] hover:bg-gray-50">
            Cancel
          </button>
          {!isEditMode && (
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-4 h-11 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-60"
            >
              Save and New
            </button>
          )}
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Invoice"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#111827] mb-5">Invoice Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <label className={labelClass}>Invoice Owner</label>
            <select className={inputClass} value={form.ownerId} onChange={updateField("ownerId")}>
              <option value="">None</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>{s.fullName || s.full_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Sales Order</label>
            <select className={inputClass} value={form.salesOrderId} onChange={handleSalesOrderChange}>
              <option value="">None</option>
              {salesOrders.map((so) => (
                <option key={so.id} value={so.id}>{so.subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Subject *</label>
            <input type="text" className={inputClass} value={form.subject} onChange={updateField("subject")} />
          </div>
          <div>
            <label className={labelClass}>Purchase Order</label>
            <input type="text" className={inputClass} value={form.purchaseOrderNumber} onChange={updateField("purchaseOrderNumber")} />
          </div>

          <div>
            <label className={labelClass}>Invoice Date *</label>
            <input type="date" className={inputClass} value={form.invoiceDate} onChange={updateField("invoiceDate")} />
          </div>
          <div>
            <label className={labelClass}>Customer *</label>
            <select className={inputClass} value={form.customerId} onChange={updateField("customerId")}>
              <option value="">None</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.contactName || c.contact_name || c.name || c.companyName || c.company_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Due Date</label>
            <input type="date" className={inputClass} value={form.dueDate} onChange={updateField("dueDate")} />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select className={inputClass} value={form.status} onChange={updateField("status")}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Terms &amp; Conditions</label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              value={form.termsAndConditions}
              onChange={updateField("termsAndConditions")}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#111827] mb-5">Address Information</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {["billingAddress", "shippingAddress"].map((type) => (
            <div key={type} className={type === "shippingAddress" ? "lg:border-l lg:border-[#E5E7EB] lg:pl-8" : ""}>
              <h3 className="text-blue-600 font-semibold mb-4 text-sm">
                {type === "billingAddress" ? "Billing Address" : "Shipping Address"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Country / Region</label>
                  <input type="text" className={inputClass} value={form[type].country} onChange={(e) => updateAddressField(type, "country", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Flat/House No./Building/Apartment</label>
                  <input type="text" className={inputClass} value={form[type].flatNo} onChange={(e) => updateAddressField(type, "flatNo", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Street Address</label>
                  <input type="text" className={inputClass} value={form[type].streetAddress} onChange={(e) => updateAddressField(type, "streetAddress", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input type="text" className={inputClass} value={form[type].city} onChange={(e) => updateAddressField(type, "city", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>State/Province</label>
                  <input type="text" className={inputClass} value={form[type].state} onChange={(e) => updateAddressField(type, "state", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Zip/Postal Code</label>
                  <input type="text" className={inputClass} value={form[type].zipCode} onChange={(e) => updateAddressField(type, "zipCode", e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-lg font-semibold text-[#111827] mb-5">Ordered Items</h2>

        <div className="overflow-x-auto rounded-xl border border-[#E5E7EB]">
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr className="bg-blue-50">
                <th className="w-12 px-3 py-3 text-center text-sm font-semibold text-[#374151]">#</th>
                <th className="w-64 px-3 py-3 text-left text-sm font-semibold text-[#374151]">Product</th>
                <th className="px-3 py-3 text-center text-sm font-semibold text-[#374151]">Qty</th>
                <th className="px-3 py-3 text-center text-sm font-semibold text-[#374151]">Price</th>
                <th className="px-3 py-3 text-center text-sm font-semibold text-[#374151]">Amount</th>
                <th className="px-3 py-3 text-center text-sm font-semibold text-[#374151]">Discount</th>
                <th className="px-3 py-3 text-center text-sm font-semibold text-[#374151]">Tax</th>
                <th className="px-3 py-3 text-center text-sm font-semibold text-[#374151]">Total</th>
                <th className="w-10 px-2 py-3" />
              </tr>
            </thead>
            <tbody>
              {form.items.map((item, index) => {
                const amount = (Number(item.listPrice) || 0) * (Number(item.quantity) || 0);
                const total = amount - (Number(item.discount) || 0) + (Number(item.tax) || 0);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-[#E5E7EB] p-3 text-center text-sm bg-[#F9FAFB]">{index + 1}</td>
                    <td className="border border-[#E5E7EB] p-2 bg-[#F9FAFB]">
                      <select
                        value={item.productId}
                        onChange={(e) => {
                          const product = products.find((p) => String(p.id) === e.target.value);
                          updateItem(index, "productId", e.target.value);
                          if (product) {
                            updateItem(index, "productName", product.name);
                            updateItem(index, "listPrice", product.unitPrice ?? item.listPrice);
                          }
                        }}
                        className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm outline-none bg-white"
                      >
                        <option value="">Select product</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border border-[#E5E7EB] p-2 bg-[#F9FAFB]">
                      <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, "quantity", e.target.value)} className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-center outline-none bg-white" />
                    </td>
                    <td className="border border-[#E5E7EB] p-2 bg-[#F9FAFB]">
                      <input type="number" value={item.listPrice} onChange={(e) => updateItem(index, "listPrice", e.target.value)} className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-right outline-none bg-white" />
                    </td>
                    <td className="border border-[#E5E7EB] p-2 bg-[#F9FAFB]">
                      <input type="text" readOnly value={amount.toFixed(2)} className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-right outline-none bg-white" />
                    </td>
                    <td className="border border-[#E5E7EB] p-2 bg-[#F9FAFB]">
                      <input type="number" value={item.discount} onChange={(e) => updateItem(index, "discount", e.target.value)} className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-right outline-none bg-white" />
                    </td>
                    <td className="border border-[#E5E7EB] p-2 bg-[#F9FAFB]">
                      <input type="number" value={item.tax} onChange={(e) => updateItem(index, "tax", e.target.value)} className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-right outline-none bg-white" />
                    </td>
                    <td className="border border-[#E5E7EB] p-2 bg-[#F9FAFB]">
                      <input type="text" readOnly value={total.toFixed(2)} className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-right outline-none bg-white" />
                    </td>
                    <td className="p-2 text-center">
                      <button type="button" onClick={() => removeItemRow(index)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row">
          <button type="button" onClick={addItemRow} className="inline-flex h-fit items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">
            Add Row
            <Plus size={16} />
          </button>

          <div className="w-full md:w-80 rounded-xl border border-[#E5E7EB] p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#64748B]">Sub Total</span>
                <input type="text" readOnly value={totals.subTotal.toFixed(2)} className="w-36 rounded-lg bg-[#EBEBEB] px-3 py-2 text-sm outline-none" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#64748B]">Discount</span>
                <input type="text" readOnly value={totals.discountTotal.toFixed(2)} className="w-36 rounded-lg bg-[#EBEBEB] px-3 py-2 text-sm outline-none" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#64748B]">Tax</span>
                <input type="text" readOnly value={totals.taxTotal.toFixed(2)} className="w-36 rounded-lg bg-[#EBEBEB] px-3 py-2 text-sm outline-none" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#64748B]">Adjustment</span>
                <input type="number" value={adjustment} onChange={(e) => setAdjustment(e.target.value)} className="w-36 rounded-lg bg-[#EBEBEB] px-3 py-2 text-sm outline-none" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#374151]">Grand Total</span>
                <input type="text" readOnly value={totals.grandTotal.toFixed(2)} className="w-36 rounded-lg bg-[#EBEBEB] px-3 py-2 text-right font-semibold text-blue-600 outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mt-6">
        <label className={labelClass}>Description</label>
        <textarea
          rows={3}
          className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-[#111827] outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          value={form.description}
          onChange={updateField("description")}
        />
      </div>
    </div>
  );
}