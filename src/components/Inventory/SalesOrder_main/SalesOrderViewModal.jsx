import { Calendar, FileText, MapPin, Pencil, Tag, Truck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import { getSalesOrder } from "../../../api/salesOrders";
import { lineTotal } from "../../../utils/salesOrderMapping";

function formatValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(value || 0));
}

function Badge({ value }) {
  const label = String(value || "created");
  const colors = {
    created: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    approved: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    delivered: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    cancelled: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${colors[label.toLowerCase()] || colors.created}`}>
      <span className="w-2 h-2 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-[#EAECF0] bg-[#FAFAFA] p-5 space-y-4">
      <p className="text-[10px] font-bold text-[#B0B7C3] uppercase tracking-[0.12em]">{title}</p>
      {children}
    </div>
  );
}

function Field({ label, icon: Icon, value }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">
        {Icon && <Icon size={10} />}
        {label}
      </p>
      <p className={`text-sm font-medium leading-snug ${value ? "text-[#111827]" : "text-[#D1D5DB]"}`}>{value || "—"}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-28 rounded-2xl bg-[#F0F2F5]" />
      <div className="h-32 rounded-2xl bg-[#F0F2F5]" />
      <div className="h-40 rounded-2xl bg-[#F0F2F5]" />
    </div>
  );
}

function ErrorState({ onClose }) {
  return (
    <div className="py-12 flex flex-col items-center gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center">
        <span className="text-rose-500 text-xl font-bold">!</span>
      </div>
      <p className="text-sm font-medium text-[#111827]">Failed to load sales order</p>
      <button
        type="button"
        onClick={onClose}
        className="mt-2 h-9 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#374151] font-medium hover:bg-[#F9FAFB] transition"
      >
        Close
      </button>
    </div>
  );
}

function AddressField({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">{label}</p>
      <p className={`text-sm font-medium mt-1 ${value ? "text-[#111827]" : "text-[#D1D5DB]"}`}>{value || "—"}</p>
    </div>
  );
}

function AddressBlock({ title, address }) {
  return (
    <div className="rounded-2xl bg-[#FAFAFA] border border-[#EAECF0] p-5">
      <div className="flex items-center gap-1.5 mb-4">
        <MapPin size={13} className="text-[#9CA3AF]" />
        <h3 className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <AddressField label="Country" value={address?.country} />
        <AddressField label="Address" value={address?.address} />
        <AddressField label="Street Address" value={address?.streetAdd || address?.streetAddress} />
        <AddressField label="City" value={address?.city} />
        <AddressField label="State" value={address?.state} />
        <AddressField label="Zip Code" value={address?.zipCode} />
      </div>
    </div>
  );
}

export default function SalesOrderViewModal({ open, onClose, onEdit, orderId = null }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open || !orderId) return;
    let cancelled = false;
    setLoading(true);
    setData(null);
    setError(false);

    getSalesOrder(orderId)
      .then((payload) => { if (!cancelled) setData(payload); })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [open, orderId]);

  const items = Array.isArray(data?.items) ? data.items : [];
  const total = items.reduce((sum, item) => sum + lineTotal(item), 0);

  return (
    <Modal open={open} title="Sales Order Details" subtitle="Full profile for this sales order" onClose={onClose} maxWidthClassName="max-w-4xl">
      {loading && <Skeleton />}
      {error && <ErrorState onClose={onClose} />}
      {!loading && !error && data && (
        <>
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-[#F5F0FF] to-white border border-[#E5D9FF]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                <Truck size={24} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-xl font-bold text-[#0F172A] truncate">{data.subject || "Untitled Sales Order"}</h3>
                <p className="text-sm text-[#6B7280] truncate mt-0.5 font-medium">
                  {data.customer || "No customer"} {data.deal && data.deal !== "—" ? `· ${data.deal}` : ""}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge value={data.status} />
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                    <Tag size={11} />
                    {formatMoney(total)}
                  </span>
                </div>
              </div>
            </div>

            <Section title="Order Details">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                <Field label="Status" icon={Tag} value={formatValue(data.status)} />
                <Field label="Subject" icon={FileText} value={formatValue(data.subject)} />
                <Field label="Customer" icon={Users} value={formatValue(data.customer)} />
                <Field label="Due Date" icon={Calendar} value={formatValue(data.dueDate)} />
                <Field label="Deal" icon={FileText} value={formatValue(data.deal)} />
                <Field label="Quote" icon={FileText} value={formatValue(data.quote)} />
                <Field label="Owner" icon={Users} value={formatValue(data.owner)} />
                <Field label="Carrier" icon={Truck} value={formatValue(data.carrier)} />
                <Field label="Purchase Order #" icon={FileText} value={formatValue(data.purchaseOrderNumber)} />
              </div>
            </Section>

            <Section title="Ordered Items">
              <div className="space-y-3">
                {items.length > 0 ? items.map((item, index) => (
                  <div key={item.productId || `${item.id}-${index}`} className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">{item.productName || `Product ${index + 1}`}</p>
                        <p className="text-sm text-[#64748B] mt-1">{item.description || "—"}</p>
                      </div>
                      <p className="text-sm font-semibold text-[#111827]">{formatMoney(item.lineTotal)}</p>
                    </div>
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <p className="text-[#64748B]">Qty: <span className="text-[#111827]">{item.quantity || 1}</span></p>
                      <p className="text-[#64748B]">Price: <span className="text-[#111827]">{formatMoney(item.listPrice)}</span></p>
                      <p className="text-[#64748B]">Discount: <span className="text-[#111827]">{formatMoney(item.discount)}</span></p>
                      <p className="text-[#64748B]">Tax: <span className="text-[#111827]">{formatMoney(item.tax)}</span></p>
                    </div>
                  </div>
                )) : <p className="text-sm text-[#64748B]">No line items found.</p>}
              </div>
            </Section>

            <Section title="Address Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AddressBlock title="Billing Address" address={data.billingAddress} />
                <AddressBlock title="Shipping Address" address={data.shippingAddress} />
              </div>
            </Section>
          </div>

          <div className="mt-5 pt-4 border-t border-[#F0F2F5] flex items-center justify-between">
            <p className="text-xs text-[#9CA3AF]">Due {data.dueDate || "—"}</p>
            <div className="flex items-center gap-2.5">
              <button type="button" onClick={onClose} className="h-10 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#374151] font-medium hover:bg-[#F9FAFB] transition">
                Close
              </button>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => { onClose(); onEdit(data); }}
                  className="h-10 px-5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.98] transition text-white text-sm font-semibold flex items-center gap-2 shadow-sm"
                >
                  <Pencil size={13} />
                  Edit Order
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}