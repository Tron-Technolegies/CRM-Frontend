import api from "./Api";

export const getTasks = async () => {
  const { data } = await api.get("/task/view/");
  return data;
};

export const getTask = async (id) => {
  const { data } = await api.get(`/task/single/view/${id}/`);
  return data;
};

export const createTask = async (payload) => {
  const { data } = await api.post("/task/add/", payload);
  return data;
};

export const updateTask = async (id, payload) => {
  const { data } = await api.put(`/task/update/${id}/`, payload);
  return data;
};

export const deleteTask = async (id) => {
  const { data } = await api.delete(`/task/delete/${id}/`);
  return data;
};