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