import { useEffect, useState } from "react";
import useInvoices from "../../../hooks/useInvoices";
import { downloadInvoicePdf } from "../../../api/invoice";
import { Eye, Pencil, Trash2, X, Search, Download } from "lucide-react";
import { Plus } from "lucide-react";
import Pagination from "../../Pagination";
import usePagination from "../../../api/usePagination";

function DeleteConfirmModal({ onCancel, onConfirm, deleting }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-start justify-between px-6 pt-6">
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">Delete invoice?</h2>
            <p className="text-sm text-[#6B7280] mt-1">This action cannot be undone.</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-9 h-9 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-gray-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex justify-end gap-3 px-6 py-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 h-11 rounded-xl border border-[#E5E7EB] text-[#111827] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="px-5 h-11 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InvoiceList({ onAdd, onEdit, onView }) {
  const { invoices, loading, error, removeInvoice } = useInvoices();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const filteredInvoices = (invoices || []).filter((inv) => {
    const q = search.toLowerCase();
    return (
      inv.subject?.toLowerCase().includes(q) ||
      inv.invoiceNumber?.toLowerCase().includes(q) ||
      inv.customer?.toLowerCase().includes(q)
    );
  });

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData: paginatedInvoices,
    changePage,
    resetPage,
  } = usePagination(filteredInvoices, 8);

  useEffect(() => {
    resetPage();
  }, [search]);

  const handleConfirmDelete = async () => {
    const id = deleteTargetId;
    setDeletingId(id);
    try {
      await removeInvoice(id);
      setDeleteTargetId(null);
    } catch (err) {
      console.error("DELETE INVOICE ERROR:", err);
      alert("Could not delete this invoice. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (inv) => {
    setDownloadingId(inv.id);
    try {
      await downloadInvoicePdf(inv.id, inv.invoiceNumber);
    } catch (err) {
      console.error("DOWNLOAD INVOICE PDF ERROR:", err);
      alert("Could not download the invoice PDF. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const statusStyles = {
    draft: "bg-gray-100 text-[#6B7280]",
    sent: "bg-blue-50 text-blue-700",
    paid: "bg-green-50 text-green-700",
    overdue: "bg-red-50 text-red-700",
    cancelled: "bg-gray-100 text-[#6B7280]",
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">Invoices</h1>
        <button
          type="button"
          onClick={() => onAdd?.()}
          className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Create Invoice
        </button>
      </div>

      <div className="mb-4 flex h-11 w-full max-w-sm items-center gap-3 rounded-xl border border-[#E5E7EB] px-4">
        <Search size={18} className="text-[#6B7280]" />
        <input
          type="text"
          placeholder="Search by subject, number or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 text-[#374151]">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Subject</th>
              <th className="text-left px-4 py-3 font-medium">Invoice #</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Invoice Date</th>
              <th className="text-left px-4 py-3 font-medium">Customer</th>
              <th className="text-left px-4 py-3 font-medium">Owner</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-[#6B7280]">
                  Loading invoices...
                </td>
              </tr>
            )}

            {!loading && paginatedInvoices.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-[#6B7280]">
                  No invoices found.
                </td>
              </tr>
            )}

            {!loading &&
              paginatedInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => onView?.(inv.id)}
                  className="border-t border-[#E5E7EB] hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3 text-[#111827]">{inv.subject}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${statusStyles[inv.status] || "bg-gray-100 text-[#6B7280]"}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">{inv.invoiceDate}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{inv.customer}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{inv.owner}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-3">
                      <button type="button" onClick={() => onView?.(inv.id)} className="text-[#6B7280] hover:text-[#111827]" aria-label="View invoice">
                        <Eye size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload(inv)}
                        disabled={downloadingId === inv.id}
                        className="text-[#6B7280] hover:text-[#111827] disabled:opacity-50"
                        aria-label="Download invoice PDF"
                      >
                        <Download size={18} />
                      </button>
                      <button type="button" onClick={() => onEdit?.(inv.id)} className="text-blue-600 hover:text-blue-700" aria-label="Edit invoice">
                        <Pencil size={18} />
                      </button>
                      <button type="button" onClick={() => setDeleteTargetId(inv.id)} className="text-red-600 hover:text-red-700" aria-label="Delete invoice">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          itemName="invoices"
          onPageChange={changePage}
        />
      </div>

      {deleteTargetId && (
        <DeleteConfirmModal
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={handleConfirmDelete}
          deleting={deletingId === deleteTargetId}
        />
      )}
    </div>
  );
}