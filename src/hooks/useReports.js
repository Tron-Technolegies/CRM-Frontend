import { useCallback, useEffect, useState } from "react";
import { getDashboardReport } from "../api/report";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function firstOfMonthISO() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

export function useReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(firstOfMonthISO());
  const [endDate, setEndDate] = useState(todayISO());

  const fetchReport = useCallback(() => {
    setLoading(true);
    setError(null);

    getDashboardReport(startDate, endDate)
      .then((data) => setReport(data))
      .catch((err) => {
        console.error("Failed to fetch report:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [startDate, endDate]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return {
    report,
    loading,
    error,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    refetch: fetchReport,
  };
}