import React from "react";

import LeadsStats from "../components/leads/LeadsStats";
import LeadsInboxHeader from "../components/leads/LeadsInboxHeader";
import LeadsAutomation from "../components/leads/LeadsAutomation";
import LeadsSourcePerformance from "../components/leads/LeadsSourcePerformance";
import LeadsTable from "../components/leads/LeadsTable";

export default function LeadsManagement() {
  return (
    <div className="space-y-6">
      <LeadsStats />
      <LeadsInboxHeader />
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <LeadsTable />
        </div>
        <div className="space-y-6">
          <LeadsAutomation />
          <LeadsSourcePerformance />
        </div>
      </div>
    </div>
  );
}
