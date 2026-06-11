import {
  BadgeCheck,
  Check,
  PhoneCall,
  UserPlus,
  Users,
} from "lucide-react";

export default function LeadsKpis({ leads = [] }) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonth = leads.filter((l) => {
    if (!l.createdAt) return false;
    const date = new Date(l.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const total = leads.length;
  const newLeads = thisMonth.filter((l) => l.status?.toLowerCase() === "new").length;
  const contacted = thisMonth.filter((l) => l.status?.toLowerCase() === "contacted").length;
  const converted = thisMonth.filter((l) => l.status?.toLowerCase() === "converted").length;
  const lost = thisMonth.filter((l) => l.status?.toLowerCase() === "lost").length;

  const kpis = [
    {
      label: "Total Leads",
      value: total,
      subtext: "All Time",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "New Leads",
      value: newLeads,
      subtext: "This Month",
      icon: UserPlus,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Contacted",
      value: contacted,
      subtext: "This Month",
      icon: PhoneCall,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Converted",
      value: converted,
      subtext: "This Month",
      icon: BadgeCheck,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
    {
      label: "Lost",
      value: lost,
      subtext: "This Month",
      icon: Check,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.label}
            className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex items-center gap-4"
          >
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