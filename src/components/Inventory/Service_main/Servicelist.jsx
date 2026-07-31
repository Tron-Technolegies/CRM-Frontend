import { useState } from "react";
import useService from "../../../hooks/useService";
import { Eye, Pencil, Trash2, X } from "lucide-react";

function DeleteConfirmModal({ onCancel, onConfirm, deleting }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-start justify-between px-6 pt-6">
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">
              Delete service?
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

const billingTypeLabels = {
  fixed: "Fixed Price",
  hourly: "Hourly",
  daily: "Daily",
  monthly: "Monthly",
  yearly: "Yearly",
};

export default function ServiceList({ onAdd, onEdit, onView }) {
  const { services, loading, error, removeService } = useService();
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const handleConfirmDelete = async () => {
    const id = deleteTargetId;
    setDeletingId(id);
    try {
      await removeService(id);
      setDeleteTargetId(null);
    } catch (err) {
      console.error("DELETE SERVICE ERROR:", err);
      alert("Could not delete this service. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">Services</h1>
        <button
          type="button"
          onClick={onAdd}
          className="px-4 h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
        >
          Add Service
        </button>
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
              <th className="text-left px-4 py-3 font-medium">Service Name</th>
              <th className="text-left px-4 py-3 font-medium">Service Code</th>
              <th className="text-left px-4 py-3 font-medium">Category</th>
              <th className="text-left px-4 py-3 font-medium">Unit Price</th>
              <th className="text-left px-4 py-3 font-medium">Billing Type</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-[#6B7280]">
                  Loading services...
                </td>
              </tr>
            )}

            {!loading && services.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-[#6B7280]">
                  No services yet. Click "Add Service" to create one.
                </td>
              </tr>
            )}

            {!loading &&
              services.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => onView(s.id)}
                  className="border-t border-[#E5E7EB] hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3 text-[#111827]">{s.serviceName}</td>
                  <td className="px-4 py-3 text-[#111827]">{s.serviceCode}</td>
                  <td className="px-4 py-3 text-[#6B7280]">
                    {s.category || "-"}
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">
                    {typeof s.unitPrice === "number"
                      ? s.unitPrice.toFixed(2)
                      : s.unitPrice || "-"}
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">
                    {billingTypeLabels[s.billingType] || s.billingType || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        s.status === "active"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-[#6B7280]"
                      }`}
                    >
                      {s.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => onView(s.id)}
                        className="text-[#6B7280] hover:text-[#111827]"
                        aria-label="View service"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(s.id)}
                        className="text-blue-600 hover:text-blue-700"
                        aria-label="Edit service"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(s.id)}
                        className="text-red-600 hover:text-red-700"
                        aria-label="Delete service"
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