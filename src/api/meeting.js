import api from "./Api";

export const getMeetings = async () => {
  const { data } = await api.get("/meeting/view/");
  return data;
};

export const getMeeting = async (id) => {
  const { data } = await api.get(`/meeting/single/view/${id}/`);
  return data;
};

export const createMeeting = async (payload) => {
  const { data } = await api.post("/meeting/add/", payload);
  return data;
};

export const updateMeeting = async (id, payload) => {
  const { data } = await api.put(`/meeting/update/${id}/`, payload);
  return data;
};

export const deleteMeeting = async (id) => {
  const { data } = await api.delete(`/meeting/delete/${id}/`);
  return data;
};