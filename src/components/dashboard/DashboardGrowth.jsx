
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChevronDown } from "lucide-react";

const data = [
  { name: "May 12", value: 14 },
  { name: "May 13", value: 20 },
  { name: "May 14", value: 52 },
  { name: "May 15", value: 63 },
  { name: "May 16", value: 50 },
  { name: "May 17", value: 58 },
  { name: "May 18", value: 80 },
];

export default function DashboardGrowth() {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold text-[#111827]">Growth</h2>

        <button
          type="button"
          className="flex items-center gap-1 text-sm text-[#64748B] hover:text-[#111827] transition"
        >
          Yearly <ChevronDown size={16} />
        </button>
      </div>

      <div className="mt-6 h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -10, right: 10 }}>
            <defs>
              <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#EEF2F7" vertical={true} />
            <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 12, borderColor: "#E5E7EB" }}
              labelStyle={{ color: "#111827" }}
            />

            <Area type="monotone" dataKey="value" stroke="#60A5FA" strokeWidth={2} fill="url(#growthFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
