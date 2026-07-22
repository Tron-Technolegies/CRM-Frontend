import api from "./Api";

export const getStaff = async () => {
  const { data } = await api.get("/staff/view/");
  return data;
};

export const getSingleStaff = async (id) => {
  const { data } = await api.get(`/staff/single/view/${id}/`);
  return data;
};

export const createStaff = async (payload) => {
  const { data } = await api.post("/staff/add/", payload);
  return data;
};

export const updateStaff = async (id, payload) => {
  const { data } = await api.put(`/staff/update/${id}/`, payload);
  return data;
};

export const deleteStaff = async (id) => {
  const { data } = await api.delete(`/staff/delete/${id}/`);
  return data;
};