import { Calendar, FileText, Pencil, Tag, Users } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "../ui/Modal";

const BASE_URL = "http://127.0.0.1:8000/api/admin";

function formatValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function formatMoney(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function Badge({ value }) {
  const label = String(value || "draft");
  const colors = {
    draft: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    sent: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    accepted: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    rejected: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${colors[label.toLowerCase()] || colors.draft}`}>
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
      <p className={`text-sm font-medium leading-snug ${value ? "text-[#111827]" : "text-[#D1D5DB]"}`}>
        {value || "—"}
      </p>
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
      <p className="text-sm font-medium text-[#111827]">Failed to load quote</p>
      <p className="text-xs text-[#9CA3AF]">Check your connection or try again.</p>
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

function AddressBlock({ title, address }) {
  const lines = [
    address?.address,
    address?.street_address,
    address?.city,
    address?.state,
    address?.zip_code,
    address?.country,
  ].filter(Boolean);

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
      <h3 className="text-sm font-semibold text-[#111827]">{title}</h3>
      <div className="mt-2 space-y-1 text-sm text-[#64748B]">
        {lines.length > 0 ? lines.map((line) => <p key={line}>{line}</p>) : <p>—</p>}
      </div>
    </div>
  );
}

export default function QuoteViewModal({ open, onClose, onEdit, quoteId = null }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open || !quoteId) return;
    setLoading(true);
    setData(null);
    setError(false);
    fetch(`${BASE_URL}/quote/single/view/${quoteId}/`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load quote");
        return response.json();
      })
      .then((payload) => setData(payload))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [open, quoteId]);

  const products = Array.isArray(data?.products) ? data.products : data?.quote_products || [];
  const total = products.reduce((sum, item) => sum + Number(item.total || 0), 0);

  return (
    <Modal
      open={open}
      title="Quote Details"
      subtitle="Full profile for this quote"
      onClose={onClose}
      maxWidthClassName="max-w-4xl"
    >
      {loading && <Skeleton />}
      {error && <ErrorState onClose={onClose} />}
      {!loading && !error && data && (
        <>
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-[#F5F0FF] to-white border border-[#E5D9FF]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                <FileText size={24} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-xl font-bold text-[#0F172A] truncate">{data.subject || "Untitled Quote"}</h3>
                <p className="text-sm text-[#6B7280] truncate mt-0.5 font-medium">
                  {data.contact_name || "No contact"} {data.account_name ? `· ${data.account_name}` : ""}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge value={data.quote_stage} />
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                    <Tag size={11} />
                    {formatMoney(total)}
                  </span>
                </div>
              </div>
            </div>

            <Section title="Quote Details">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                <Field label="Stage" icon={Tag} value={formatValue(data.quote_stage)} />
                <Field label="Subject" icon={FileText} value={formatValue(data.subject)} />
                <Field label="Contact" icon={Users} value={formatValue(data.contact_name)} />
                <Field label="Valid Until" icon={Calendar} value={formatValue(data.valid_until)} />
                <Field label="Assigned To" icon={Users} value={formatValue(data.assigned_to_name || data.assignedTo)} />
                <Field label="Deal" icon={FileText} value={formatValue(data.deal_name || data.deal)} />
              </div>
            </Section>

            <Section title="Line Items">
              <div className="space-y-3">
                {products.length > 0 ? products.map((item, index) => (
                  <div key={item.id || `${item.product}-${index}`} className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">{item.product || `Product ${index + 1}`}</p>
                        <p className="text-sm text-[#64748B] mt-1">{item.description || "—"}</p>
                      </div>
                      <p className="text-sm font-semibold text-[#111827]">{formatMoney(item.total)}</p>
                    </div>
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
                      <p className="text-[#64748B]">Qty: <span className="text-[#111827]">{item.quantity || 1}</span></p>
                      <p className="text-[#64748B]">Price: <span className="text-[#111827]">{formatMoney(item.list_price)}</span></p>
                      <p className="text-[#64748B]">Discount: <span className="text-[#111827]">{item.discount || 0}%</span></p>
                      <p className="text-[#64748B]">Tax: <span className="text-[#111827]">{item.tax || 0}%</span></p>
                      <p className="text-[#64748B]">Amount: <span className="text-[#111827]">{formatMoney(item.amount)}</span></p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-[#64748B]">No line items found.</p>
                )}
              </div>
            </Section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AddressBlock title="Billing Address" address={data.billing_address || data.billingAddress} />
              <AddressBlock title="Shipping Address" address={data.shipping_address || data.shippingAddress} />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#F0F2F5] flex items-center justify-between">
            <p className="text-xs text-[#9CA3AF]">Valid until {data.valid_until || "—"}</p>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#374151] font-medium hover:bg-[#F9FAFB] transition"
              >
                Close
              </button>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(data);
                  }}
                  className="h-10 px-5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.98] transition text-white text-sm font-semibold flex items-center gap-2 shadow-sm"
                >
                  <Pencil size={13} />
                  Edit Quote
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
