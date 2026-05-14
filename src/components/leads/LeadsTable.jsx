import React from "react";

export default function LeadsTable() {
  const leads = [
    {
      name: "Omar N.",
      contact: "omar@n...\n+971 55 ...",
      source: "WhatsApp",
      status: "Qualified",
      owner: "Ayesha Khan",
      avatar: "https://i.pravatar.cc/100?img=11",
    },

    {
      name: "Sofia B.",
      contact: "sofia@b...\n+44 20 ...",
      source: "Website",
      status: "Contacted",
      owner: "Daniel Ross",
      avatar: "https://i.pravatar.cc/100?img=12",
    },

    {
      name: "Chloe O.",
      contact: "c.vega@\n+1 415 ...",
      source: "Referral",
      status: "Proposal",
      owner: "Mina Park",
      avatar: "https://i.pravatar.cc/100?img=13",
    },

    {
      name: "Mei Lin",
      contact: "mei.lin@\n+65 812...",
      source: "Meta leads",
      status: "New",
      owner: "Daniel Ross",
      avatar: "https://i.pravatar.cc/100?img=14",
    },

    {
      name: "Kwame A.",
      contact: "kwame...\n+233 24...",
      source: "Meta leads",
      status: "New",
      owner: "Daniel Ross",
      avatar: "https://i.pravatar.cc/100?img=15",
    },
  ];

  const tabs = [
    { title: "Active", count: 124, active: true },
    { title: "Unassigned", count: 18 },
    { title: "Follow-up today", count: 27 },
    { title: "Duplicates", count: 6 },
  ];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
      {/* TABS */}
      <div className="flex items-center gap-8 px-6 pt-6 border-b border-[#E5E7EB]">
        {tabs.map((item, index) => (
          <button
            key={index}
            className={`pb-4 flex items-center gap-2 text-sm font-medium border-b-2 transition-all
            ${
              item.active ? "border-[#2563EB] text-[#111827]" : "border-transparent text-[#6B7280]"
            }`}
          >
            {item.title}

            <span
              className={`px-2 py-[2px] rounded-full text-xs
              ${item.active ? "bg-[#2563EB] text-white" : "bg-[#F3F4F6] text-[#111827]"}`}
            >
              {item.count}
            </span>
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-[#E5E7EB]">
            <tr>
              <th className="px-6 py-5"></th>

              <th className="text-left text-sm text-[#6B7280] font-medium">Lead</th>

              <th className="text-left text-sm text-[#6B7280] font-medium">Contact</th>

              <th className="text-left text-sm text-[#6B7280] font-medium">Source</th>

              <th className="text-left text-sm text-[#6B7280] font-medium">Status</th>

              <th className="text-left text-sm text-[#6B7280] font-medium">Owner</th>

              <th className="text-left text-sm text-[#6B7280] font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead, index) => (
              <tr key={index} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA]">
                <td className="px-6 py-5">
                  <input type="checkbox" />
                </td>

                {/* LEAD */}
                <td className="py-5">
                  <div className="flex items-center gap-3">
                    <img src={lead.avatar} alt="" className="w-11 h-11 rounded-full" />

                    <div>
                      <h1 className="font-medium text-[#111827]">{lead.name}</h1>
                    </div>
                  </div>
                </td>

                {/* CONTACT */}
                <td className="py-5 whitespace-pre-line text-sm text-[#6B7280]">{lead.contact}</td>

                {/* SOURCE */}
                <td className="py-5 text-sm text-[#6B7280]">{lead.source}</td>

                {/* STATUS */}
                <td className="py-5">
                  <span className="px-3 py-1 rounded-full bg-[#F3F4F6] text-sm">{lead.status}</span>
                </td>

                {/* OWNER */}
                <td className="py-5">
                  <div className="flex items-center gap-3">
                    <img src={lead.avatar} alt="" className="w-8 h-8 rounded-full" />

                    <span className="text-sm text-[#374151]">{lead.owner}</span>
                  </div>
                </td>

                {/* ACTIONS */}
                <td className="py-5">
                  <div className="flex items-center gap-2">
                    <button className="px-4 h-10 rounded-xl border border-[#E5E7EB] text-sm">
                      Call
                    </button>

                    <button className="px-4 h-10 rounded-xl bg-[#F3F4F6] text-sm">Assign</button>
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
