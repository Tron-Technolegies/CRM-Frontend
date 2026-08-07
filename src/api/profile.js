import api from "./Api";

export const getProfile = async () => {
  const { data } = await api.get("/profile/view/");
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.patch("/profile/update/", payload);
  return data;
};