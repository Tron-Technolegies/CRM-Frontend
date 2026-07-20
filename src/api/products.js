import api from "./Api";

export const addProduct = (data) =>
    api.post("product/add/", data);

export const getProducts = () =>
    api.get("product/view/");

export const getSingleProduct = (id) =>
    api.get(`product/single/view/${id}/`);

export const updateProduct = (id, data) =>
    api.put(`product/update/${id}/`, data);

export const deleteProduct = (id) =>
    api.delete(`product/delete/${id}/`);