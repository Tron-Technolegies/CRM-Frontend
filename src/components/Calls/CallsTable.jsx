import { Pencil, Trash2 } from "lucide-react";

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

export default function CallsTable({calls = [], loading, onDelete, onEdit,}) {

    
  if (loading) {
    return <p className="text-sm text-[#64748B] py-8 text-center">Loading calls...</p>;
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="border-b border-[#EEF2F7]">
            <tr className="text-left">
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Subject</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Type</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Related To</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Assigned To</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Start Time</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Duration</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Status</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF2F7]">
            {calls.map((call) => (
              <tr key={call.id} className="hover:bg-[#FAFAFA]">
                <td className="px-6 py-5">
                  <p className="text-sm font-medium text-[#111827]">{call.subject}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827] capitalize">{call.call_type}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">
                    {call.related_lead?.full_name ||
                    call.related_contact?.company_name ||
                    call.related_deal?.deal_name ||
                    "—"}
                  </p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{call.assigned_to?.full_name || "—"}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#64748B]">{formatDateTime(call.start_time)}</p>
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
                  <div className="flex items-center gap-3 text-[#64748B]">
                    <button
                        type="button"
                        onClick={() => onEdit(call)}
                        className="hover:text-[#111827]"
                        >
                        <Pencil size={18} />
                    </button>

                    <button
                        type="button"
                        className="hover:text-red-600"
                        onClick={() => onDelete(call.id)}
                        >
                        <Trash2 size={18} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
            {calls.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-sm text-[#64748B] text-center">No calls found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}