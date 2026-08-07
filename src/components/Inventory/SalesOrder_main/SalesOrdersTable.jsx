import { Eye, Pencil, Trash2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import Pagination from "../../Pagination";
import usePagination from "../../../api/usePagination";
import { lineTotal } from "../../../utils/salesOrderMapping";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value || 0);

const STATUS_LABELS = {
  created: "Created",
  approved: "Approved",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const computeGrandTotal = (order) =>
  (order.items || []).reduce((sum, item) => sum + lineTotal(item), 0);

const SalesOrdersTable = ({ orders = [], loading = false, error = null, onEdit, onView, onDelete }) => {
  const [search, setSearch] = useState("");
  const searchText = search.trim().toLowerCase();

  const filtered = (orders || []).filter((order) => {
    if (!searchText) return true;
    return (
      order.id?.toString().includes(searchText) ||
      order.subject?.toLowerCase().includes(searchText) ||
      order.customer?.toLowerCase().includes(searchText) ||
      order.deal?.toLowerCase().includes(searchText)
    );
  });

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData: paginated,
    changePage,
    resetPage,
  } = usePagination(filtered, 10);

  useEffect(() => {
    resetPage();
  }, [search]);

  return (
    <div className="p-6">
      {/* Search */}
      <div className="mb-4 flex h-11 w-full max-w-sm items-center gap-3 rounded-xl border border-[#E5E7EB] px-4">
        <Search size={18} className="text-[#6B7280]" />
        <input
          type="text"
          placeholder="Search by Subject, Deal, or Customer..."
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
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Grand Total</th>
              <th className="text-left px-4 py-3 font-medium">Deal Name</th>
              <th className="text-left px-4 py-3 font-medium">Customer</th>
              <th className="text-left px-4 py-3 font-medium">Order Owner</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-[#6B7280]">
                  Loading sales orders...
                </td>
              </tr>
            )}

            {!loading && paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-[#6B7280]">
                  No sales orders found.
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
                  <td className="px-4 py-3 text-[#111827]">{order.subject}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        order.status === "delivered"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-[#6B7280]"
                      }`}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">{formatCurrency(computeGrandTotal(order))}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{order.deal}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{order.customer}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{order.owner}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => onView?.(order.id)}
                        className="text-[#6B7280] hover:text-[#111827]"
                        aria-label="View sales order"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit?.(order.id)}
                        className="text-blue-600 hover:text-blue-700"
                        aria-label="Edit sales order"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete?.(order.id)}
                        className="text-red-600 hover:text-red-700"
                        aria-label="Delete sales order"
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
          itemName="sales orders"
          onPageChange={changePage}
        />
      </div>
    </div>
  );
};

export default SalesOrdersTable;