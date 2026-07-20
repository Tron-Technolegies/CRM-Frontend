import api from "./Api";

export const addQuote = (data) =>
    api.post("quote/add/", data);

export const getQuotes = () =>
    api.get("quote/view/");

export const getSingleQuote = (id) =>
    api.get(`quote/single/view/${id}/`);

export const updateQuote = (id, data) =>
    api.post(`quote/update/${id}/`, data);

export const deleteQuote = (id) =>
    api.delete(`quote/delete/${id}/`);

