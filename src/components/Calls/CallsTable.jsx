import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";
import Pagination from "../Pagination";
import usePagination from "../../api/usePagination";

function statusStyles(status) {
  switch (status) {
    case "completed": return "bg-emerald-50 text-emerald-600";
    case "missed": return "bg-rose-50 text-rose-600";
    case "scheduled": return "bg-blue-50 text-blue-600";
    case "cancelled": return "bg-slate-100 text-slate-600";
    default: return "bg-slate-100 text-slate-600";
  }
}

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function relatedName(call) {
  return (
    call.relatedLead?.name ||
    call.relatedContact?.name ||
    call.relatedDeal?.name ||
    call.relatedAccount?.name ||
    "—"
  );
}

export default function CallsTable({ calls = [], loading, onDelete, onEdit, onView }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return calls;
    return calls.filter((c) => {
      const fields = [c.subject, c.assignedTo, relatedName(c)];
      return fields.filter(Boolean).some((v) => v.toLowerCase().includes(q));
    });
  }, [calls, query]);

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData: paginatedCalls,
    changePage,
    resetPage,
  } = usePagination(filtered, 8);

  useEffect(() => {
    resetPage();
  }, [filtered.length]);

  useEffect(() => {
    resetPage();
  }, [query]);

  if (loading) {
    return <p className="text-sm text-[#64748B] py-8 text-center">Loading calls...</p>;
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-[#EEF2F7]">
        <div className="h-12 w-full xl:w-[340px] rounded-xl border border-[#E5E7EB] px-4 flex items-center gap-3">
          <Search size={18} className="text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search calls..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="border-b border-[#EEF2F7]">
            <tr className="text-left">
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Subject</th>
              {/* <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Type</th> */}
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Related To</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Assigned To</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Start Time</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Duration</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Status</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF2F7]">
            {paginatedCalls.map((call) => (
              <tr
                key={call.id}
                className="hover:bg-[#FAFAFA] cursor-pointer"
                onClick={() => onView(call.id)}
              >
                <td className="px-6 py-5">
                  <p className="text-sm font-medium text-[#111827]">{call.subject}</p>
                </td>
                {/* <td className="px-6 py-5">
                  <p className="text-sm text-[#111827] capitalize">{call.callType}</p>
                </td> */}
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{relatedName(call)}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{call.assignedTo || "—"}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#64748B]">{formatDateTime(call.startTime)}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{call.duration} min</p>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm capitalize ${statusStyles(call.status)}`}>
                    {call.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div
                    className="flex items-center gap-3 text-[#64748B]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button type="button" onClick={() => onView(call.id)} className="hover:text-blue-600">
                      <Eye size={18} />
                    </button>
                    <button type="button" onClick={() => onEdit(call)} className="hover:text-[#111827]">
                      <Pencil size={18} />
                    </button>
                    <button type="button" className="hover:text-red-600" onClick={() => onDelete(call.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedCalls.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-sm text-[#64748B] text-center">
                  {query ? "No calls match your search." : "No calls found."}
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
        itemName="calls"
        onPageChange={changePage}
      />
    </div>
  );
}