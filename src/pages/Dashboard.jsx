import React from "react";
import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardGraph from "../components/dashboard/DashboardGraph";

export default function Dashboard() {
  return (
    <div>
      <DashboardStats />
      <DashboardGraph />
    </div>
  );
}
