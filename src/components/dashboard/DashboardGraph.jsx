import React from "react";
import { ArrowUpRight, MoreHorizontal, Phone, Mail, MessageCircle } from "lucide-react";

export default function DashboardBottom() {
  const followups = [
    {
      name: "Michael Scott",
      company: "Tesla Inc",
      action: "Call scheduled",
      time: "10m ago",
      icon: <Phone size={16} />,
    },

    {
      name: "Sarah Wilson",
      company: "Spotify",
      action: "Email sent",
      time: "25m ago",
      icon: <Mail size={16} />,
    },

    {
      name: "David Miller",
      company: "Adobe",
      action: "Meeting reminder",
      time: "1h ago",
      icon: <MessageCircle size={16} />,
    },
  ];

  const deals = [
    {
      client: "Tesla Inc",
      stage: "Negotiation",
      value: "$12,500",
      status: "Active",
    },

    {
      client: "Netflix",
      stage: "Proposal",
      value: "$8,400",
      status: "Pending",
    },

    {
      client: "Adobe",
      stage: "Closed Won",
      value: "$15,900",
      status: "Completed",
    },

    {
      client: "Spotify",
      stage: "Discovery",
      value: "$5,200",
      status: "Active",
    },
  ];

  const graphData = [40, 55, 48, 72, 65, 90, 75];

  return (
    <div className="space-y-6">
      {/* TOP GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* GRAPH */}
        <div className="xl:col-span-2 bg-white border border-[#E2E8F0] rounded-3xl p-6">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-semibold text-[#0F172A]">Revenue Analytics</h2>

              <p className="text-sm text-[#64748B] mt-1">Monthly sales performance overview</p>
            </div>

            <button className="w-10 h-10 rounded-xl border border-[#E2E8F0] flex items-center justify-center">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* VALUE */}
          <div className="flex items-center gap-3 mb-10">
            <h1 className="text-4xl font-bold text-[#0F172A]">$84,240</h1>

            <div className="flex items-center gap-1 text-emerald-500 text-sm font-medium bg-emerald-50 px-3 py-1 rounded-full">
              <ArrowUpRight size={16} />
              18.2%
            </div>
          </div>

          {/* GRAPH */}
          <div className="h-[260px] flex items-end justify-between gap-4">
            {graphData.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-3 flex-1">
                <div className="w-full bg-[#E2E8F0] rounded-full relative h-full overflow-hidden flex items-end">
                  <div
                    className="w-full bg-[#2563EB] rounded-full transition-all duration-300"
                    style={{
                      height: `${item}%`,
                    }}
                  ></div>
                </div>

                <span className="text-sm text-[#64748B]">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT FOLLOWUPS */}
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#0F172A]">Recent Follow-ups</h2>

              <p className="text-sm text-[#64748B] mt-1">Latest CRM actions</p>
            </div>

            <button className="w-10 h-10 rounded-xl border border-[#E2E8F0] flex items-center justify-center">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {followups.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-2xl border border-[#F1F5F9] hover:border-[#CBD5E1] transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
                  {item.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[#0F172A]">{item.name}</h3>

                    <span className="text-xs text-[#94A3B8]">{item.time}</span>
                  </div>

                  <p className="text-sm text-[#64748B] mt-1">{item.company}</p>

                  <p className="text-sm text-[#2563EB] mt-2 font-medium">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#2563EB] rounded-3xl p-6 text-white">
          <p className="text-sm opacity-80">Monthly Revenue</p>

          <h1 className="text-4xl font-bold mt-4">$24,500</h1>

          <p className="text-sm mt-3 opacity-80">Increased by 18% compared to last month.</p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6">
          <p className="text-sm text-[#64748B]">Open Deals</p>

          <h1 className="text-4xl font-bold text-[#0F172A] mt-4">128</h1>

          <p className="text-sm mt-3 text-emerald-500">+12 new deals today</p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6">
          <p className="text-sm text-[#64748B]">Customer Satisfaction</p>

          <h1 className="text-4xl font-bold text-[#0F172A] mt-4">92%</h1>

          <p className="text-sm mt-3 text-emerald-500">Excellent support performance</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#0F172A]">Recent Deals</h2>

            <p className="text-sm text-[#64748B] mt-1">Latest customer pipeline updates</p>
          </div>

          <button className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-sm font-medium">
            View All
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="text-left py-4 text-sm font-semibold text-[#64748B]">Client</th>

              <th className="text-left py-4 text-sm font-semibold text-[#64748B]">Stage</th>

              <th className="text-left py-4 text-sm font-semibold text-[#64748B]">Deal Value</th>

              <th className="text-left py-4 text-sm font-semibold text-[#64748B]">Status</th>
            </tr>
          </thead>

          <tbody>
            {deals.map((item, index) => (
              <tr key={index} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]">
                <td className="py-5 font-medium text-[#0F172A]">{item.client}</td>

                <td className="py-5 text-[#64748B]">{item.stage}</td>

                <td className="py-5 font-semibold text-[#0F172A]">{item.value}</td>

                <td className="py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      item.status === "Completed"
                        ? "bg-emerald-100 text-emerald-600"
                        : item.status === "Pending"
                          ? "bg-orange-100 text-orange-500"
                          : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
