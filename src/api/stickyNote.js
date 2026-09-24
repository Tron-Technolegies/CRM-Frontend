import api from "./Api";

/**
 * Staff Sticky Note APIs
 * Base URL already contains /api/admin/
 */

// GET /api/admin/sticky-note/view/
export const getStickyNote = async () => {
  const { data } = await api.get("sticky-note/view/");
  return data;
};

// PUT /api/admin/sticky-note/update/
export const updateStickyNote = async (payload) => {
  const { data } = await api.put("sticky-note/update/", payload);
  return data;
};

// DELETE /api/admin/sticky-note/delete/
export const deleteStickyNote = async () => {
  const { data } = await api.delete("sticky-note/delete/");
  return data;
};

// POST /api/admin/sticky-note/complete/
export const completeStickyNoteReminder = async () => {
  const { data } = await api.post("sticky-note/complete/");
  return data;
};

// POST /api/admin/sticky-note/clear-reminder/
export const clearStickyNoteReminder = async () => {
  const { data } = await api.post("sticky-note/clear-reminder/");
  return data;
};

// GET /api/admin/sticky-note/due/
export const checkStickyNoteDue = async () => {
  const { data } = await api.get("sticky-note/due/");
  return data;
};
