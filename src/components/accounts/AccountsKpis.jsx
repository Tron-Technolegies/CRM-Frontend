import { Building2, Globe, Layers3, Users2 } from "lucide-react";

function createdThisMonth(accounts = []) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return accounts.filter((account) => {
    if (!account.createdAt) return false;
    const created = new Date(account.createdAt);
    return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
  }).length;
}

export default function AccountsKpis({ accounts = [] }) {
  const total = accounts.length;
  const assigned = accounts.filter((account) => account.assignedTo).length;
  const withWebsite = accounts.filter((account) => account.website).length;
  const withParent = accounts.filter((account) => account.parentAccount).length;
  const thisMonth = createdThisMonth(accounts);

  const kpis = [
    { label: "Total Accounts", value: total, subtext: "All Time", icon: Building2, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
    { label: "Assigned", value: assigned, subtext: "Linked to staff", icon: Users2, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "With Website", value: withWebsite, subtext: "Public presence", icon: Globe, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "Sub Accounts", value: withParent, subtext: "Have a parent", icon: Layers3, iconBg: "bg-violet-50", iconColor: "text-violet-600" },
    { label: "Created This Month", value: thisMonth, subtext: "Recent accounts", icon: Building2, iconBg: "bg-rose-50", iconColor: "text-rose-600" },
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
