import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import api from "../../api/Api";

export default function DashboardLeadsBySource() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    api.get("/leads/by-source/")
      .then((res) => {
        setData(res.data.data);
        setTotal(res.data.total);
      })
      .catch((err) => console.error("Failed to fetch leads by source:", err));
  }, []);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 h-full">
      <h2 className="text-lg sm:text-[20px] font-semibold text-[#111827]">Leads by Source</h2>

      <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
        <div className="h-[200px] sm:h-[240px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#111827]">{total}</div>
              <div className="text-xs sm:text-sm text-[#64748B]">Total</div>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0" style={{ background: item.color }} />
                <span className="text-[#111827] font-medium">{item.name}</span>
              </div>
              <span className="text-[#111827] font-semibold">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
