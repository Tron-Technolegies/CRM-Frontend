import api from "./Api";

/**
 * Fetch audit trail / edit history for a specific model and record ID.
 * Backend endpoint: GET /api/admin/audit/<model_name>/<object_id>/
 */
export const getAuditHistory = async (modelName, objectId) => {
  if (!modelName || !objectId) return null;
  const lower = String(modelName).toLowerCase().trim();
  try {
    const { data } = await api.get(`/audit/${lower}/${objectId}/`);
    return data;
  } catch (err) {
    // If lower contained underscores or hyphens, try normalized without them (e.g. sales_order -> salesorder)
    const normalized = lower.replace(/[-_]/g, "");
    if (normalized !== lower) {
      const { data } = await api.get(`/audit/${normalized}/${objectId}/`);
      return data;
    }
    throw err;
  }
};
