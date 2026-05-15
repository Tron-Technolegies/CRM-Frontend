

const tasks = [
  { title: "Follow up with John Doe", assignee: "Mark", time: "10:00 AM" },
  { title: "Send proposal to ABC Corp", assignee: "Sarah", time: "12:00 PM" },
  { title: "Call with David Lee", assignee: "Mark", time: "03:00 PM" },
  { title: "Meeting with XYZ Ltd", assignee: "Sarah", time: "04:30 PM" },
];

export default function DashboardTasksDueToday() {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 h-full">
      <h2 className="text-[20px] font-semibold text-[#111827]">Tasks Due Today</h2>

      <div className="mt-6 divide-y divide-[#EEF2F7]">
        {tasks.map((t) => (
          <div key={t.title} className="py-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <span className="w-5 h-5 rounded-full border border-[#CBD5E1] mt-0.5 shrink-0" />
              <p className="text-sm text-[#111827] truncate">{t.title}</p>
            </div>

            <div className="flex items-center gap-10 shrink-0">
              <p className="text-sm text-[#64748B]">{t.assignee}</p>
              <p className="text-sm text-[#64748B]">{t.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <button type="button" className="w-full text-sm text-blue-600 hover:text-blue-700 transition">
          View All Tasks
        </button>
      </div>
    </div>
  );
}
