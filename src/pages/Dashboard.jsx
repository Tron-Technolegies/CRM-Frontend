

import DashboardKpis from "../components/dashboard/DashboardKpis";
import DashboardGrowth from "../components/dashboard/DashboardGrowth";
import DashboardLeadsBySource from "../components/dashboard/DashboardLeadsBySource";
import DashboardRecentActivities from "../components/dashboard/DashboardRecentActivities";
import DashboardTasksDueToday from "../components/dashboard/DashboardTasksDueToday";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <DashboardKpis />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
        <div className="xl:col-span-2">
          <DashboardGrowth />
        </div>

        <div className="xl:col-span-1">
          <DashboardLeadsBySource />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        <DashboardRecentActivities />
        <DashboardTasksDueToday />
      </div>
    </div>
  );
}
