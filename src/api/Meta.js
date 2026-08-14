import api from "./Api";

// The connect endpoint issues a server-side redirect straight to Facebook's
// OAuth dialog. We deliberately don't call it through Axios — an XHR call
// would try to follow that redirect itself and get blocked by CORS on
// facebook.com. We only need the endpoint's absolute URL so the browser can
// navigate there directly (a real page load, not a fetch).
export const getMetaConnectUrl = () =>
  `${api.defaults.baseURL}integrations/meta/connect/`;

export const getMetaStatus = () => api.get("/integrations/meta/status/");
