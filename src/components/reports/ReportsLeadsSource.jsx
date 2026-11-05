import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const COLORS = {
  "Website": "#3B82F6",
  "WhatsApp": "#10B981",
  "Referral": "#93C5FD",
  "Facebook Ads": "#F59E0B",
  "Google Ads": "#EF4444",
  "Ads": "#8B5CF6",
};

export default function ReportsLeadsSource({ report }) {
  const sourceData = report?.leads_by_source || {};
  const total = report?.total_leads || 0;

  const data = Object.entries(sourceData).map(([name, count]) => ({
    name,
    value: total > 0 ? Math.round((count / total) * 100) : 0,
    color: COLORS[name] || "#64748B",
  }));

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6">
      <h2 className="text-lg sm:text-[20px] font-semibold text-[#111827] mb-4 sm:mb-6">Leads Source</h2>
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="h-[180px] w-[180px] relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={70} paddingAngle={2} stroke="none">
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#111827]">{total}</p>
              <p className="text-xs text-[#64748B]">Total</p>
            </div>
          </div>
        </div>
        <div className="space-y-2.5 sm:space-y-3 w-full flex-1">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0" style={{ background: item.color }} />
                <span className="text-[#111827] font-medium truncate">{item.name}</span>
              </div>
              <span className="text-[#64748B] shrink-0 font-semibold">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
