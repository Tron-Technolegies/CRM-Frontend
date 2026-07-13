import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";

function validateQuote(form) {
  const errors = {};
  if (!form.subject.trim()) errors.subject = "Subject is required";
  if (!form.contactName.trim()) errors.contactName = "Contact name is required";
  if (form.products.length === 0) errors.products = "Add at least one line item";
  return errors;
}

function emptyAddress() {
  return {
    country: "",
    address: "",
    streetAdd: "",
    city: "",
    state: "",
    zipCode: "",
  };
}

function emptyProduct() {
  return {
    product: "",
    description: "",
    quantity: 1,
    list_price: "",
    amount: "",
    discount: "",
    tax: "",
    total: "",
  };
}

function AddressFields({ title, value, onChange, onUseAccountAddress, canUseAccountAddress }) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[#111827]">{title}</h3>
        {canUseAccountAddress && (
          <button
            type="button"
            onClick={onUseAccountAddress}
            className="text-xs font-medium text-violet-600 hover:text-violet-700"
          >
            Use account address
          </button>
        )}
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-[#111827] font-medium">Country</label>
          <input value={value.country} onChange={(e) => onChange("country", e.target.value)} placeholder="Country" className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
        <div>
          <label className="text-sm text-[#111827] font-medium">Address</label>
          <input value={value.address} onChange={(e) => onChange("address", e.target.value)} placeholder="Address" className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-[#111827] font-medium">Street Address</label>
          <input value={value.streetAdd} onChange={(e) => onChange("streetAdd", e.target.value)} placeholder="Street address" className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
        <div>
          <label className="text-sm text-[#111827] font-medium">City</label>
          <input value={value.city} onChange={(e) => onChange("city", e.target.value)} placeholder="City" className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
        <div>
          <label className="text-sm text-[#111827] font-medium">State</label>
          <input value={value.state} onChange={(e) => onChange("state", e.target.value)} placeholder="State" className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
        <div>
          <label className="text-sm text-[#111827] font-medium">Zip Code</label>
          <input value={value.zipCode} onChange={(e) => onChange("zipCode", e.target.value)} placeholder="Zip code" className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
      </div>
    </div>
  );
}

function LineItemRow({ item, onChange, onRemove, index, canRemove }) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] p-4 space-y-4 bg-white">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-[#111827]">Line Item {index + 1}</h4>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="h-9 px-3 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition flex items-center gap-2"
          >
            <Trash2 size={14} />
            Remove
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <label className="text-sm text-[#111827] font-medium">Product</label>
          <input value={item.product} onChange={(e) => onChange("product", e.target.value)} placeholder="Product name" className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
        <div className="lg:col-span-2">
          <label className="text-sm text-[#111827] font-medium">Description</label>
          <input value={item.description} onChange={(e) => onChange("description", e.target.value)} placeholder="Description" className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
        <div>
          <label className="text-sm text-[#111827] font-medium">Quantity</label>
          <input type="number" min="1" value={item.quantity} onChange={(e) => onChange("quantity", e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
        <div>
          <label className="text-sm text-[#111827] font-medium">List Price</label>
          <input type="number" min="0" step="0.01" value={item.list_price} onChange={(e) => onChange("list_price", e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
        <div>
          <label className="text-sm text-[#111827] font-medium">Discount %</label>
          <input type="number" min="0" step="0.01" value={item.discount} onChange={(e) => onChange("discount", e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
        <div>
          <label className="text-sm text-[#111827] font-medium">Tax %</label>
          <input type="number" min="0" step="0.01" value={item.tax} onChange={(e) => onChange("tax", e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
        <div>
          <label className="text-sm text-[#111827] font-medium">Amount</label>
          <input type="number" min="0" step="0.01" value={item.amount} onChange={(e) => onChange("amount", e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
        <div>
          <label className="text-sm text-[#111827] font-medium">Total</label>
          <input type="number" min="0" step="0.01" value={item.total} onChange={(e) => onChange("total", e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
      </div>
    </div>
  );
}

export default function QuoteFormModal({
  open,
  onClose,
  onSubmit,
  loading = false,
  initialData = null,
  staff = [],
  deals = [],
  accounts = [],
}) {
  const blankForm = useMemo(() => ({
    subject: "",
    quoteStage: "draft",
    validUntil: "",
    assignedTo: "",
    dealId: "",
    contactName: "",
    accountId: "",
    billingAddress: emptyAddress(),
    shippingAddress: emptyAddress(),
    products: [emptyProduct()],
  }), []);

  const [form, setForm] = useState(blankForm);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        subject: initialData.subject || "",
        quoteStage: initialData.quoteStage || initialData.quote_stage || "draft",
        validUntil: initialData.validUntil || initialData.valid_until || "",
        assignedTo: initialData.assignedToId || initialData.assigned_to_id || "",
        dealId: initialData.dealId || initialData.deal_id || "",
        contactName: initialData.contactName || initialData.contact_name || "",
        accountId: initialData.accountId || initialData.account_id || "",
        billingAddress: {
          country: initialData.billingAddress?.country || initialData.billing_address?.country || "",
          address: initialData.billingAddress?.address || initialData.billing_address?.address || "",
          streetAdd: initialData.billingAddress?.street_address || initialData.billing_address?.street_address || "",
          city: initialData.billingAddress?.city || initialData.billing_address?.city || "",
          state: initialData.billingAddress?.state || initialData.billing_address?.state || "",
          zipCode: initialData.billingAddress?.zip_code || initialData.billing_address?.zip_code || "",
        },
        shippingAddress: {
          country: initialData.shippingAddress?.country || initialData.shipping_address?.country || "",
          address: initialData.shippingAddress?.address || initialData.shipping_address?.address || "",
          streetAdd: initialData.shippingAddress?.street_address || initialData.shipping_address?.street_address || "",
          city: initialData.shippingAddress?.city || initialData.shipping_address?.city || "",
          state: initialData.shippingAddress?.state || initialData.shipping_address?.state || "",
          zipCode: initialData.shippingAddress?.zip_code || initialData.shipping_address?.zip_code || "",
        },
        products: Array.isArray(initialData.products) && initialData.products.length > 0
          ? initialData.products.map((item) => ({
              product: item.product || "",
              description: item.description || "",
              quantity: item.quantity ?? 1,
              list_price: item.list_price ?? "",
              amount: item.amount ?? "",
              discount: item.discount ?? "",
              tax: item.tax ?? "",
              total: item.total ?? "",
            }))
          : [emptyProduct()],
      });
    } else {
      setForm(blankForm);
    }
    setTouched({});
  }, [initialData, blankForm]);

  const selectedAccount = accounts.find((account) => String(account.id) === String(form.accountId));
  const selectedDeal = deals.find((deal) => String(deal.id) === String(form.dealId));

  const errors = validateQuote(form);
  const hasErrors = Object.keys(errors).length > 0;

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const setAddressField = (group, key, value) =>
    setForm((prev) => ({
      ...prev,
      [group]: { ...prev[group], [key]: value },
    }));
  const setProductField = (index, key, value) =>
    setForm((prev) => ({
      ...prev,
      products: prev.products.map((item, currentIndex) => (currentIndex === index ? { ...item, [key]: value } : item)),
    }));

  const updateQuotePreview = (index, field, value) => {
    setProductField(index, field, value);
  };

  const closeAndReset = () => {
    if (loading) return;
    setForm(blankForm);
    setTouched({});
    onClose();
  };

  const submit = () => {
    setTouched({
      subject: true,
      contactName: true,
      products: true,
    });
    if (hasErrors) return;
    onSubmit(form);
  };

  const useAccountAddress = (field) => {
    if (!selectedAccount) return;
    const address = selectedAccount[field];
    if (!address) return;
    setField(field === "billingAddress" ? "billingAddress" : "shippingAddress", {
      country: address.country || "",
      address: address.address || "",
      streetAdd: address.street_address || "",
      city: address.city || "",
      state: address.state || "",
      zipCode: address.zip_code || "",
    });
  };

  return (
    <Modal
      open={open}
      title={initialData ? "Edit Quote" : "Add New Quote"}
      subtitle={initialData ? "Update the quote details below" : "Fill in the details below to add a new quote to your CRM"}
      onClose={closeAndReset}
      maxWidthClassName="max-w-6xl"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="text-sm text-[#111827] font-medium">Subject <span className="text-red-500">*</span></label>
            <input
              value={form.subject}
              onChange={(e) => setField("subject", e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, subject: true }))}
              placeholder="Enter quote subject"
              className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
            {touched.subject && errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject}</p>}
          </div>

          <div>
            <label className="text-sm text-[#111827] font-medium">Quote Stage</label>
            <select
              value={form.quoteStage}
              onChange={(e) => setField("quoteStage", e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-[#111827] font-medium">Valid Until</label>
            <input
              type="date"
              value={form.validUntil}
              onChange={(e) => setField("validUntil", e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

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

          <div>
            <label className="text-sm text-[#111827] font-medium">Deal</label>
            <select
              value={form.dealId}
              onChange={(e) => {
                const deal = deals.find((item) => String(item.id) === String(e.target.value));
                setField("dealId", e.target.value);
                if (deal) {
                  setField("contactName", deal.contactName || deal.contact_name || form.contactName);
                  if (!form.accountId && (deal.accountId || deal.account_id)) {
                    setField("accountId", String(deal.accountId || deal.account_id));
                  }
                }
              }}
              className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">No deal linked</option>
              {deals.map((deal) => (
                <option key={deal.id} value={deal.id}>
                  {deal.name || deal.subject || `Deal #${deal.id}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-[#111827] font-medium">Account</label>
            <select
              value={form.accountId}
              onChange={(e) => {
                const account = accounts.find((item) => String(item.id) === String(e.target.value));
                setField("accountId", e.target.value);
                if (account) {
                  setField("billingAddress", {
                    country: account.billingAddress?.country || "",
                    address: account.billingAddress?.address || "",
                    streetAdd: account.billingAddress?.street_address || "",
                    city: account.billingAddress?.city || "",
                    state: account.billingAddress?.state || "",
                    zipCode: account.billingAddress?.zip_code || "",
                  });
                  setField("shippingAddress", {
                    country: account.shippingAddress?.country || "",
                    address: account.shippingAddress?.address || "",
                    streetAdd: account.shippingAddress?.street_address || "",
                    city: account.shippingAddress?.city || "",
                    state: account.shippingAddress?.state || "",
                    zipCode: account.shippingAddress?.zip_code || "",
                  });
                }
              }}
              className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">No account linked</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountName || `Account #${account.id}`}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-[#111827] font-medium">Contact Name <span className="text-red-500">*</span></label>
            <input
              value={form.contactName}
              onChange={(e) => setField("contactName", e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, contactName: true }))}
              placeholder="Enter contact name"
              className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
            {touched.contactName && errors.contactName && <p className="text-xs text-red-600 mt-1">{errors.contactName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <AddressFields
            title="Billing Address"
            value={form.billingAddress}
            onChange={(key, value) => setAddressField("billingAddress", key, value)}
            canUseAccountAddress={!!selectedAccount?.billingAddress}
            onUseAccountAddress={() => useAccountAddress("billingAddress")}
          />
          <AddressFields
            title="Shipping Address"
            value={form.shippingAddress}
            onChange={(key, value) => setAddressField("shippingAddress", key, value)}
            canUseAccountAddress={!!selectedAccount?.shippingAddress}
            onUseAccountAddress={() => useAccountAddress("shippingAddress")}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-[#111827]">Products</h3>
              {touched.products && errors.products && <p className="text-xs text-red-600 mt-1">{errors.products}</p>}
            </div>
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, products: [...prev.products, emptyProduct()] }))}
              className="h-10 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 transition text-white text-sm font-medium flex items-center gap-2"
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>

          <div className="space-y-4">
            {form.products.map((item, index) => (
              <LineItemRow
                key={index}
                index={index}
                item={item}
                canRemove={form.products.length > 1}
                onRemove={() =>
                  setForm((prev) => ({
                    ...prev,
                    products: prev.products.filter((_, currentIndex) => currentIndex !== index),
                  }))
                }
                onChange={(field, value) => updateQuotePreview(index, field, value)}
              />
            ))}
          </div>
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
          {initialData ? "Save Changes" : "Save Quote"}
        </button>
      </div>
    </Modal>
  );
}
