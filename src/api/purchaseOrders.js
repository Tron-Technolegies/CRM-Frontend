import api from "./Api";

export const getPurchaseOrders = async () => {
  const { data } = await api.get("/purchaseorder/view/");
  return data;
};

export const getPurchaseOrder = async (id) => {
  const { data } = await api.get(`/purchaseorder/single/view/${id}/`);
  return data;
};

export const addPurchaseOrder = async (payload) => {
  const { data } = await api.post("/purchaseorder/add/", payload);
  return data;
};

export const updatePurchaseOrder = async (id, payload) => {
  const { data } = await api.put(`/purchaseorder/update/${id}/`, payload);
  return data;
};

export const deletePurchaseOrder = async (id) => {
  const { data } = await api.delete(`/purchaseorder/delete/${id}/`);
  return data;
};