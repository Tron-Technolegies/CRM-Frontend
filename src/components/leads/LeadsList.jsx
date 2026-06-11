import { useEffect, useMemo, useState } from "react";
import { Eye, MoreVertical, Pencil, Search, Trash2 } from "lucide-react";
import { useToast } from "../ui/toastContext.js";

const PAGE_SIZE = 8;

function statusStyles(status) {
  switch (status) {
    case "New":
      return "bg-blue-50 text-blue-600";
    case "Contacted":
      return "bg-amber-50 text-amber-600";
    case "Qualified":
      return "bg-violet-50 text-violet-600";
    case "Converted":
      return "bg-emerald-50 text-emerald-600";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function LeadsList({ leads, onDelete, onEdit }) {
  const { pushToast } = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [source, setSource] = useState("All");
  const [assignedTo, setAssignedTo] = useState("All");
  const [page, setPage] = useState(1);

  const statusOptions = useMemo(() => {
    const unique = Array.from(new Set(leads.map((l) => l.status))).filter(Boolean);
    return ["All", ...unique];
  }, [leads]);

  const sourceOptions = useMemo(() => {
    const unique = Array.from(new Set(leads.map((l) => l.source))).filter(Boolean);
    return ["All", ...unique];
  }, [leads]);

  const assignedOptions = useMemo(() => {
    const unique = Array.from(new Set(leads.map((l) => l.assignedTo))).filter(Boolean);
    return ["All", ...unique];
  }, [leads]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      const matchesQuery =
        !q ||
        [l.name, l.email, l.phone].filter(Boolean).some((v) => v.toLowerCase().includes(q));
      const matchesStatus = status === "All" || l.status === status;
      const matchesSource = source === "All" || l.source === source;
      const matchesAssigned = assignedTo === "All" || l.assignedTo === assignedTo;
      return matchesQuery && matchesStatus && matchesSource && matchesAssigned;
    });
  }, [leads, query, status, source, assignedTo]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [query, status, source, assignedTo]);

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
            placeholder="Search by name, email or phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white"
          >
            {statusOptions.map((o) => (
              <option key={o} value={o}>Status: {o}</option>
            ))}
          </select>

          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white"
          >
            {sourceOptions.map((o) => (
              <option key={o} value={o}>Source: {o}</option>
            ))}
          </select>

          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white"
          >
            {assignedOptions.map((o) => (
              <option key={o} value={o}>Assigned: {o}</option>
            ))}
          </select> 
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-[#EEF2F7]">
        {paginated.map((lead) => (
          <div key={lead.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#111827] truncate">{lead.name}</p>
                <p className="text-sm text-[#64748B] mt-0.5 truncate">{lead.email || "—"}</p>
                <p className="text-sm text-[#64748B] truncate">{lead.phone || "—"}</p>
              </div>
              <span className={`shrink-0 inline-flex px-3 py-1 rounded-full text-sm ${statusStyles(lead.status)}`}>
                {lead.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[#64748B]">Source</p>
                <p className="text-[#111827] font-medium">{lead.source}</p>
              </div>
              <div>
                <p className="text-[#64748B]">Assigned</p>
                <p className="text-[#111827] font-medium">{lead.assignedTo}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[#64748B]">Date Added</p>
                <p className="text-[#111827] font-medium">{lead.dateAdded}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 text-[#64748B]">
              <button type="button" className="h-10 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827]" onClick={() => openNotImplemented("View")}>View</button>
              <button type="button" className="h-10 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827]" onClick={() => onEdit(lead)}>Edit</button>
              <button type="button" className="h-10 px-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium" onClick={() => onDelete(lead.id)}>Delete</button>
            </div>
          </div>
        ))}
        {paginated.length === 0 && <p className="p-6 text-sm text-[#64748B]">No leads found.</p>}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead className="border-b border-[#EEF2F7]">
            <tr className="text-left">
              <th className="px-6 py-4 w-10">
                <input type="checkbox" aria-label="Select all" className="rounded border-[#E5E7EB]" />
              </th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Lead Name</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Contact</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Source</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Status</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Assigned To</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Date Added</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EEF2F7]">
            {paginated.map((lead) => (
              <tr key={lead.id} className="hover:bg-[#FAFAFA]">
                <td className="px-6 py-5">
                  <input type="checkbox" aria-label={`Select ${lead.name}`} className="rounded border-[#E5E7EB]" />
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm font-medium text-[#111827]">{lead.name}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{lead.phone}</p>
                  <p className="text-sm text-[#64748B]">{lead.email || "—"}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{lead.source}</p>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm ${statusStyles(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{lead.assignedTo}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#64748B]">{lead.dateAdded}</p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3 text-[#64748B]">
                    <button type="button" className="hover:text-[#111827]" aria-label="View" onClick={() => openNotImplemented("View")}><Eye size={18} /></button>
                    <button type="button" className="hover:text-[#111827]" aria-label="Edit" onClick={() => onEdit(lead)}><Pencil size={18} /></button>
                    <button type="button" className="hover:text-[#111827]" aria-label="More" onClick={() => openNotImplemented("More")}><MoreVertical size={18} /></button>
                    <button type="button" className="hover:text-red-600" aria-label="Delete" onClick={() => onDelete(lead.id)}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-sm text-[#64748B]">No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-[#64748B]">
          Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} leads
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-9 h-9 rounded-lg border border-[#E5E7EB] grid place-items-center disabled:opacity-40"
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg grid place-items-center text-sm ${
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
            className="w-9 h-9 rounded-lg border border-[#E5E7EB] grid place-items-center disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}