// DashboardGraph.jsx

import React from "react";

export default function DashboardGraph() {
  const graphData = [
    { month: "Jan", won: 35, projected: 52 },
    { month: "Feb", won: 48, projected: 60 },
    { month: "Mar", won: 68, projected: 76 },
    { month: "Apr", won: 40, projected: 56 },
    { month: "May", won: 52, projected: 68 },
    { month: "Jun", won: 64, projected: 72 },
    { month: "Jul", won: 76, projected: 84 },
  ];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 h-full">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-[#111827]">Revenue Forecast</h1>

          <p className="text-[#6B7280] text-sm mt-1">
            Won deals versus projected pipeline across the last 7 months.
          </p>
        </div>

        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2563EB]"></div>
            <span className="text-[#6B7280]">Won Deals</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#E5E7EB]"></div>
            <span className="text-[#6B7280]">Projected</span>
          </div>
        </div>
      </div>

      {/* GRAPH */}
      <div className="mt-10 h-[260px] flex items-end justify-between gap-6 border-t border-dashed border-[#E5E7EB] pt-8">
        {graphData.map((item, index) => (
          <div key={index} className="flex flex-col items-center justify-end h-full">
            <div className="flex items-end gap-2 h-full">
              {/* WON */}
              <div
                className="w-5 md:w-6 bg-[#2563EB] rounded-t-md"
                style={{
                  height: `${item.won}%`,
                }}
              ></div>

              {/* PROJECTED */}
              <div
                className="w-5 md:w-6 bg-[#E5E7EB] rounded-t-md"
                style={{
                  height: `${item.projected}%`,
                }}
              ></div>
            </div>

            <span className="text-sm text-[#6B7280] mt-3">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
