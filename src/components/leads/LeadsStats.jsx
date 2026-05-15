
import { Users, BadgeCheck, Clock3, TrendingUp } from "lucide-react";

export default function LeadsStats() {
  const stats = [
    {
      title: "Total leads",
      value: "1,284",
      growth: "+12.4% from last month",
      icon: <Users size={18} />,
      color: "text-emerald-500",
    },

    {
      title: "Qualified this week",
      value: "86",
      growth: "31 moved to opportunity",
      icon: <BadgeCheck size={18} />,
      color: "text-emerald-500",
    },

    {
      title: "No activity risk",
      value: "19",
      growth: "5 need action today",
      icon: <Clock3 size={18} />,
      color: "text-orange-500",
    },

    {
      title: "Conversion rate",
      value: "24.8%",
      growth: "Best source: WhatsApp ads",
      icon: <TrendingUp size={18} />,
      color: "text-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((item, index) => (
        <div key={index} className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <h3 className="text-sm text-[#6B7280]">{item.title}</h3>

            <div className="w-9 h-9 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
              {item.icon}
            </div>
          </div>

          <h1 className="text-[36px] font-bold text-[#111827] mt-5 leading-none">{item.value}</h1>

          <p className={`text-sm mt-4 ${item.color}`}>{item.growth}</p>
        </div>
      ))}
    </div>
  );
}
