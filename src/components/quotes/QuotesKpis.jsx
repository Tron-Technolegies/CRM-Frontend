import { FileText, Send, ShieldCheck, Tag } from "lucide-react";

export default function QuotesKpis({ quotes = [] }) {
  const total = quotes.length;
  const draft = quotes.filter((quote) => String(quote.quoteStage || quote.quote_stage || "").toLowerCase() === "draft").length;
  const sent = quotes.filter((quote) => String(quote.quoteStage || quote.quote_stage || "").toLowerCase() === "sent").length;
  const accepted = quotes.filter((quote) => String(quote.quoteStage || quote.quote_stage || "").toLowerCase() === "accepted").length;

  const kpis = [
    { label: "Total Quotes", value: total, subtext: "All Time", icon: FileText, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
    { label: "Draft", value: draft, subtext: "In progress", icon: Tag, iconBg: "bg-slate-50", iconColor: "text-slate-600" },
    { label: "Sent", value: sent, subtext: "Shared with client", icon: Send, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "Accepted", value: accepted, subtext: "Won quotes", icon: ShieldCheck, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div key={kpi.label} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${kpi.iconBg}`}>
              <Icon className={kpi.iconColor} size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-[#64748B]">{kpi.label}</p>
              <p className="text-3xl font-bold text-[#111827] leading-tight">{kpi.value}</p>
              <p className="text-sm text-[#64748B]">{kpi.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
