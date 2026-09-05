import api from "./Api";

export const getCalls = () => api.get("/call/view/");

export const getCall = (id) =>
  api.get(`/call/single/view/${id}/`);

export const createCall = (data) =>
  api.post("/call/add/", data);

export const updateCall = (id, data) =>
  api.put(`/call/update/${id}/`, data);

export const deleteCall = (id) =>
  api.delete(`/call/delete/${id}/`);

export const dialOut = (data) =>
  api.post("/calls/dial-out/", data);

export const getCallHistory = (params) =>
  api.get("/calls/history/", { params });