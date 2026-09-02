import api from "./Api";

/**
 * Fetches the CRM dashboard report data for a given date range.
 * Backend endpoint: GET /report/dashboard/
 *
 * @param {string} startDate - ISO date string (YYYY-MM-DD)
 * @param {string} endDate - ISO date string (YYYY-MM-DD)
 * @returns {Promise<object>} Resolves to the raw snake_case report object
 */
export const getDashboardReport = async (startDate, endDate) => {
  const { data } = await api.get("/report/dashboard/", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });
  return data;
};

/**
 * Downloads the CRM summary report as a PDF file.
 * Backend endpoint: GET /report/pdf/
 */
export const downloadReportPdf = async (startDate, endDate) => {
  const response = await api.get("/report/pdf/", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `CRM_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};