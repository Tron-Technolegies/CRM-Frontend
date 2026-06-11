import { AlertCircle, CheckCircle, Clock, ListTodo } from "lucide-react";

export default function TasksKpis({ tasks = [] }) {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status?.toLowerCase() === "pending").length;
  const inProgress = tasks.filter((t) => t.status?.toLowerCase() === "in_progress").length;
  const completed = tasks.filter((t) => t.status?.toLowerCase() === "completed").length;
  const overdue = tasks.filter((t) => {
    if (!t.dueDate || t.status?.toLowerCase() === "completed") return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  const kpis = [
    { label: "Total Tasks", value: total, subtext: "All Time", icon: ListTodo, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
    { label: "Due Today", value: pending, subtext: "High Priority", icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "In Progress", value: inProgress, subtext: "Active", icon: Clock, iconBg: "bg-violet-50", iconColor: "text-violet-600" },
    { label: "Completed", value: completed, subtext: "This Week", icon: CheckCircle, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Overdue", value: overdue, subtext: "Requires Action", icon: AlertCircle, iconBg: "bg-rose-50", iconColor: "text-rose-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div key={kpi.label} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${kpi.iconBg}`}>
              <Icon className={kpi.iconColor} size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-[#64748B]">{kpi.label}</p>
              <p className="text-3xl font-bold text-[#111827] leading-tight">{kpi.value}</p>
              <p className="text-sm text-[#64748B]">{kpi.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}