import { Pencil, Trash2 } from "lucide-react";

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function MeetingsTable({ meetings, onEdit, onDelete }) {
  if (!meetings.length) {
    return (
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-10 text-center text-sm text-[#6B7280]">
        No meetings found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#E5EEFF]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-[#6B7280]">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-[#6B7280]">
                Venue
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-[#6B7280]">
                From
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-[#6B7280]">
                To
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-[#6B7280]">
                Host
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-[#6B7280]">
                Related
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-[#6B7280]">
                Repeat
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-[#6B7280]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {meetings.map((meeting) => (
              <tr
                key={meeting.id}
                className="border-t border-[#E5E7EB] hover:bg-[#F9FAFB]"
              >
                <td className="px-6 py-4 text-sm text-[#111827]">
                  {meeting.title || "—"}
                </td>

                <td className="px-6 py-4 text-sm capitalize text-[#111827]">
                  {meeting.meetingVenue || "—"}
                </td>

                <td className="px-6 py-4 text-sm text-[#111827]">
                  {formatDateTime(meeting.fromDatetime)}
                </td>

                <td className="px-6 py-4 text-sm text-[#111827]">
                  {formatDateTime(meeting.toDatetime)}
                </td>

                {/* host is already a plain string ("full_name" or "—")
                    coming straight from the API — no object to unwrap */}
                <td className="px-6 py-4 text-sm text-[#111827]">
                  {meeting.host || "—"}
                </td>

                <td className="px-6 py-4 text-sm text-[#111827]">
                  {meeting.relatedType === "lead" &&
                    (meeting.relatedLead?.name || "—")}
                  {meeting.relatedType === "customer" &&
                    (meeting.relatedCustomer?.name || "—")}
                  {(!meeting.relatedType || meeting.relatedType === "none") &&
                    "—"}
                </td>

                <td className="px-6 py-4 text-sm capitalize text-[#111827]">
                  {meeting.repeat || "—"}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onEdit(meeting.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(meeting.id)}
                      className="text-red-600 hover:text-red-800"
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