import api from "./Api";

export const getQuotes = async () => {
  const { data } = await api.get("/quote/view/");
  return data;
};

export const getQuote = async (id) => {
  const { data } = await api.get(`/quote/single/view/${id}/`);
  return data;
};

export const addQuote = async (payload) => {
  const { data } = await api.post("/quote/add/", payload);
  return data;
};

export const updateQuote = async (id, payload) => {
  const { data } = await api.put(`/quote/update/${id}/`, payload);
  return data;
};

export const deleteQuote = async (id) => {
  const { data } = await api.delete(`/quote/delete/${id}/`);
  return data;
};