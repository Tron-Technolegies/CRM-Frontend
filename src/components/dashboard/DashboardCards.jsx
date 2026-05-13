// DashboardCards.jsx

import React from "react";
import { Workflow, AlarmClock, TriangleAlert } from "lucide-react";

export default function DashboardCards() {
  const cards = [
    {
      badge: "Automation",
      title: "Auto-assign leads",
      desc: "Round robin distribution is active for inbound website and WhatsApp leads.",
      icon: <Workflow size={18} />,
    },

    {
      badge: "Reminder",
      title: "Follow-up due today",
      desc: "6 deals need a touchpoint before close of business to keep momentum high.",
      icon: <AlarmClock size={18} />,
    },

    {
      badge: "Alert",
      title: "No activity in 3 days",
      desc: "11 qualified opportunities are inactive and need manual review or a trigger update.",
      icon: <TriangleAlert size={18} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((item, index) => (
        <div key={index} className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
          {/* TOP */}
          <div className="flex items-center justify-between">
            <span className="px-4 py-1 rounded-full bg-[#F3F4F6] text-sm text-[#111827]">
              {item.badge}
            </span>

            <div className="text-[#6B7280]">{item.icon}</div>
          </div>

          {/* CONTENT */}
          <div className="mt-6">
            <h1 className="text-[26px] font-semibold text-[#111827]">{item.title}</h1>

            <p className="text-[#6B7280] text-sm leading-6 mt-4">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
