import { useEffect, useState } from "react";
import { X, FileText, Pencil, Download } from "lucide-react";
import { getInvoice, downloadInvoicePdf } from "../../../api/invoice";

function Badge({ children, dot, dotColor }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-[#E5E7EB] text-[#374151]">
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dotColor }} />}
      {children}
    </span>
  );
}

function DetailField({ label, value }) {
  return (
    <div>
      <div className="text-[11px] font-semibold tracking-wide text-[#9CA3AF] uppercase mb-1">{label}</div>
      <div className="text-sm font-semibold text-[#111827]">{value || "-"}</div>
    </div>
  );
}

const statusDot = {
  draft: "#9CA3AF",
  sent: "#3B82F6",
  paid: "#22C55E",
  overdue: "#EF4444",
  cancelled: "#9CA3AF",
};

export default function InvoiceViewModal({ invoiceId, onClose, onEdit }) {
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
    setDownloading(true);
    try {
      await downloadInvoicePdf(invoice.id, invoice.invoiceNumber);
    } catch (err) {
      console.error("DOWNLOAD INVOICE PDF ERROR:", err);
      alert("Could not download the invoice PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (!invoiceId) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-lg font-semibold text-[#111827]">Invoice Details</h2>
            <p className="text-sm text-[#6B7280] mt-1">Full details for this invoice</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-gray-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {loading && <div className="text-[#6B7280] text-sm">Loading...</div>}

          {error && (
            <div className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && invoice && (
            <>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-[#111827] text-base truncate">{invoice.subject}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge dot dotColor={statusDot[invoice.status] || "#9CA3AF"}>
                      {invoice.status}
                    </Badge>
                    <Badge>{invoice.invoiceNumber}</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-xl bg-[#F9FAFB]">
                <div className="text-[11px] font-semibold tracking-wide text-[#9CA3AF] uppercase mb-3">
                  Invoice Details
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <DetailField label="Invoice Date" value={invoice.invoiceDate} />
                  <DetailField label="Due Date" value={invoice.dueDate} />
                  <DetailField label="PO Number" value={invoice.purchaseOrderNumber} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <DetailField label="Customer" value={invoice.customer} />
                  <DetailField label="Sales Order" value={invoice.salesOrder} />
                  <DetailField label="Owner" value={invoice.owner} />
                </div>
              </div>

              {invoice.items?.length > 0 && (
                <div className="mt-5 p-4 rounded-xl bg-[#F9FAFB]">
                  <div className="text-[11px] font-semibold tracking-wide text-[#9CA3AF] uppercase mb-3">
                    Items
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[#6B7280]">
                        <th className="py-1 font-medium">Product</th>
                        <th className="py-1 font-medium text-center">Qty</th>
                        <th className="py-1 font-medium text-right">Price</th>
                        <th className="py-1 font-medium text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item) => (
                        <tr key={item.id} className="border-t border-[#E5E7EB]">
                          <td className="py-2 text-[#111827]">{item.productName}</td>
                          <td className="py-2 text-center text-[#6B7280]">{item.quantity}</td>
                          <td className="py-2 text-right text-[#6B7280]">{item.listPrice?.toFixed(2)}</td>
                          <td className="py-2 text-right text-[#111827] font-medium">{item.lineTotal?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {invoice.description && (
                <div className="mt-5 p-4 rounded-xl bg-[#F9FAFB]">
                  <div className="text-[11px] font-semibold tracking-wide text-[#9CA3AF] uppercase mb-2">
                    Description
                  </div>
                  <div className="text-sm text-[#111827]">{invoice.description}</div>
                </div>
              )}
            </>
          )}
        </div>

        {!loading && !error && invoice && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
            <span className="text-xs text-[#6B7280]">Updated {invoice.updatedAt?.slice(0, 10)}</span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="px-4 h-11 rounded-xl border border-[#E5E7EB] text-[#111827] hover:bg-gray-50 flex items-center gap-2 disabled:opacity-60"
              >
                <Download size={16} />
                {downloading ? "Downloading..." : "Download PDF"}
              </button>
              <button type="button" onClick={onClose} className="px-4 h-11 rounded-xl border border-[#E5E7EB] text-[#111827] hover:bg-gray-50">
                Close
              </button>
              <button type="button" onClick={() => onEdit?.(invoice.id)} className="px-4 h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
                <Pencil size={16} />
                Edit Invoice
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}