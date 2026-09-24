import { useEffect, useState } from "react";
import { FileText, Pencil, Download, Tag, Calendar, Users, MapPin } from "lucide-react";
import Modal from "../../ui/Modal";
import AuditHistory from "../../ui/AuditHistory";
import { getInvoice, downloadInvoicePdf } from "../../../api/invoice";
import usePermissions from "../../../permissions/usePermissions";
import { useToast } from "../../ui/toastContext";

function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(value || 0));
}

function Badge({ value }) {
  const label = String(value || "draft");
  const colors = {
    draft: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    sent: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    paid: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    overdue: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    cancelled: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
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
      <p className={`text-sm font-medium leading-snug ${value ? "text-[#111827]" : "text-[#D1D5DB]"}`}>{value || "—"}</p>
    </div>
  );
}

export default function InvoiceViewModal({ invoiceId, onClose, onEdit }) {
  const { pushToast } = useToast();
  const { hasPermission } = usePermissions();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!invoiceId) return;

    const fetchInvoice = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getInvoice(invoiceId);
        setInvoice(data);
      } catch (err) {
        console.error("FETCH INVOICE (view) ERROR:", err);
        setError("Could not load this invoice.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  const handleDownload = async () => {
    if (!invoice) return;
    setDownloading(true);
    try {
      await downloadInvoicePdf(invoice.id, invoice.invoiceNumber);
      pushToast({
        title: "PDF Downloaded",
        message: `Invoice #${invoice.invoiceNumber} downloaded`,
        variant: "success",
      });
    } catch (err) {
      console.error("DOWNLOAD INVOICE PDF ERROR:", err);
      pushToast({
        title: "Failed to download PDF",
        variant: "error",
      });
    } finally {
      setDownloading(false);
    }
  };

  if (!invoiceId) return null;

  const items = Array.isArray(invoice?.items) ? invoice.items : [];
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.lineTotal) || 0), 0);

  return (
    <Modal
      open={Boolean(invoiceId)}
      title="Invoice Details"
      subtitle="Full profile for this invoice"
      onClose={onClose}
      maxWidthClassName="max-w-4xl"
    >
      {loading && <div className="py-12 text-center text-sm text-[#6B7280]">Loading invoice details...</div>}

      {error && (
        <div className="py-8 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center">
            <span className="text-rose-500 text-xl font-bold">!</span>
          </div>
          <p className="text-sm font-medium text-[#111827]">{error}</p>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 h-9 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#374151] font-medium hover:bg-[#F9FAFB] transition"
          >
            Close
          </button>
        </div>
      )}

      {!loading && !error && invoice && (
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-[#F5F0FF] to-white border border-[#E5D9FF]">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
              <FileText size={24} />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className="text-xl font-bold text-[#0F172A] truncate">{invoice.subject || "Untitled Invoice"}</h3>
              <p className="text-sm text-[#6B7280] truncate mt-0.5 font-medium">
                Invoice #{invoice.invoiceNumber} {invoice.customer ? `· ${invoice.customer}` : ""}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge value={invoice.status} />
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                  <Tag size={11} />
                  {formatMoney(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <Section title="Invoice Information">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <Field label="Status" icon={Tag} value={invoice.status} />
              <Field label="Invoice Date" icon={Calendar} value={invoice.invoiceDate} />
              <Field label="Due Date" icon={Calendar} value={invoice.dueDate} />
              <Field label="PO Number" icon={FileText} value={invoice.purchaseOrderNumber} />
              <Field label="Customer" icon={Users} value={invoice.customer} />
              <Field label="Sales Order" icon={FileText} value={invoice.salesOrder} />
              <Field label="Owner" icon={Users} value={invoice.owner} />
            </div>
          </Section>

          {items.length > 0 && (
            <Section title="Line Items">
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={item.id || index} className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">{item.productName || `Item ${index + 1}`}</p>
                        {item.description && <p className="text-sm text-[#64748B] mt-1">{item.description}</p>}
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
                ))}
              </div>
            </Section>
          )}

          {invoice.description && (
            <Section title="Description">
              <p className="text-sm text-[#374151] whitespace-pre-wrap">{invoice.description}</p>
            </Section>
          )}

          <AuditHistory
            lastEditedBy={invoice.lastEditedBy}
            lastEditedAt={invoice.lastEditedAt}
            editHistory={invoice.editHistory}
            modelName="invoice"
            objectId={invoice.id || invoiceId}
          />

          <div className="mt-5 pt-4 border-t border-[#F0F2F5] flex items-center justify-between">
            <span className="text-xs text-[#9CA3AF]">
              {invoice.updatedAt ? `Updated ${invoice.updatedAt.slice(0, 10)}` : "Invoice Overview"}
            </span>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="h-10 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#374151] font-medium hover:bg-[#F9FAFB] transition flex items-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                <Download size={14} />
                {downloading ? "Downloading..." : "Download PDF"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#374151] font-medium hover:bg-[#F9FAFB] transition cursor-pointer"
              >
                Close
              </button>
              {hasPermission("invoice.edit") && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit?.(invoice.id);
                  }}
                  className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition text-white text-sm font-semibold flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Pencil size={13} />
                  Edit Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}