import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ReportsKpis from "../components/reports/ReportsKpis";
import ReportsRevenueChart from "../components/reports/ReportsRevenueChart";
import ReportsDealsByStage from "../components/reports/ReportsDealsByStage";
import ReportsLeadsSource from "../components/reports/ReportsLeadsSource";
import { useReports } from "../hooks/useReports";

export default function Reports() {
  const { report, loading, error, startDate, endDate, setStartDate, setEndDate } = useReports();
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    if (!report) return;
    setExporting(true);

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Title & Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(43, 97, 255); // #2B61FF
      doc.text("CRM Summary Report", 14, 20);

      // Subtitle with Date Range
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // #64748B
      const dateText = `Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}  |  Date Range: ${startDate || "All"} to ${endDate || "All"}`;
      doc.text(dateText, 14, 27);

      // Divider line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(14, 31, 196, 31);

      // 1. Key Metrics / KPIs Table
      const kpiHeaders = [
        "Total Revenue",
        "Total Leads",
        "Total Deals",
        "Customers",
        "Total Tasks",
      ];
      const kpiValues = [
        `$${Number(report.total_revenue || 0).toLocaleString()}`,
        String(report.total_leads || 0),
        String(report.total_deals || 0),
        String(report.total_customers || 0),
        String(report.total_tasks || 0),
      ];

      autoTable(doc, {
        startY: 36,
        head: [kpiHeaders],
        body: [kpiValues],
        theme: "grid",
        headStyles: {
          fillColor: [241, 245, 249],
          textColor: [71, 85, 105],
          fontSize: 9,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          fontSize: 13,
          fontStyle: "bold",
          textColor: [15, 23, 42],
          halign: "center",
          cellPadding: 4,
        },
      });

      let currentY = doc.lastAutoTable.finalY + 10;

      // 2. Activity & Task Overview
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(30, 41, 59);
      doc.text("Activity & Pipeline Breakdown", 14, currentY);

      const activityRows = [
        ["Active Customers", String(report.active_customers || 0)],
        ["Pending Tasks", String(report.pending_tasks || 0)],
        ["Completed Tasks", String(report.completed_tasks || 0)],
        ["High Priority Tasks", String(report.high_priority_tasks || 0)],
      ];

      autoTable(doc, {
        startY: currentY + 4,
        head: [["Metric", "Count"]],
        body: activityRows,
        theme: "striped",
        headStyles: {
          fillColor: [43, 97, 255],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 10,
          textColor: [30, 41, 59],
          cellPadding: 3,
        },
      });

      currentY = doc.lastAutoTable.finalY + 10;

      // 3. Deals by Stage Table
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(30, 41, 59);
      doc.text("Deals by Stage", 14, currentY);

      const dealsRows = Array.isArray(report.deals_by_stage)
        ? report.deals_by_stage.map((d) => [d.name || d.stage || "—", String(d.value || d.count || 0)])
        : typeof report.deals_by_stage === "object" && report.deals_by_stage !== null
        ? Object.entries(report.deals_by_stage).map(([k, v]) => [k, String(v)])
        : [];

      autoTable(doc, {
        startY: currentY + 4,
        head: [["Stage", "Deals Count"]],
        body: dealsRows.length > 0 ? dealsRows : [["No deals recorded for this period", "0"]],
        theme: "striped",
        headStyles: {
          fillColor: [43, 97, 255],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 10,
          textColor: [30, 41, 59],
          cellPadding: 3,
        },
      });

      currentY = doc.lastAutoTable.finalY + 10;

      // 4. Leads by Source Table
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(30, 41, 59);
      doc.text("Leads by Source", 14, currentY);

      const leadsRows = Array.isArray(report.leads_by_source?.data)
        ? report.leads_by_source.data.map((l) => [l.name || "—", `${l.value}%`])
        : Array.isArray(report.leads_by_source)
        ? report.leads_by_source.map((l) => [l.lead_source || l.name || "—", String(l.count || l.value || 0)])
        : typeof report.leads_by_source === "object" && report.leads_by_source !== null
        ? Object.entries(report.leads_by_source).map(([k, v]) => [k, String(v)])
        : [];

      autoTable(doc, {
        startY: currentY + 4,
        head: [["Lead Source", "Value / Proportion"]],
        body: leadsRows.length > 0 ? leadsRows : [["No leads recorded for this period", "0"]],
        theme: "striped",
        headStyles: {
          fillColor: [43, 97, 255],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 10,
          textColor: [30, 41, 59],
          cellPadding: 3,
        },
      });

      // Footer
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(156, 163, 175);
        doc.text(`Page ${i} of ${totalPages} — CRM Summary Report`, 14, 290);
      }

      // Trigger download
      doc.save(`CRM_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

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
            onClick={handleExport}
            disabled={!report || loading || exporting}
            className="h-10 px-4 rounded-xl bg-[#2B61FF] hover:bg-blue-700 active:scale-[0.98] transition text-white text-sm font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-60 shadow-sm"
          >
            {exporting ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Exporting…
              </>
            ) : (
              <>↓ Export PDF</>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-[#64748B]">Loading reports...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-red-600">Failed to load reports. Please try again.</p>
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