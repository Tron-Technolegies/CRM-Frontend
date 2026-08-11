import api from "./Api";

export const getVendors = async () => {
  const { data } = await api.get("/vendor/view/");
  return data;
};

export const getVendor = async (id) => {
  const { data } = await api.get(`/vendor/single/view/${id}/`);
  return data;
};

export const createVendor = async (payload) => {
  const { data } = await api.post("/vendor/add/", payload);
  return data;
};

export const updateVendor = async (id, payload) => {
  const { data } = await api.put(`/vendor/update/${id}/`, payload);
  return data;
};

export const deleteVendor = async (id) => {
  const { data } = await api.delete(`/vendor/delete/${id}/`);
  return data;
};

// Requires the get_vendor_prefill view + vendor/prefill/<int:vendor_id>/ URL on the backend.
export const getVendorPrefill = async (vendorId) => {
  const { data } = await api.get(`/vendor/prefill/${vendorId}/`);
  return data;
};