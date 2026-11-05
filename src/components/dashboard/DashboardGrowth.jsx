import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function DashboardGrowth({ report }) {
  const data = report?.leads_over_time?.length ? report.leads_over_time : [];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
        <h2 className="text-lg sm:text-[20px] font-semibold text-[#111827]">Growth</h2>
        <span className="text-xs sm:text-sm text-[#64748B]">Leads over time</span>
      </div>

      <div className="mt-4 sm:mt-6 h-[220px] sm:h-[260px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-[#64748B]">
            No data yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#EEF2F7" vertical={true} />
              <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, borderColor: "#E5E7EB", fontSize: "12px" }}
                labelStyle={{ color: "#111827" }}
                formatter={(v) => [v, "Leads"]}
              />

              <Area type="monotone" dataKey="value" stroke="#60A5FA" strokeWidth={2} fill="url(#growthFill)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
