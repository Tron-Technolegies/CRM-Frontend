import { useEffect, useState } from "react";
import useInvoices from "../../../hooks/useInvoices";
import { downloadInvoicePdf } from "../../../api/invoice";
import { Eye, Pencil, Trash2, Search, Download, Plus } from "lucide-react";
import Pagination from "../../Pagination";
import usePagination from "../../../api/usePagination";
import usePermissions from "../../../permissions/usePermissions";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { useToast } from "../../ui/toastContext";

const STATUS_LABELS = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export default function InvoiceList({ onAdd, onEdit, onView }) {
  const { pushToast } = useToast();
  const { hasPermission } = usePermissions();
  const { invoices, loading, error, removeInvoice } = useInvoices();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const filteredInvoices = (invoices || []).filter((inv) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      inv.subject?.toLowerCase().includes(q) ||
      inv.invoiceNumber?.toLowerCase().includes(q) ||
      inv.customer?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all" || inv.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData: paginatedInvoices,
    changePage,
    resetPage,
  } = usePagination(filteredInvoices, 10);

  useEffect(() => {
    resetPage();
  }, [search, statusFilter]);

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    try {
      await removeInvoice(deleteTargetId);
      pushToast({
        title: "Invoice deleted",
        variant: "success",
      });
      setDeleteTargetId(null);
    } catch (err) {
      console.error("DELETE INVOICE ERROR:", err);
      pushToast({
        title: "Failed to delete invoice",
        variant: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDownload = async (inv) => {
    setDownloadingId(inv.id);
    try {
      await downloadInvoicePdf(inv.id, inv.invoiceNumber);
      pushToast({
        title: "PDF Downloaded",
        message: `Invoice #${inv.invoiceNumber} downloaded`,
        variant: "success",
      });
    } catch (err) {
      console.error("DOWNLOAD INVOICE PDF ERROR:", err);
      pushToast({
        title: "Failed to download PDF",
        variant: "error",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const label = STATUS_LABELS[status] || status || "Draft";
    const colors = {
      draft: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
      sent: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
      paid: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
      overdue: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
      cancelled: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
          colors[String(status).toLowerCase()] || colors.draft
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-[#111827]">Invoices</h1>
        {hasPermission("invoice.create") && (
          <button
            type="button"
            onClick={() => onAdd?.()}
            className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2 cursor-pointer"
          >
            <Plus size={18} />
            Add Invoice
          </button>
        )}
      </div>

      <div className="max-w-full">
        <div className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden">
          <div className="px-6 md:px-12 py-5 border-b border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="h-12 w-full xl:w-[340px] rounded-xl border border-[#E5E7EB] px-4 flex items-center gap-3">
                <Search size={18} className="text-[#6B7280]"/>
                <input
                  type="text"
                  placeholder="Search by subject, number or customer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none w-full text-sm cursor-text"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white cursor-pointer outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="all">Status: All</option>
                  <option value="draft">Status: Draft</option>
                  <option value="sent">Status: Sent</option>
                  <option value="paid">Status: Paid</option>
                  <option value="overdue">Status: Overdue</option>
                  <option value="cancelled">Status: Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="m-6 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  <th className="px-5 py-4 text-left text-sm font-medium tracking-wide text-[#64748B]">Subject</th>
                  <th className="px-5 py-4 text-left text-sm font-medium tracking-wide text-[#64748B]">Invoice #</th>
                  <th className="px-5 py-4 text-left text-sm font-medium tracking-wide text-[#64748B]">Status</th>
                  <th className="px-5 py-4 text-left text-sm font-medium tracking-wide text-[#64748B]">Invoice Date</th>
                  <th className="px-5 py-4 text-left text-sm font-medium tracking-wide text-[#64748B]">Customer</th>
                  <th className="px-5 py-4 text-left text-sm font-medium tracking-wide text-[#64748B]">Owner</th>
                  <th className="px-5 py-4 text-center text-sm font-medium tracking-wide text-[#64748B]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      Loading invoices...
                    </td>
                  </tr>
                ) : paginatedInvoices.length > 0 ? (
                  paginatedInvoices.map((inv) => (
                    <tr
                      key={inv.id}
                      onClick={() => onView?.(inv.id)}
                      className="hover:bg-gray-50 border-b border-gray-200 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">{inv.subject}</td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-700">{inv.invoiceNumber}</td>
                      <td className="px-5 py-4 text-sm font-medium">
                        {getStatusBadge(inv.status)}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-700">{inv.invoiceDate || "—"}</td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-700">{inv.customer || "—"}</td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-700">{inv.owner || "—"}</td>
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => onView?.(inv.id)}
                            className="text-gray-700 hover:text-blue-600 transition"
                            aria-label="View invoice"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownload(inv)}
                            disabled={downloadingId === inv.id}
                            className="text-gray-700 hover:text-blue-600 transition disabled:opacity-50"
                            aria-label="Download invoice PDF"
                          >
                            <Download size={18} />
                          </button>
                          {hasPermission("invoice.edit") && (
                            <button
                              type="button"
                              onClick={() => onEdit?.(inv.id)}
                              className="text-gray-700 hover:text-blue-600 transition"
                              aria-label="Edit invoice"
                            >
                              <Pencil size={18} />
                            </button>
                          )}
                          {hasPermission("invoice.delete") && (
                            <button
                              type="button"
                              onClick={() => setDeleteTargetId(inv.id)}
                              className="text-gray-700 hover:text-red-600 transition"
                              aria-label="Delete invoice"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            itemName="invoices"
            onPageChange={changePage}
          />
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTargetId}
        title="Delete invoice?"
        description="This action cannot be undone."
        confirmText="Delete"
        danger
        loading={deleteLoading}
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}