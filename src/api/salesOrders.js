import api from "./Api";

export const getSalesOrders = async () => {
  const { data } = await api.get("/salesorder/view/");
  return data;
};

export const getSalesOrder = async (id) => {
  const { data } = await api.get(`/salesorder/single/view/${id}/`);
  return data;
};

export const addSalesOrder = async (payload) => {
  const { data } = await api.post("/salesorder/add/", payload);
  return data;
};

export const updateSalesOrder = async (id, payload) => {
  const { data } = await api.put(`/salesorder/update/${id}/`, payload);
  return data;
};

export const deleteSalesOrder = async (id) => {
  const { data } = await api.delete(`/salesorder/delete/${id}/`);
  return data;
};

export const getQuotePrefill = async (quoteId) => {
  const { data } = await api.get(
    `/salesorder/quote-prefill/${quoteId}/`
  );
  return data;
};