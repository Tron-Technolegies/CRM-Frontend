import api from "./Api";

export const getProducts = async () => {
  const { data } = await api.get("/product/view/");
  return data;
};

export const getProduct = async (id) => {
  const { data } = await api.get(`/product/single/view/${id}/`);
  return data;
};

export const createProduct = async (payload) => {
  const { data } = await api.post("/product/add/", payload);
  return data;
};

export const updateProduct = async (id, payload) => {
  const { data } = await api.put(`/product/update/${id}/`, payload);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/product/delete/${id}/`);
  return data;
};