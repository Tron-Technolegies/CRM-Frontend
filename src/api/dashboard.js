import api from "./Api";

export const getDashboardReport = async () => {
  const { data } = await api.get("/report/dashboard/");
  return data;
};