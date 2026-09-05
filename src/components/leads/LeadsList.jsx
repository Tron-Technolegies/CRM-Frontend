import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, PhoneCall, Search, Trash2 } from "lucide-react";
import LeadViewModal from "./LeadViewModal";
import CallModal from "../Calls/CallModal";
import Pagination from "../Pagination";
import usePagination from "../../api/usePagination";

// Normalize so status comparisons don't depend on backend casing.
function normalize(value) {
  return (value || "").toString().trim().toLowerCase();
}

const STATUS_LABELS = {
  new: "New",
  contacted: "Contacted",
  converted: "Converted",
  lost: "Lost",
};

function statusStyles(status) {
  switch (normalize(status)) {
    case "new": return "bg-blue-50 text-blue-600";
    case "contacted": return "bg-amber-50 text-amber-600";
    case "converted": return "bg-emerald-50 text-emerald-600";
    case "lost": return "bg-slate-100 text-slate-600";
    default: return "bg-slate-100 text-slate-700";
  }
}

function statusLabel(status) {
  return STATUS_LABELS[normalize(status)] || status;
}

export default function LeadsList({
  leads,
  staff,
  onDelete,
  onEdit,
  onConvert
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [source, setSource] = useState("All");
  const [assignedTo, setAssignedTo] = useState("All");
  const [viewId, setViewId] = useState(null);
  const [callLead, setCallLead] = useState(null);

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
  }, [query, status, source, assignedTo]);

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
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white">
            {statusOptions.map((o) => <option key={o} value={o}>Status: {o === "All" ? "All" : statusLabel(o)}</option>)}
          </select>
          <select value={source} onChange={(e) => setSource(e.target.value)} className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white">
            {sourceOptions.map((o) => <option key={o} value={o}>Source: {o}</option>)}
          </select>
          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white">
            {assignedOptions.map((o) => <option key={o} value={o}>Assigned: {o}</option>)}
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
                {statusLabel(lead.status)}
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
              <button
                type="button"
                className="h-10 px-3.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-medium flex items-center gap-1.5 transition"
                onClick={() => setCallLead(lead)}
              >
                <PhoneCall size={14} /> Call
              </button>
              <button type="button" className="h-10 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827]" onClick={() => setViewId(lead.id)}>View</button>
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
              <tr key={lead.id} onClick={() => setViewId(lead.id)} className="hover:bg-[#FAFAFA] cursor-pointer">
                <td className="px-6 py-5">
                  <p className="text-sm font-medium text-[#111827]">{lead.name}</p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-[#111827]">{lead.phone || "—"}</p>
                    {lead.phone && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCallLead(lead);
                        }}
                        title={`Call ${lead.name}`}
                        className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
                      >
                        <PhoneCall size={14} />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-[#64748B]">{lead.email || "—"}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{lead.source}</p>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm ${statusStyles(lead.status)}`}>
                    {statusLabel(lead.status)}
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
                    <button
                      type="button"
                      className="hover:text-emerald-600 transition"
                      aria-label="Call Lead"
                      title="Call with Twilio"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCallLead(lead);
                      }}
                    >
                      <PhoneCall size={18} />
                    </button>
                    <button type="button" className="hover:text-[#111827]" aria-label="View" onClick={(e) => {e.stopPropagation();setViewId(lead.id);}}><Eye size={18} /></button>
                    <button type="button" className="hover:text-[#111827]" aria-label="Edit" onClick={(e) => {e.stopPropagation();onEdit(lead);}}><Pencil size={18} /></button>
                    <button type="button" className="hover:text-red-600" aria-label="Delete" onClick={(e) => {e.stopPropagation();onDelete(lead.id);}}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-sm text-[#64748B]">No leads found.</td>
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
        itemName="leads"
        onPageChange={changePage}
      />

      {/* View Modal */}
      <LeadViewModal
        open={!!viewId}
        onClose={() => setViewId(null)}
        leadId={viewId}
        staff={staff}
        onEdit={(lead) => {
          setViewId(null);
          onEdit(lead);
        }}
        onConvert={(id, type) => {
          setViewId(null);
          onConvert(id, type);
        }}
        onCall={(lead) => {
          setCallLead(lead);
        }}
      />

      {/* Twilio Call Modal */}
      <CallModal
        open={!!callLead}
        onClose={() => setCallLead(null)}
        lead={callLead}
      />
    </div>
  );
}