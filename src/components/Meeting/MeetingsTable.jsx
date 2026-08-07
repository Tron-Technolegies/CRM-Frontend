import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Search, Trash2, X } from "lucide-react";
import Pagination from "../Pagination";
import usePagination from "../../api/usePagination";

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function DeleteConfirmModal({ onCancel, onConfirm, deleting }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-start justify-between px-6 pt-6">
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">
              Delete meeting?
            </h2>
            <p className="text-sm text-[#6B7280] mt-1">
              This action cannot be undone.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-9 h-9 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-gray-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex justify-end gap-3 px-6 py-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 h-11 rounded-xl border border-[#E5E7EB] text-[#111827] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="px-5 h-11 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function relatedName(meeting) {
  if (meeting.relatedType === "lead") return meeting.relatedLead?.name || "—";
  if (meeting.relatedType === "customer") return meeting.relatedCustomer?.name || "—";
  if (meeting.relatedType === "account") return meeting.relatedAccount?.name || "—";
  return "—";
}

export default function MeetingsTable({ meetings, onView, onEdit, onDelete }) {
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return meetings;
    return meetings.filter((m) => {
      const fields = [m.title, m.meetingVenue, m.host, relatedName(m)];
      return fields.filter(Boolean).some((v) => v.toLowerCase().includes(q));
    });
  }, [meetings, query]);

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData: paginatedMeetings,
    changePage,
    resetPage,
  } = usePagination(filtered, 8);

  useEffect(() => {
    resetPage();
  }, [filtered.length]);

  useEffect(() => {
    resetPage();
  }, [query]);

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(deleteTargetId);
      setDeleteTargetId(null);
    } catch (err) {
      console.error("DELETE MEETING ERROR:", err);
      alert("Could not delete this meeting. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-[#EEF2F7]">
        <div className="h-12 w-full xl:w-[340px] rounded-xl border border-[#E5E7EB] px-4 flex items-center gap-3">
          <Search size={18} className="text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search meetings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div>

      {!meetings.length ? (
        <div className="p-10 text-center text-sm text-[#64748B]">
          No meetings found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead className="border-b border-[#EEF2F7]">
              <tr className="text-left">
                <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Title</th>
                <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Venue</th>
                <th className="px-6 py-4 text-sm text-[#64748B] font-medium">From</th>
                <th className="px-6 py-4 text-sm text-[#64748B] font-medium">To</th>
                <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Host</th>
                <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Related</th>
                <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Repeat</th>
                <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EEF2F7]">
              {paginatedMeetings.map((meeting) => (
                <tr
                  key={meeting.id}
                  onClick={() => onView(meeting.id)}
                  className="hover:bg-[#FAFAFA] cursor-pointer"
                >
                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold text-[#111827]">
                      {meeting.title || "—"}
                    </p>
                  </td>

                  <td className="px-6 py-5 text-sm capitalize text-[#111827]">
                    {meeting.meetingVenue || "—"}
                  </td>

                  <td className="px-6 py-5 text-sm text-[#64748B]">
                    {formatDateTime(meeting.fromDatetime)}
                  </td>

                  <td className="px-6 py-5 text-sm text-[#64748B]">
                    {formatDateTime(meeting.toDatetime)}
                  </td>

                  {/* host is already a plain string ("full_name" or "—")
                      coming straight from the API — no object to unwrap */}
                  <td className="px-6 py-5 text-sm text-[#111827]">
                    {meeting.host || "—"}
                  </td>

                  <td className="px-6 py-5 text-sm text-[#111827]">
                    {relatedName(meeting)}
                  </td>

                  <td className="px-6 py-5 text-sm capitalize text-[#111827]">
                    {meeting.repeat || "—"}
                  </td>

                  <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-3 text-[#64748B]">
                      <button
                        type="button"
                        onClick={() => onView(meeting.id)}
                        className="hover:text-blue-600"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(meeting.id)}
                        className="hover:text-[#111827]"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(meeting.id)}
                        className="hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedMeetings.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-sm text-[#64748B] text-center">
                    No meetings match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        itemName="meetings"
        onPageChange={changePage}
      />

      {deleteTargetId && (
        <DeleteConfirmModal
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={handleConfirmDelete}
          deleting={deleting}
        />
      )}
    </div>
  );
}