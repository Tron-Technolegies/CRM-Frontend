import DashboardKpis from "../components/dashboard/DashboardKpis";
import DashboardGrowth from "../components/dashboard/DashboardGrowth";
import DashboardLeadsBySource from "../components/dashboard/DashboardLeadsBySource";
import DashboardRecentActivities from "../components/dashboard/DashboardRecentActivities";
import DashboardTasksDueToday from "../components/dashboard/DashboardTasksDueToday";

import useDashboard from "../hooks/useDashboard";

export default function Dashboard() {
  const { report, loading } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[#64748B]">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardKpis report={report} />

      <div>
        {/* className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch" */}
        <div className="xl:col-span-2">
          <DashboardGrowth report={report} />
        </div>

        
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        {/* <DashboardRecentActivities /> */}
        <div className="xl:col-span-1">
          <DashboardLeadsBySource />
        </div>
        <DashboardTasksDueToday />
      </div>
    </div>
  );
}