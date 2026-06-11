import { useEffect, useMemo, useState } from "react";
import { Eye, MoreVertical, Pencil, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { useToast } from "../ui/toastContext.js";

const PAGE_SIZE = 8;

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

export default function DealsList({ deals, onDelete, onEdit }) {
  const { pushToast } = useToast();
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("All");
  const [assignedTo, setAssignedTo] = useState("All");
  const [page, setPage] = useState(1);

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

  useEffect(() => {
    setPage(1);
  }, [query, stage, assignedTo]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
        <table className="w-full min-w-[980px]">
          <thead className="border-b border-[#EEF2F7]">
            <tr>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Deal Name</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Company Name</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Stage</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Value</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Expected Close Date</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Assigned To</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EEF2F7]">
            {paginated.map((deal) => (
              <tr key={deal.id} className="hover:bg-[#FAFAFA]">
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
                  <p className="text-sm text-[#111827]">{formatCurrency(deal.value)}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{formatDate(deal.expectedCloseDate)}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{deal.assignedTo}</p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3 text-[#64748B]">
                    <button type="button" className="hover:text-[#111827] cursor-pointer" aria-label="View" onClick={() => openNotImplemented("View")}><Eye size={18} /></button>
                    <button type="button" className="hover:text-[#111827] cursor-pointer" aria-label="Edit" onClick={() => onEdit(deal)}><Pencil size={18} /></button>
                    <button type="button" className="hover:text-[#111827] cursor-pointer" aria-label="More" onClick={() => openNotImplemented("More")}><MoreVertical size={18} /></button>
                    <button type="button" className="hover:text-red-600 cursor-pointer" aria-label="Delete" onClick={() => onDelete(deal.id)}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-sm text-[#64748B]">No deals found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-[#64748B]">
          Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} deals
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-9 h-9 rounded-lg border border-[#E5E7EB] grid place-items-center disabled:opacity-40 cursor-pointer"
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg grid place-items-center text-sm cursor-pointer ${
                p === page ? "bg-blue-600 text-white" : "border border-[#E5E7EB] text-[#111827]"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="w-9 h-9 rounded-lg border border-[#E5E7EB] grid place-items-center disabled:opacity-40 cursor-pointer"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}