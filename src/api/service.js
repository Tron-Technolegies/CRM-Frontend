import api from "./Api";

export const getServices = async () => {
  const { data } = await api.get("/service/view/");
  return data;
};

export const getService = async (id) => {
  const { data } = await api.get(`/service/single/view/${id}/`);
  return data;
};

export const createService = async (payload) => {
  const { data } = await api.post("/service/add/", payload);
  return data;
};

export const updateService = async (id, payload) => {
  const { data } = await api.put(`/service/update/${id}/`, payload);
  return data;
};

export const deleteService = async (id) => {
  const { data } = await api.delete(`/service/delete/${id}/`);
  return data;
};