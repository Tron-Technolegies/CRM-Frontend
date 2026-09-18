import { Eye, Pencil, Trash2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import Pagination from "../../Pagination";
import usePagination from "../../../api/usePagination";
import { lineTotal } from "../../../utils/salesOrderMapping";
import usePermissions from "../../../permissions/usePermissions";

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
  const { hasPermission } = usePermissions();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const searchText = search.trim().toLowerCase();

  const filtered = (orders || []).filter((order) => {
    const matchesSearch =
      !searchText ||
      order.id?.toString().toLowerCase().includes(searchText) ||
      order.subject?.toLowerCase().includes(searchText) ||
      order.customer?.toLowerCase().includes(searchText) ||
      order.deal?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" || order.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
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
  }, [search, statusFilter]);

  const getStatusBadge = (status) => {
    const label = STATUS_LABELS[status] || status || "Created";
    const colors = {
      created: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
      approved: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
      delivered: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
      cancelled: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
          colors[String(status).toLowerCase()] || colors.created
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
        {label}
      </span>
    );
  };

  return (
    <div className="max-w-full">
      <div className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden">
        <div className="px-6 md:px-12 py-5 border-b border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="h-12 w-full xl:w-[340px] rounded-xl border border-[#E5E7EB] px-4 flex items-center gap-3">
              <Search size={18} className="text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search by Subject, Deal, or Customer..."
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
                <option value="created">Status: Created</option>
                <option value="approved">Status: Approved</option>
                <option value="delivered">Status: Delivered</option>
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
                <th className="px-5 py-4 text-left text-sm font-medium tracking-wide text-[#64748B]">Status</th>
                <th className="px-5 py-4 text-left text-sm font-medium tracking-wide text-[#64748B]">Grand Total</th>
                <th className="px-5 py-4 text-left text-sm font-medium tracking-wide text-[#64748B]">Deal Name</th>
                <th className="px-5 py-4 text-left text-sm font-medium tracking-wide text-[#64748B]">Customer</th>
                <th className="px-5 py-4 text-left text-sm font-medium tracking-wide text-[#64748B]">Order Owner</th>
                <th className="px-5 py-4 text-center text-sm font-medium tracking-wide text-[#64748B]">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    Loading sales orders...
                  </td>
                </tr>
              ) : paginated.length > 0 ? (
                paginated.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => onView?.(order.id)}
                    className="hover:bg-gray-50 border-b border-gray-200 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">{order.subject}</td>
                    <td className="px-5 py-4 text-sm font-medium">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-700">
                      {formatCurrency(computeGrandTotal(order))}
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-700">{order.deal || "—"}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-700">{order.customer || "—"}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-700">{order.owner || "—"}</td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => onView?.(order.id)}
                          className="text-gray-700 hover:text-blue-600 transition"
                          aria-label="View sales order"
                        >
                          <Eye size={18} />
                        </button>
                        {hasPermission("salesorder.edit") && (
                          <button
                            type="button"
                            onClick={() => onEdit?.(order.id)}
                            className="text-gray-700 hover:text-blue-600 transition"
                            aria-label="Edit sales order"
                          >
                            <Pencil size={18} />
                          </button>
                        )}
                        {hasPermission("salesorder.delete") && (
                          <button
                            type="button"
                            onClick={() => onDelete?.(order.id)}
                            className="text-gray-700 hover:text-red-600 transition"
                            aria-label="Delete sales order"
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
                    No sales orders found
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
          itemName="sales orders"
          onPageChange={changePage}
        />
      </div>
    </div>
  );
};

export default SalesOrdersTable;