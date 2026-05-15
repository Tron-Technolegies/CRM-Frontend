

export default function LeadsAutomation() {
  const automations = [
    {
      title: "Round robin assignment",
      desc: "Distribute new leads evenly across agents.",
      active: true,
    },

    {
      title: "Follow-up today reminder",
      desc: "Alert owners at 9:00 AM for scheduled tasks.",
      active: true,
    },

    {
      title: "No activity in 3 days",
      desc: "Highlight cold leads that need immediate action.",
      active: true,
    },

    {
      title: "WhatsApp first response",
      desc: "Send instant intro after inbound lead.",
      active: false,
    },
  ];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[20px] font-semibold text-[#111827]">Automation</h1>

        <button className="text-sm text-[#6B7280]">Rules</button>
      </div>

      <div className="space-y-6">
        {automations.map((item, index) => (
          <div
            key={index}
            className="flex items-start justify-between gap-4 border-b border-[#F3F4F6] pb-5"
          >
            <div>
              <h2 className="font-medium text-[#111827]">{item.title}</h2>

              <p className="text-sm text-[#6B7280] mt-1">{item.desc}</p>
            </div>

            <div
              className={`w-12 h-7 rounded-full relative cursor-pointer
              ${item.active ? "bg-[#2563EB]" : "bg-[#E5E7EB]"}`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all
                ${item.active ? "right-1" : "left-1"}`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
