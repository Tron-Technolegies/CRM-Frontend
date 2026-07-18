import api from "./Api";

export const getLeads = async () => {
  const { data } = await api.get("/lead/view/");
  return data;
};

export const addLead = async (payload) => {
  return await api.post("/lead/add/", payload);
};

export const updateLead = async (id, payload) => {
  return await api.put(`/lead/update/${id}/`, payload);
};

export const deleteLead = async (id) => {
  return await api.delete(`/lead/delete/${id}/`);
};

export const getStaff = async () => {
  const { data } = await api.get("/staff/view/");
  return data;
};