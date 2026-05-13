import React from "react";

import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardGraph from "../components/dashboard/DashboardGraph";
import DashboardFollowUps from "../components/dashboard/DashboardFollowUps";
import DashboardCards from "../components/dashboard/DashboardCards";
import DashboardTable from "../components/dashboard/DashboardTable";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* TOP STATS */}
      <DashboardStats />

      {/* GRAPH + FOLLOWUPS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <DashboardGraph />
        </div>

        <div>
          <DashboardFollowUps />
        </div>
      </div>

      {/* CARDS */}
      <DashboardCards />

      {/* TABLE */}
      <DashboardTable />
    </div>
  );
}
