
import { Phone, UserPlus, DollarSign, CheckCircle2 } from "lucide-react";

const activities = [
  {
    title: "New lead added: John Smith",
    subtitle: "Website Form",
    time: "10:30 AM",
    icon: UserPlus,
    bg: "bg-emerald-500",
  },
  {
    title: "Call with Sarah Johnson",
    subtitle: "Discussed about requirement",
    time: "09:45 AM",
    icon: Phone,
    bg: "bg-blue-600",
  },
  {
    title: "Deal won: ABC Solutions",
    subtitle: "Deal Value: $10,000",
    time: "Yesterday",
    icon: DollarSign,
    bg: "bg-violet-600",
  },
  {
    title: "Task assigned to Mark Brown",
    subtitle: "Follow up with lead",
    time: "Yesterday",
    icon: CheckCircle2,
    bg: "bg-amber-500",
  },
];

export default function DashboardRecentActivities() {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 h-full">
      <h2 className="text-[20px] font-semibold text-[#111827]">Recent Activities</h2>

      <div className="mt-6 divide-y divide-[#EEF2F7]">
        {activities.map((a) => {
          const Icon = a.icon;

          return (
            <div key={a.title} className="py-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0">
                <div className={`w-11 h-11 rounded-full ${a.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={18} className="text-white" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#111827] truncate">{a.title}</p>
                  <p className="text-sm text-[#64748B] truncate">{a.subtitle}</p>
                </div>
              </div>

              <p className="text-sm text-[#64748B] shrink-0">{a.time}</p>
            </div>
          );
        })}
      </div>

      <div className="pt-4">
        <button type="button" className="w-full text-sm text-blue-600 hover:text-blue-700 transition">
          View All Activities
        </button>
      </div>
    </div>
  );
}
