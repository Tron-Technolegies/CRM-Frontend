import api from "./Api";

export const getDeals = async () => {
  const { data } = await api.get("/deal/view/");
  return data;
};

export const addDeal = async (payload) => {
  return await api.post("/deal/add/", payload);
};

export const updateDeal = async (id, payload) => {
  return await api.put(`/deal/update/${id}/`, payload);
};

export const deleteDeal = async (id) => {
  return await api.delete(`/deal/delete/${id}/`);
};