import { useEffect, useState } from "react";
import axios from "axios";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const api = axios.create({ baseURL: "http://localhost:8000/api/admin" });

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
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 h-full">
      <h2 className="text-[20px] font-semibold text-[#111827]">Leads by Source</h2>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
        <div className="h-[240px] relative">
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
              <div className="text-3xl font-bold text-[#111827]">{total}</div>
              <div className="text-sm text-[#64748B]">Total</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                <span className="text-sm text-[#111827]">{item.name}</span>
              </div>
              <span className="text-sm text-[#111827]">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}