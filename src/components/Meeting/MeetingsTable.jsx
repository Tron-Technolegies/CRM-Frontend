import { Eye, Pencil, Trash2 } from "lucide-react";

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function MeetingsTable({ meetings, onView, onEdit, onDelete }) {
  if (!meetings.length) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-10 text-center text-sm text-[#64748B]">
        No meetings found.
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
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
            {meetings.map((meeting) => (
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
                  {meeting.relatedType === "lead" &&
                    (meeting.relatedLead?.name || "—")}
                  {meeting.relatedType === "customer" &&
                    (meeting.relatedCustomer?.name || "—")}
                  {meeting.relatedType === "account" &&
                    (meeting.relatedAccount?.name || "—")}
                  {(!meeting.relatedType || meeting.relatedType === "none") &&
                    "—"}
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
                      onClick={() => onDelete(meeting.id)}
                      className="hover:text-red-600"
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
    </div>
  );
}