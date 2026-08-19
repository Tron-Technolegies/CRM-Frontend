import { Mail, Shield, UserCheck, Users } from "lucide-react";

export default function UsersKpis({ users = [] }) {
  const total = users.length;
  const active = users.filter((u) => u.status === "Active").length;
  const admins = users.filter((u) => u.role?.toLowerCase() === "admin").length;
  const pendingInvites = users.filter((u) => u.status === "Invited").length;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const newThisWeek = users.filter(
    (u) => u.invitedAt && new Date(u.invitedAt) >= oneWeekAgo
  ).length;

  const activePercent = total ? Math.round((active / total) * 100) : 0;

  const kpis = [
    {
      label: "Total Users",
      value: total,
      subtext: `+ ${newThisWeek} added this week`,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Active Users",
      value: active,
      subtext: `${activePercent}% active`,
      icon: UserCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Admins",
      value: admins,
      subtext: `${admins} admin${admins !== 1 ? "s" : ""}`,
      icon: Shield,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      label: "Pending Invites",
      value: pendingInvites,
      subtext: pendingInvites > 0 ? "Awaiting response" : "All resolved",
      icon: Mail,
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