import { useEffect, useState } from "react";

import DashboardKpis from "../components/dashboard/DashboardKpis";
import DashboardGrowth from "../components/dashboard/DashboardGrowth";
import DashboardLeadsBySource from "../components/dashboard/DashboardLeadsBySource";
import DashboardRecentActivities from "../components/dashboard/DashboardRecentActivities";
import DashboardTasksDueToday from "../components/dashboard/DashboardTasksDueToday";
import api from "../api/Api";

export default function Dashboard() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    api
      .get("report/dashboard/")
      .then((res) => setReport(res.data))
      .catch((err) => console.error("Failed to fetch report:", err));
  }, []);

  return (
    <div className="space-y-6">
      <DashboardKpis report={report} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
        <div className="xl:col-span-2">
          <DashboardGrowth report={report} />
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