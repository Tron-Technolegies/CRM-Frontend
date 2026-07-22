import api from "./Api";

export const getCustomers = async () => {
  const { data } = await api.get("/customer/view/");
  return data;
};

export const getCustomer = async (id) => {
  const { data } = await api.get(`/customer/single/view/${id}/`);
  return data;
};

export const createCustomer = async (payload) => {
  const { data } = await api.post("/customer/add/", payload);
  return data;
};

export const updateCustomer = async (id, payload) => {
  const { data } = await api.put(`/customer/update/${id}/`, payload);
  return data;
};

export const deleteCustomer = async (id) => {
  const { data } = await api.delete(`/customer/delete/${id}/`);
  return data;
};