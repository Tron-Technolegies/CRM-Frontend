import React from "react";
import { Phone, MoreHorizontal } from "lucide-react";

export default function DashboardTable() {
  const leads = [
    {
      name: "Michael Harrison",
      company: "TechFlow Industries",
      source: "Website Form",
      status: "New Lead",
      value: "$12,000",
      assigned: "Sarah J.",
      avatar: "https://i.pravatar.cc/100?img=11",
    },

    {
      name: "Amina Diallo",
      company: "Globex Supply",
      source: "Facebook Ad",
      status: "Contacted",
      value: "$4,500",
      assigned: "David T.",
      avatar: "https://i.pravatar.cc/100?img=12",
    },

    {
      name: "Robert Chen",
      company: "Chen Logistics",
      source: "Referral",
      status: "Qualified",
      value: "$28,000",
      assigned: "Sarah J.",
      avatar: "https://i.pravatar.cc/100?img=13",
    },
  ];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-semibold text-[#111827]">New & Active Leads</h1>

          <p className="text-sm text-[#6B7280] mt-1">
            Prioritized list of fresh inbound leads and high-intent opportunities.
          </p>
        </div>

        <button className="px-5 h-11 rounded-xl border border-[#E5E7EB] text-[#111827] font-medium">
          View All Leads
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-[#E5E7EB]">
            <tr>
              <th className="text-left px-6 py-5 text-sm font-medium text-[#6B7280]">Lead Name</th>

              <th className="text-left px-6 py-5 text-sm font-medium text-[#6B7280]">Source</th>

              <th className="text-left px-6 py-5 text-sm font-medium text-[#6B7280]">Status</th>

              <th className="text-left px-6 py-5 text-sm font-medium text-[#6B7280]">Deal Value</th>

              <th className="text-left px-6 py-5 text-sm font-medium text-[#6B7280]">
                Assigned To
              </th>

              <th className="text-right px-6 py-5 text-sm font-medium text-[#6B7280]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead, index) => (
              <tr key={index} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA]">
                {/* NAME */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <img src={lead.avatar} alt="" className="w-11 h-11 rounded-full object-cover" />

                    <div>
                      <h1 className="font-semibold text-[#111827]">{lead.name}</h1>

                      <p className="text-sm text-[#6B7280]">{lead.company}</p>
                    </div>
                  </div>
                </td>

                {/* SOURCE */}
                <td className="px-6 py-5 text-[#6B7280]">{lead.source}</td>

                {/* STATUS */}
                <td className="px-6 py-5">
                  <span className="px-4 py-1 rounded-full bg-[#F3F4F6] text-sm text-[#111827]">
                    {lead.status}
                  </span>
                </td>

                {/* VALUE */}
                <td className="px-6 py-5 font-semibold text-[#111827]">{lead.value}</td>

                {/* ASSIGNED */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <img src={lead.avatar} alt="" className="w-8 h-8 rounded-full" />

                    <span className="text-[#111827]">{lead.assigned}</span>
                  </div>
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-3">
                    <button className="w-10 h-10 rounded-xl border border-[#E5E7EB] flex items-center justify-center">
                      <Phone size={16} />
                    </button>

                    <button className="w-10 h-10 rounded-xl border border-[#E5E7EB] flex items-center justify-center">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
