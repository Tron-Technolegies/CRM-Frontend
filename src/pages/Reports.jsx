import { useEffect, useState } from "react";
import axios from "axios";

import ReportsKpis from "../components/reports/ReportsKpis";
import ReportsRevenueChart from "../components/reports/ReportsRevenueChart";
import ReportsDealsByStage from "../components/reports/ReportsDealsByStage";
import ReportsLeadsSource from "../components/reports/ReportsLeadsSource";

const api = axios.create({
  baseURL: "http://localhost:8000/api/admin",
});

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function firstOfMonthISO() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

export default function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(firstOfMonthISO());
  const [endDate, setEndDate] = useState(todayISO());

  const fetchReport = () => {
    setLoading(true);
    api.get("/report/dashboard/", { params: { start_date: startDate, end_date: endDate } })
      .then((res) => setReport(res.data))
      .catch((err) => console.error("Failed to fetch report:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[28px] font-semibold text-[#111827]">Reports</h1>
          <p className="text-sm text-[#64748B] mt-1">Overview of your key CRM metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 px-4 rounded-xl border border-[#E5E7EB] flex items-center gap-2 text-sm text-[#111827]">
            <span>📅</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="outline-none bg-transparent cursor-pointer"
            />
            <span>-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="outline-none bg-transparent cursor-pointer"
            />
          </div>
          <button
            type="button"
            className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2"
          >
            ↓ Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-[#64748B]">Loading reports...</p>
        </div>
      ) : (
        <>
          <ReportsKpis report={report} />
          <ReportsRevenueChart report={report} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ReportsDealsByStage report={report} />
            <ReportsLeadsSource report={report} />
          </div>
        </>
      )}
    </div>
  );
}