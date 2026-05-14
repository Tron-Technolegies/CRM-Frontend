import React from "react";
import { Search, UserPlus, WandSparkles } from "lucide-react";

export default function LeadsInboxHeader() {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
      {/* TOP */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div>
          <h1 className="text-[24px] font-semibold text-[#111827]">Lead inbox</h1>

          <p className="text-[#6B7280] text-sm mt-1">
            A clean queue for review, qualification, assignment, and quick follow-up.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-11 px-5 rounded-xl border border-[#E5E7EB] flex items-center gap-2">
            <UserPlus size={18} />
            Auto assign
          </button>

          <button className="h-11 px-5 rounded-xl border border-[#E5E7EB] flex items-center gap-2">
            <WandSparkles size={18} />
            Smart filters
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 mt-8">
        {/* SEARCH BOX */}
        <div className="h-12 w-full xl:w-[420px] rounded-xl border border-[#E5E7EB] px-4 flex items-center gap-3">
          <Search size={18} className="text-[#6B7280]" />

          <input
            type="text"
            placeholder="Search by name, company, email, or source"
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-3">
          {["All leads", "Source: WhatsApp", "Owner: Any", "Status: Open", "Last 30 days"].map(
            (item, index) => (
              <button
                key={index}
                className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827]"
              >
                {item}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
