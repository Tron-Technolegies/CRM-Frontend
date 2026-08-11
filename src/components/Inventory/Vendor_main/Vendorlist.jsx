import { useEffect, useState } from "react";
import useVendor from "../../../hooks/useVendor";
import { Eye, Pencil, Trash2, X, Search } from "lucide-react";
import { Plus } from "lucide-react";
import Pagination from "../../Pagination";
import usePagination from "../../../api/usePagination";

function DeleteConfirmModal({ onCancel, onConfirm, deleting }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-start justify-between px-6 pt-6">
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">
              Delete vendor?
            </h2>
            <p className="text-sm text-[#6B7280] mt-1">
              This action cannot be undone.
            </p>
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

export default function VendorList({ onAdd, onEdit, onView }) {
  const { vendors, loading, error, removeVendor } = useVendor();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const filteredVendors = (vendors || []).filter((v) => {
    const q = search.toLowerCase();
    return (
      v.vendorName?.toLowerCase().includes(q) ||
      v.vendorCode?.toLowerCase().includes(q) ||
      v.contactPerson?.toLowerCase().includes(q) ||
      v.email?.toLowerCase().includes(q)
    );
  });

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData: paginatedVendors,
    changePage,
    resetPage,
  } = usePagination(filteredVendors, 8);

  useEffect(() => {
    resetPage();
  }, [search]);

  const handleConfirmDelete = async () => {
    const id = deleteTargetId;
    setDeletingId(id);
    try {
      await removeVendor(id);
      setDeleteTargetId(null);
    } catch (err) {
      console.error("DELETE VENDOR ERROR:", err);
      alert("Could not delete this vendor. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">Vendors</h1>
        <button
          type="button"
          onClick={onAdd}
          className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Vendor
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 flex h-11 w-full max-w-sm items-center gap-3 rounded-xl border border-[#E5E7EB] px-4">
        <Search size={18} className="text-[#6B7280]" />
        <input
          type="text"
          placeholder="Search by name, code, contact or email..."
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
              <th className="text-left px-4 py-3 font-medium">Vendor Name</th>
              <th className="text-left px-4 py-3 font-medium">Vendor Code</th>
              <th className="text-left px-4 py-3 font-medium">Contact Person</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Phone</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-[#6B7280]">
                  Loading vendors...
                </td>
              </tr>
            )}

            {!loading && paginatedVendors.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-[#6B7280]">
                  {vendors.length === 0 ? "No vendors yet. Click \"Add Vendor\" to create one." : "No vendors found."}
                </td>
              </tr>
            )}

            {!loading &&
              paginatedVendors.map((v) => (
                <tr
                  key={v.id}
                  onClick={() => onView(v.id)}
                  className="border-t border-[#E5E7EB] hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3 text-[#111827]">{v.vendorName}</td>
                  <td className="px-4 py-3 text-[#111827]">{v.vendorCode}</td>
                  <td className="px-4 py-3 text-[#6B7280]">
                    {v.contactPerson || "-"}
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">{v.email || "-"}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{v.phone || "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        v.status === "active"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-[#6B7280]"
                      }`}
                    >
                      {v.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => onView(v.id)}
                        className="text-[#6B7280] hover:text-[#111827]"
                        aria-label="View vendor"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(v.id)}
                        className="text-blue-600 hover:text-blue-700"
                        aria-label="Edit vendor"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(v.id)}
                        className="text-red-600 hover:text-red-700"
                        aria-label="Delete vendor"
                      >
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
          itemName="vendors"
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