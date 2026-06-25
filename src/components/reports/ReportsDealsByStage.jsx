export default function ReportsDealsByStage({ report }) {
  const stages = report
    ? [
        { name: "New", count: report.leads_by_status?.new || 0, color: "#3B82F6" },
        { name: "Contacted", count: report.leads_by_status?.contacted || 0, color: "#60A5FA" },
        { name: "Qualified", count: (report.deals_by_stage?.Discussion || 0) + (report.deals_by_stage?.Demo || 0), color: "#10B981" },
        { name: "Proposal", count: (report.deals_by_stage?.Proposal || 0) + (report.deals_by_stage?.Negotiation || 0), color: "#F59E0B" },
        { name: "Won", count: report.deals_by_stage?.Won || 0, color: "#EF4444" },
      ]
    : [];

  const total = stages.reduce((sum, s) => sum + s.count, 0) || 1;
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
                style={{
                  width: `${Math.max((stage.count / maxCount) * 100, stage.count > 0 ? 4 : 0)}%`,
                  background: stage.color,
                }}
              />
            </div>
            <p className="text-sm text-[#64748B] w-24 text-right shrink-0">
              {stage.count} <span className="text-[#94A3B8]">({((stage.count / total) * 100).toFixed(1)}%)</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}