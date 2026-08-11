import api from "./Api";

export const getNotificationPreferences = () =>
  api.get("/preferences/").then((res) => res.data);

export const updateNotificationPreferences = (data) =>
  api.put("/preferences/", data).then((res) => res.data);

export const getNotifications = () =>
  api.get("/notifications/").then((res) => res.data);

export const getUnreadCount = () =>
  api.get("/notifications/unread-count/").then((res) => res.data);

export const markNotificationRead = (id) =>
  api.put(`/notifications/${id}/read/`).then((res) => res.data);

export const markAllNotificationsRead = () =>
  api.put("/notifications/read-all/").then((res) => res.data);  