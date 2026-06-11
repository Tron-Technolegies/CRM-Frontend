import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const leadsSourceData = [
  { name: "Website", value: 40, color: "#3B82F6" },
  { name: "Referral", value: 25, color: "#93C5FD" },
  { name: "Social Media", value: 20, color: "#10B981" },
  { name: "Email Campaign", value: 10, color: "#F59E0B" },
  { name: "Other", value: 5, color: "#EF4444" },
];

export default function ReportsLeadsSource({ report }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
      <h2 className="text-[20px] font-semibold text-[#111827] mb-6">Leads Source</h2>
      <div className="flex items-center gap-6">
        <div className="h-[180px] w-[180px] relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={leadsSourceData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={70} paddingAngle={2} stroke="none">
                {leadsSourceData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#111827]">{report?.total_leads ?? 0}</p>
              <p className="text-sm text-[#64748B]">Total</p>
            </div>
          </div>
        </div>
        <div className="space-y-3 flex-1">
          {leadsSourceData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: item.color }} />
                <span className="text-sm text-[#111827]">{item.name}</span>
              </div>
              <span className="text-sm text-[#64748B]">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}