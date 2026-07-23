import api from "./Api";

export const getDeals = async () => {
  const { data } = await api.get("/deal/view/");
  return data;
};

export const getDeal = async (id) => {
  const { data } = await api.get(`/deal/single/view/${id}/`);
  return data;
};

export const addDeal = async (payload) => {
  const { data } = await api.post("/deal/add/", payload);
  return data;
};

export const updateDeal = async (id, payload) => {
  const { data } = await api.put(`/deal/update/${id}/`, payload);
  return data;
};

export const deleteDeal = async (id) => {
  const { data } = await api.delete(`/deal/delete/${id}/`);
  return data;
};