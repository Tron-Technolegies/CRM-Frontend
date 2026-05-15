

export default function LeadsSourcePerformance() {
  const performance = [
    {
      source: "WhatsApp ads",
      value: 34,
    },

    {
      source: "Website form",
      value: 27,
    },

    {
      source: "Referrals",
      value: 18,
    },

    {
      source: "Manual import",
      value: 11,
    },
  ];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[20px] font-semibold text-[#111827]">Source performance</h1>

        <span className="text-sm text-[#6B7280]">Last 30 days</span>
      </div>

      {/* LIST */}
      <div className="space-y-6">
        {performance.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm text-[#111827]">{item.source}</h2>

              <span className="text-sm font-medium text-[#111827]">{item.value}%</span>
            </div>

            <div className="w-full h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#2563EB]"
                style={{
                  width: `${item.value}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
