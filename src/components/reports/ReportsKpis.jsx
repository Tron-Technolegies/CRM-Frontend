import { DollarSign, Target, TrendingUp, Users } from "lucide-react";

function formatCurrency(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

export default function ReportsKpis({ report }) {
  const winRate = report
    ? ((report.total_customers / Math.max(report.total_deals, 1)) * 100).toFixed(1)
    : "0.0";

  const kpis = [
    {
      label: "Total Leads",
      value: report?.total_leads ?? "—",
      subtext: "↑ 12.5% vs Apr",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Total Deals",
      value: report?.total_deals ?? "—",
      subtext: "↑ 8.3% vs Apr",
      icon: DollarSign,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(report?.total_revenue ?? 0),
      subtext: "↑ 15.7% vs Apr",
      icon: TrendingUp,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      label: "Win Rate",
      value: `${winRate}%`,
      subtext: "↑ 4.6% vs Apr",
      icon: Target,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
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
              <p className="text-sm text-emerald-600">{kpi.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}