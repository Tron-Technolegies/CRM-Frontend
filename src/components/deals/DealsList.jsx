import { useEffect, useMemo, useState } from "react";
import { Eye, MoreVertical, Pencil, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { useToast } from "../ui/toastContext.js";
import DealViewModal from "./DealViewModal.jsx";
import Pagination from "../Pagination";
import usePagination from "../../api/usePagination";

function formatCurrency(value) {
  const n = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function stageStyles(stage) {
  switch (stage) {
    case "Proposal":
      return "bg-blue-50 text-blue-600";
    case "Negotiation":
      return "bg-amber-50 text-amber-700";
    case "Discussion":
      return "bg-slate-100 text-slate-700";
    case "Demo":
      return "bg-violet-50 text-violet-600";
    case "Won":
      return "bg-emerald-50 text-emerald-600";
    case "Lost":
      return "bg-rose-50 text-rose-600";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function priorityStyles(priority) {
  switch (priority) {
    case "High":
      return "bg-rose-50 text-rose-600";
    case "Medium":
      return "bg-amber-50 text-amber-700";
    case "Low":
      return "bg-green-50 text-green-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function DealsList({ deals, onDelete, onEdit }) {
  const { pushToast } = useToast();
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("All");
  const [assignedTo, setAssignedTo] = useState("All");

  const [viewId, setViewId] = useState(null);

  const stageOptions = useMemo(() => {
    const unique = Array.from(new Set(deals.map((d) => d.stage))).filter(Boolean);
    return ["All", ...unique];
  }, [deals]);

  const assignedOptions = useMemo(() => {
    const unique = Array.from(new Set(deals.map((d) => d.assignedTo))).filter(Boolean);
    return ["All", ...unique];
  }, [deals]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return deals.filter((d) => {
      const matchesQuery = !q || [d.name, d.company_name].filter(Boolean).some((v) => v.toLowerCase().includes(q));
      const matchesStage = stage === "All" || d.stage === stage;
      const matchesAssigned = assignedTo === "All" || d.assignedTo === assignedTo;
      return matchesQuery && matchesStage && matchesAssigned;
    });
  }, [deals, query, stage, assignedTo]);

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
  }, [query, stage, assignedTo]);

  const openNotImplemented = (label) => {
    pushToast({ title: `${label} not implemented`, message: "Wire this to your backend later.", variant: "info" });
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
      {/* Filters */}
      <div className="p-5 border-b border-[#EEF2F7] flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="h-12 w-full xl:w-[340px] rounded-xl border border-[#E5E7EB] px-4 flex items-center gap-3">
          <Search size={18} className="text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search deals..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-sm cursor-text"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white cursor-pointer"
          >
            {stageOptions.map((o) => (
              <option key={o} value={o}>Stage: {o}</option>
            ))}
          </select>

          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white cursor-pointer"
          >
            {assignedOptions.map((o) => (
              <option key={o} value={o}>Assigned To: {o}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => openNotImplemented("More filters")}
            className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white flex items-center gap-2 hover:bg-[#F8FAFC] transition cursor-pointer"
          >
            <SlidersHorizontal size={16} className="text-[#64748B]" />
            More Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px]">
          <thead className="border-b border-[#EEF2F7]">
            <tr>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Deal Name</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Company Name</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Stage</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Priority</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Value</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Expected Close Date</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Assigned To</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Related To</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EEF2F7]">
            {paginated.map((deal) => (
              <tr
                key={deal.id}
                onClick={() => setViewId(deal.id)}
                className="hover:bg-[#FAFAFA] cursor-pointer"
              >
                <td className="px-6 py-5">
                  <p className="text-sm font-medium text-[#111827]">{deal.name}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{deal.company_name}</p>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm ${stageStyles(deal.stage)}`}>
                    {deal.stage}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm ${priorityStyles(deal.priority)}`}>
                    {deal.priority || "—"}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{formatCurrency(deal.value)}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{formatDate(deal.expectedCloseDate)}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{deal.assignedTo}</p>
                </td>
                <td className="px-6 py-5">
                  {deal.relatedTo ? (
                    <span className="text-sm text-[#111827]">
                      {deal.relatedTo.name}
                      <span className="text-xs text-[#9CA3AF] ml-1 capitalize">
                        ({deal.relatedTo.type})
                      </span>
                    </span>
                  ) : (
                    <span className="text-sm text-[#D1D5DB]">—</span>
                  )}
                </td>
                <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-3 text-[#64748B]">
                    <button type="button" className="hover:text-[#111827] cursor-pointer" aria-label="View" onClick={() => setViewId(deal.id)}><Eye size={18} /></button>
                    <button type="button" className="hover:text-[#111827] cursor-pointer" aria-label="Edit" onClick={() => onEdit(deal)}><Pencil size={18} /></button>
                    {/* <button type="button" className="hover:text-[#111827] cursor-pointer" aria-label="More" onClick={() => openNotImplemented("More")}><MoreVertical size={18} /></button> */}
                    <button type="button" className="hover:text-red-600 cursor-pointer" aria-label="Delete" onClick={() => onDelete(deal.id)}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-10 text-sm text-[#64748B]">No deals found.</td>
              </tr>
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
        itemName="deals"
        onPageChange={changePage}
      />

      <DealViewModal
        open={!!viewId}
        onClose={() => setViewId(null)}
        dealId={viewId}
        onEdit={(deal) => { setViewId(null); onEdit(deal); }}
        onConvertSuccess={() => window.location.reload()}
      />
    </div>
  );
}