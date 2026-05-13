// DashboardFollowUps.jsx

import React from "react";
import { Phone, Mail, FileText, MoreHorizontal } from "lucide-react";

export default function DashboardFollowUps() {
  const followUps = [
    {
      title: "Call with Mark O.",
      desc: "Discussed Q3 pricing proposal. He requested a revised quote by tomorrow.",
      time: "10:45 AM",
      icon: <Phone size={16} />,
    },

    {
      title: "Email to Acme Corp",
      desc: "Automated workflow: Follow-up on abandoned proposal #2041.",
      time: "09:30 AM",
      icon: <Mail size={16} />,
    },

    {
      title: "Note added by system",
      desc: 'Lead status changed from "New" to "Contacted" via WhatsApp integration.',
      time: "Yesterday",
      icon: <FileText size={16} />,
    },
  ];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b border-[#E5E7EB] flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-semibold text-[#111827]">Recent Follow-ups</h1>

          <p className="text-sm text-[#6B7280] mt-1">Latest calls, emails, and updates.</p>
        </div>

        <button className="w-10 h-10 rounded-xl border border-[#E5E7EB] flex items-center justify-center">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* LIST */}
      <div className="p-6 space-y-7">
        {followUps.map((item, index) => (
          <div key={index} className="flex gap-4">
            {/* ICON */}
            <div className="w-11 h-11 rounded-full border border-[#D1D5DB] flex items-center justify-center text-[#374151]">
              {item.icon}
            </div>

            {/* CONTENT */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-semibold text-[#111827]">{item.title}</h2>

                <span className="text-sm text-[#6B7280] whitespace-nowrap">{item.time}</span>
              </div>

              <p className="text-sm text-[#6B7280] mt-2 leading-6">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
