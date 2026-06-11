export default function ReportsDealsByStage({ report }) {
  const stages = report
    ? [
        { name: "New", count: Math.round(report.total_leads * 0.44), color: "#3B82F6" },
        { name: "Contacted", count: Math.round(report.total_leads * 0.31), color: "#60A5FA" },
        { name: "Qualified", count: Math.round(report.total_leads * 0.16), color: "#10B981" },
        { name: "Proposal", count: Math.round(report.total_deals * 0.25), color: "#F59E0B" },
        { name: "Won", count: report.total_customers || 0, color: "#EF4444" },
      ]
    : [];

  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
      <h2 className="text-[20px] font-semibold text-[#111827] mb-6">Deals by Stage</h2>
      <div className="space-y-4">
        {stages.map((stage) => (
          <div key={stage.name} className="flex items-center gap-4">
            <p className="text-sm text-[#111827] w-24 shrink-0">{stage.name}</p>
            <div className="flex-1 h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${(stage.count / maxCount) * 100}%`, background: stage.color }}
              />
            </div>
            <p className="text-sm text-[#64748B] w-24 text-right shrink-0">
              {stage.count} ({((stage.count / maxCount) * 100).toFixed(1)}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}