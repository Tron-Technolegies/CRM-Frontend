import {
  Users,
  DollarSign,
  Check,
  Calendar,
  CreditCard,
} from "lucide-react";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function DashboardKpis({ report }) {
  const kpis = [
    {
      label: "Total Leads",
      value: report?.total_leads ?? "—",
      subtext: "All Time",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Active Deals",
      value: report?.total_deals ?? "—",
      subtext: "In Progress",
      icon: DollarSign,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Total Customers",
      value: report?.total_customers ?? "—",
      subtext: "All Time",
      icon: Check,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      label: "Pending Tasks",
      value: report?.pending_tasks ?? "—",
      subtext: "Due Today",
      icon: Calendar,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Revenue",
      value: report ? formatCurrency(report.total_revenue) : "—",
      subtext: "Lifetime",
      icon: CreditCard,
      iconBg: "bg-sky-50",
      iconColor: "text-sky-600",
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