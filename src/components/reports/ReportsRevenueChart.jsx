import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

function formatCurrency(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

export default function ReportsRevenueChart({ report }) {
  const data = report
    ? [
        { date: "May 1", revenue: Math.round(report.total_revenue * 0.05) },
        { date: "May 8", revenue: Math.round(report.total_revenue * 0.15) },
        { date: "May 15", revenue: Math.round(report.total_revenue * 0.35) },
        { date: "May 22", revenue: Math.round(report.total_revenue * 0.65) },
        { date: "May 31", revenue: Math.round(report.total_revenue * 1.0) },
      ]
    : [];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-semibold text-[#111827]">Revenue Over Time</h2>
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <span className="w-4 h-0.5 bg-blue-600 inline-block" />
          Revenue ($)
        </div>
      </div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => [formatCurrency(v), "Revenue"]} />
            <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} fill="url(#revenueGrad)" dot={{ fill: "#3B82F6", r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}