import api from "./Api";

export const addAccount = (data) =>
    api.post("account/add/", data);

export const getAccounts = () =>
    api.get("account/view/");

export const getSingleAccount = (id) =>
    api.get(`account/single/view/${id}/`);

export const updateAccount = (id, data) =>
    api.post(`account/update/${id}/`, data);

export const deleteAccount = (id) =>
    api.delete(`account/delete/${id}/`);