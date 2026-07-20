import api from "./Api";

export const getCustomers = () => {
  return api.get("/customer/view/");
};

export const getCustomer = (id) => {
  return api.get(`/customer/single/view/${id}/`);
};

export const createCustomer = (data) => {
  return api.post("/customer/add/", data);
};

export const updateCustomer = (id, data) => {
  return api.put(`/customer/update/${id}/`, data);
};

export const deleteCustomer = (id) => {
  return api.delete(`/customer/delete/${id}/`);
};