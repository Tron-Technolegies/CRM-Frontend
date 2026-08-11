import api from "./Api";

export const getPicklistOptions = async (field) => {
  const { data } = await api.get(`/picklists/view/?field=${field}`);
  return data;
};

export const createPicklistOption = async (payload) => {
  const { data } = await api.post("/picklists/add/", payload);
  return data;
};

export const updatePicklistOption = async (id, payload) => {
  const { data } = await api.put(`/picklists/update/${id}/`, payload);
  return data;
};

export const deletePicklistOption = async (id) => {
  const { data } = await api.delete(`/picklists/delete/${id}/`);
  return data;
};