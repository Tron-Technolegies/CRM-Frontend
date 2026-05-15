
import {
  Users,
  DollarSign,
  Check,
  Calendar,
  CreditCard,
} from "lucide-react";

const kpis = [
  {
    label: "Total Leads",
    value: "128",
    subtext: "All Time",
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    label: "Active Deals",
    value: "42",
    subtext: "In Progress",
    icon: DollarSign,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    label: "Won Deals",
    value: "18",
    subtext: "This Month",
    icon: Check,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    label: "Pending Tasks",
    value: "16",
    subtext: "Due Today",
    icon: Calendar,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    label: "Revenue",
    value: "$45,200",
    subtext: "This Month",
    icon: CreditCard,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
];

export default function DashboardKpis() {
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
