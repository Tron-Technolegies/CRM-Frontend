import React from "react";
import { Users, Target, BadgeDollarSign, ClipboardCheck, TrendingUp } from "lucide-react";

export default function DashboardStats() {
  const stats = [
    {
      title: "Total Active Leads",
      value: "2,405",
      growth: "+12.5% from last month",
      icon: <Users size={18} />,
    },

    {
      title: "Avg. Conversion Rate",
      value: "24.8%",
      growth: "+2.4% from last month",
      icon: <Target size={18} />,
    },

    {
      title: "Total Revenue (YTD)",
      value: "$842,500",
      growth: "+18.1% vs target",
      icon: <BadgeDollarSign size={18} />,
    },

    {
      title: "Tasks Today",
      value: "14",
      growth: "3 overdue follow-ups",
      icon: <ClipboardCheck size={18} />,
      warning: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* TITLE */}
      <div>
        <h1 className="text-[24px] leading-tight font-bold text-[#0F172A]">
          Your team’s CRM arranged for faster daily action.
        </h1>

        <p className="text-[#64748B] mt-2 text-[12px]">
          Monitor leads, conversion performance and follow-ups from one dashboard.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-[#E2E8F0] rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
          >
            {/* TOP */}
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-medium text-[#64748B]">{stat.title}</h3>

              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#6B7280]">
                {stat.icon}
              </div>
            </div>

            {/* VALUE */}
            <h1 className="text-[30px] font-bold text-[#0F172A] mt-5 leading-none">{stat.value}</h1>

            {/* GROWTH */}
            <div
              className={`flex items-center gap-2 mt-5 text-sm font-medium ${
                stat.warning ? "text-orange-500" : "text-emerald-500"
              }`}
            >
              {!stat.warning && <TrendingUp size={16} />}

              <span>{stat.growth}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
