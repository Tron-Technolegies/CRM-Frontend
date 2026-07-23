import api from "./Api";

export const getAccounts = async () => {
  const { data } = await api.get("/account/view/");
  return data;
};

export const getStaff = async () => {
  const { data } = await api.get("/staff/view/");
  return data;
};

export const deleteAccount = async (id) => {
  const { data } = await api.delete(`/account/delete/${id}/`);
  return data;
};

export const createAccount = async (payload) => {
  const { data } = await api.post("/account/add/", payload);
  return data;
};

// NOTE: switched to PUT for consistency with updateLead/updateDeal.
// Revert to POST if your backend route specifically expects it.
export const updateAccount = async (id, payload) => {
  const { data } = await api.put(`/account/update/${id}/`, payload);
  return data;
};