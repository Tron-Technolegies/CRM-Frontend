import { DollarSign, TrendingUp, UserCheck, Users } from "lucide-react";

const kpis = [
  {
    label: "Total Customers",
    value: "245",
    subtext: "All Time",
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    label: "Active",
    value: "182",
    subtext: "Current",
    icon: UserCheck,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    label: "New This Month",
    value: "24",
    subtext: "+12% growth",
    icon: TrendingUp,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    label: "Total Revenue",
    value: "$1.2M",
    subtext: "Lifetime",
    icon: DollarSign,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export default function CustomersKpis() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
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

