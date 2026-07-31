import { Eye, Pencil, Trash2, Search } from "lucide-react";
import { useState } from "react";
import Pagination from "../../Pagination";
import { lineTotal } from "../../../utils/purchaseOrderMapping";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value || 0);

const STATUS_LABELS = {
  created: "Created",
  sent: "Sent",
  confirmed: "Confirmed",
  partially_received: "Partially Received",
  received: "Received",
  cancelled: "Cancelled",
};

const computeGrandTotal = (order) =>
  (order.items || []).reduce((sum, item) => sum + lineTotal(item), 0);

const PurchaseOrdersTable = ({ orders = [], loading = false, error = null, onEdit, onView, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const searchText = search.trim().toLowerCase();

  const filtered = (orders || []).filter((order) => {
    if (!searchText) return true;
    return (
      order.id?.toString().includes(searchText) ||
      order.subject?.toLowerCase().includes(searchText) ||
      order.purchaseOrderNumber?.toLowerCase().includes(searchText) ||
      order.vendor?.toLowerCase().includes(searchText)
    );
  });

  const itemsPerPage = 10;
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6">
      {/* Search */}
      <div className="mb-4 flex h-11 w-full max-w-sm items-center gap-3 rounded-xl border border-[#E5E7EB] px-4">
        <Search size={18} className="text-[#6B7280]" />
        <input
          type="text"
          placeholder="Search by Subject, PO Number, or Vendor..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
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
              <th className="text-left px-4 py-3 font-medium">PO Number</th>
              <th className="text-left px-4 py-3 font-medium">Subject</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Grand Total</th>
              <th className="text-left px-4 py-3 font-medium">Vendor</th>
              <th className="text-left px-4 py-3 font-medium">Purchase Date</th>
              <th className="text-left px-4 py-3 font-medium">Owner</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-[#6B7280]">
                  Loading purchase orders...
                </td>
              </tr>
            )}

            {!loading && paginated.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-[#6B7280]">
                  No purchase orders found.
                </td>
              </tr>
            )}

            {!loading &&
              paginated.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => onView?.(order.id)}
                  className="border-t border-[#E5E7EB] hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3 text-[#111827]">{order.purchaseOrderNumber}</td>
                  <td className="px-4 py-3 text-[#111827]">{order.subject}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        order.status === "received"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-[#6B7280]"
                      }`}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">{formatCurrency(computeGrandTotal(order))}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{order.vendor}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{order.purchaseDate}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{order.owner}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => onView?.(order.id)}
                        className="text-[#6B7280] hover:text-[#111827]"
                        aria-label="View purchase order"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit?.(order.id)}
                        className="text-blue-600 hover:text-blue-700"
                        aria-label="Edit purchase order"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete?.(order.id)}
                        className="text-red-600 hover:text-red-700"
                        aria-label="Delete purchase order"
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
          itemName="purchase orders"
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default PurchaseOrdersTable;