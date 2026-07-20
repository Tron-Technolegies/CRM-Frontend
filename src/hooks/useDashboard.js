import { useEffect, useState } from "react";
import { getDashboardReport } from "../api/dashboard";

export default function useDashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboardReport();
      setReport(data);
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    report,
    loading,
    refreshDashboard: fetchDashboard,
  };
}