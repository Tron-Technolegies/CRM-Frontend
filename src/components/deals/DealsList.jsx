import { useMemo, useState } from "react";
import { Eye, MoreVertical, Pencil, Search, SlidersHorizontal } from "lucide-react";
import { useToast } from "../ui/toastContext.js";

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
    case "Won":
      return "bg-emerald-50 text-emerald-600";
    case "Lost":
      return "bg-rose-50 text-rose-600";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function statusStyles(status) {
  switch (status) {
    case "Open":
      return "bg-emerald-50 text-emerald-600";
    case "Won":
      return "bg-emerald-50 text-emerald-600";
    case "Lost":
      return "bg-rose-50 text-rose-600";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function DealsList({ deals }) {
  const { pushToast } = useToast();
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("All");
  const [status, setStatus] = useState("All");
  const [assignedTo, setAssignedTo] = useState("All");

  const stageOptions = useMemo(() => {
    const unique = Array.from(new Set(deals.map((d) => d.stage))).filter(Boolean);
    return ["All", ...unique];
  }, [deals]);

  const statusOptions = useMemo(() => {
    const unique = Array.from(new Set(deals.map((d) => d.status))).filter(Boolean);
    return ["All", ...unique];
  }, [deals]);

  const assignedOptions = useMemo(() => {
    const unique = Array.from(new Set(deals.map((d) => d.assignedTo))).filter(Boolean);
    return ["All", ...unique];
  }, [deals]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return deals.filter((d) => {
      const matchesQuery = !q || [d.name, d.customer].filter(Boolean).some((v) => v.toLowerCase().includes(q));
      const matchesStage = stage === "All" || d.stage === stage;
      const matchesStatus = status === "All" || d.status === status;
      const matchesAssigned = assignedTo === "All" || d.assignedTo === assignedTo;
      return matchesQuery && matchesStage && matchesStatus && matchesAssigned;
    });
  }, [deals, query, stage, status, assignedTo]);

  const openNotImplemented = (label) => {
    pushToast({ title: `${label} not implemented`, message: "Wire this to your backend later.", variant: "info" });
  };

  const totalCount = 72;
  const pageSize = 8;
  const visibleCount = Math.min(pageSize, filtered.length);

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
              <option key={o} value={o}>
                Stage: {o}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white cursor-pointer"
          >
            {statusOptions.map((o) => (
              <option key={o} value={o}>
                Status: {o}
              </option>
            ))}
          </select>

          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white cursor-pointer"
          >
            {assignedOptions.map((o) => (
              <option key={o} value={o}>
                Assigned To: {o}
              </option>
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
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Customer</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Stage</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Value</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Expected Close Date</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Assigned To</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Status</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EEF2F7]">
            {filtered.slice(0, pageSize).map((deal) => (
              <tr key={deal.id} className="hover:bg-[#FAFAFA]">
                <td className="px-6 py-5">
                  <p className="text-sm font-medium text-[#111827]">{deal.name}</p>
                </td>

                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{deal.customer}</p>
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
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm ${statusStyles(deal.status)}`}>
                    {deal.status}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-3 text-[#64748B]">
                    <button
                      type="button"
                      className="hover:text-[#111827] cursor-pointer"
                      aria-label="View"
                      onClick={() => openNotImplemented("View")}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      type="button"
                      className="hover:text-[#111827] cursor-pointer"
                      aria-label="Edit"
                      onClick={() => openNotImplemented("Edit")}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      type="button"
                      className="hover:text-[#111827] cursor-pointer"
                      aria-label="More"
                      onClick={() => openNotImplemented("More")}
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-sm text-[#64748B]">
                  No deals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-[#64748B]">
          Showing 1 to {visibleCount} of {totalCount} deals
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-9 h-9 rounded-lg border border-[#E5E7EB] grid place-items-center text-[#111827] cursor-pointer"
            onClick={() => openNotImplemented("Previous page")}
            aria-label="Previous page"
          >
            ‹
          </button>
          <button type="button" className="w-9 h-9 rounded-lg bg-blue-600 text-white grid place-items-center cursor-pointer">
            1
          </button>
          {["2", "3"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => openNotImplemented(`Page ${p}`)}
              className="w-9 h-9 rounded-lg border border-[#E5E7EB] text-[#111827] grid place-items-center cursor-pointer"
            >
              {p}
            </button>
          ))}
          <span className="px-2 text-[#64748B]">…</span>
          <button
            type="button"
            onClick={() => openNotImplemented("Page 9")}
            className="w-9 h-9 rounded-lg border border-[#E5E7EB] text-[#111827] grid place-items-center cursor-pointer"
          >
            9
          </button>
          <button
            type="button"
            className="w-9 h-9 rounded-lg border border-[#E5E7EB] grid place-items-center text-[#111827] cursor-pointer"
            onClick={() => openNotImplemented("Next page")}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
