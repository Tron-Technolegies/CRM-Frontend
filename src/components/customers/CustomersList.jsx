import { useEffect, useMemo, useState } from "react";
import { Eye, MoreVertical, Pencil, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { useToast } from "../ui/toastContext.js";
import CustomerViewModal from "./CustomerViewModal.jsx";
import Pagination from "../Pagination";
import usePagination from "../../api/usePagination";

function formatCurrency(value) {
  const n = Number(value || 0);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function initials(company) {
  const parts = String(company || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase() || String(company || "?").slice(0, 2).toUpperCase();
}

function statusStyles(status) {
  switch (status) {
    case "Active": return "bg-emerald-50 text-emerald-700";
    case "Inactive": return "bg-rose-50 text-rose-700";
    case "On Hold": return "bg-amber-50 text-amber-700";
    default: return "bg-slate-100 text-slate-700";
  }
}

export default function CustomersList({ customers, onDelete, onEdit }) {
  const { pushToast } = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [industry, setIndustry] = useState("All");

  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [minLtv, setMinLtv] = useState("");
  const [maxLtv, setMaxLtv] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [viewId, setViewId] = useState(null);

  const statusOptions = useMemo(() => {
    const unique = Array.from(new Set(customers.map((c) => c.status))).filter(Boolean);
    return ["All", ...unique];
  }, [customers]);

  const industryOptions = useMemo(() => {
    const unique = Array.from(new Set(customers.map((c) => c.industry))).filter(Boolean);
    return ["All", ...unique];
  }, [customers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const minVal = minLtv !== "" ? Number(minLtv) : null;
    const maxVal = maxLtv !== "" ? Number(maxLtv) : null;

    return customers.filter((c) => {
      const matchesQuery = !q || [c.companyName, c.contactName, c.email, c.phone].filter(Boolean).some((v) => v.toLowerCase().includes(q));
      const matchesStatus = status === "All" || c.status === status;
      const matchesIndustry = industry === "All" || c.industry === industry;
      
      const ltvNum = Number(c.lifetimeValue || 0);
      const matchesMinLtv = minVal === null || ltvNum >= minVal;
      const matchesMaxLtv = maxVal === null || ltvNum <= maxVal;

      let matchesDate = true;
      if (c.joinDate) {
        const cDate = new Date(c.joinDate).getTime();
        if (startDate) {
          matchesDate = matchesDate && cDate >= new Date(startDate).getTime();
        }
        if (endDate) {
          matchesDate = matchesDate && cDate <= new Date(endDate).getTime() + 86400000;
        }
      }

      return matchesQuery && matchesStatus && matchesIndustry && matchesMinLtv && matchesMaxLtv && matchesDate;
    });
  }, [customers, query, status, industry, minLtv, maxLtv, startDate, endDate]);

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData: paginated,
    changePage,
    resetPage,
  } = usePagination(filtered, 8);

  useEffect(() => {
    resetPage();
  }, [query, status, industry, minLtv, maxLtv, startDate, endDate]);

  const resetMoreFilters = () => {
    setMinLtv("");
    setMaxLtv("");
    setStartDate("");
    setEndDate("");
  };

  const hasActiveMoreFilters = minLtv !== "" || maxLtv !== "" || startDate !== "" || endDate !== "";

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
      {/* Filters */}
      <div className="p-5 border-b border-[#EEF2F7] flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="h-12 w-full xl:w-[340px] rounded-xl border border-[#E5E7EB] px-4 flex items-center gap-3">
          <Search size={18} className="text-[#6B7280]" />
          <input type="text" placeholder="Search customers..." value={query} onChange={(e) => setQuery(e.target.value)} className="bg-transparent outline-none w-full text-sm cursor-text" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white cursor-pointer">
            {statusOptions.map((o) => <option key={o} value={o}>Status: {o}</option>)}
          </select>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white cursor-pointer">
            {industryOptions.map((o) => <option key={o} value={o}>Industry: {o}</option>)}
          </select>
          <button
            type="button"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className={`h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm font-medium flex items-center gap-2 transition cursor-pointer ${
              hasActiveMoreFilters ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-white text-[#111827] hover:bg-gray-50"
            }`}
          >
            <SlidersHorizontal size={16} />
            More Filters
            {hasActiveMoreFilters && <span className="w-2 h-2 rounded-full bg-blue-600" />}
          </button>
        </div>
      </div>

      {/* Expanded More Filters panel */}
      {showMoreFilters && (
        <div className="p-5 border-b border-[#EEF2F7] bg-[#FAFAFA] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-[#64748B] mb-1">Min LTV ($)</label>
            <input
              type="number"
              placeholder="0"
              value={minLtv}
              onChange={(e) => setMinLtv(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#E5E7EB] px-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#64748B] mb-1">Max LTV ($)</label>
            <input
              type="number"
              placeholder="10000"
              value={maxLtv}
              onChange={(e) => setMaxLtv(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#E5E7EB] px-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#64748B] mb-1">Join Date From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#E5E7EB] px-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-[#64748B] mb-1">Join Date To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-10 w-full rounded-xl border border-[#E5E7EB] px-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            {hasActiveMoreFilters && (
              <button
                type="button"
                onClick={resetMoreFilters}
                className="h-10 px-3 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer self-end"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead className="border-b border-[#EEF2F7]">
            <tr>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Customer</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Email</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Phone</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Industry</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Status</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Join Date</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EEF2F7]">
            {paginated.map((c) => (
              <tr key={c.id} className="hover:bg-[#FAFAFA] cursor-pointer" onClick={() => setViewId(c.id)}>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] border border-[#E5E7EB] flex items-center justify-center text-sm font-semibold text-[#475569]">
                      {initials(c.companyName)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#111827] truncate">{c.companyName}</p>
                      <p className="text-sm text-[#64748B] truncate">{c.contactName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5"><p className="text-sm text-[#111827]">{c.email}</p></td>
                <td className="px-6 py-5"><p className="text-sm text-[#111827]">{c.phone}</p></td>
                <td className="px-6 py-5"><p className="text-sm text-[#111827]">{c.industry}</p></td>
                <td className="px-6 py-5">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm ${statusStyles(c.status)}`}>{c.status}</span>
                </td>
                <td className="px-6 py-5"><p className="text-sm text-[#64748B]">{formatDate(c.joinDate)}</p></td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3 text-[#64748B]">
                    <button type="button" className="hover:text-[#111827] cursor-pointer" aria-label="View" onClick={(e) => {e.stopPropagation();setViewId(c.id);}}><Eye size={18} /></button>
                    <button type="button" className="hover:text-[#111827] cursor-pointer" aria-label="Edit" onClick={(e) => {e.stopPropagation();onEdit(c);}}><Pencil size={18} /></button>
                    <button type="button" className="hover:text-red-600 cursor-pointer" aria-label="Delete" onClick={(e) => {e.stopPropagation();onDelete(c.id);}}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan={8} className="px-6 py-10 text-sm text-[#64748B]">No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        itemName="customers"
        onPageChange={changePage}
      />

      <CustomerViewModal
      open={!!viewId}
      onClose={() => setViewId(null)} 
      onEdit={onEdit} 
      customerId={viewId} />
    </div>
  );
}