import api from "./Api";

export const getMetaConnectUrl = () =>
  api.get("/integrations/meta/connect/");

export const getMetaStatus = () =>
  api.get("/integrations/meta/status/");