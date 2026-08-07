import api from "./Api";

export const getInvoices = async () => {
  const { data } = await api.get("/invoice/view/");
  return data;
};

export const getInvoice = async (id) => {
  const { data } = await api.get(`/invoice/single/view/${id}/`);
  return data;
};

export const addInvoice = async (payload) => {
  return await api.post("/invoice/add/", payload);
};

export const updateInvoice = async (id, payload) => {
  return await api.put(`/invoice/update/${id}/`, payload);
};

export const deleteInvoice = async (id) => {
  return await api.delete(`/invoice/delete/${id}/`);
};

export const getSalesOrderPrefill = async (salesOrderId) => {
  const { data } = await api.get(`/invoice/sales-order-prefill/${salesOrderId}/`);
  return data;
};

export const downloadInvoicePdf = async (id, invoiceNumber) => {
  const response = await api.get(`/invoice/${id}/pdf/`, { responseType: "blob" });
  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${invoiceNumber || `invoice_${id}`}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};