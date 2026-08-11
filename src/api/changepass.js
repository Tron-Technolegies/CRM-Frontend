import api from "./Api";

export const changePassword = async (payload) => {
  const { data } = await api.post("/change-password/", payload);
  return data;
};