function mapAddressToApi(address) {
  if (!address) return null;
  const hasValue = Object.values(address).some((v) => v && v.toString().trim() !== "");
  if (!hasValue) return null;
  return {
    country: address.country || "",
    address: address.flatNo || "",
    street_address: address.streetAddress || "",
    city: address.city || "",
    state: address.state || "",
    zip_code: address.zipCode || "",
  };
}

function mapAddressFromApi(address) {
  if (!address) {
    return { country: "", flatNo: "", streetAddress: "", city: "", state: "", zipCode: "" };
  }
  return {
    country: address.country || "",
    flatNo: address.address || "",
    streetAddress: address.streetAddress || address.street_address || "",
    city: address.city || "",
    state: address.state || "",
    zipCode: address.zipCode || address.zip_code || "",
  };
}

function mapItemToApi(item) {
  return {
    product_id: item.productId,
    quantity: Number(item.quantity) || 0,
    list_price: Number(item.listPrice) || 0,
    discount: Number(item.discount) || 0,
    tax: Number(item.tax) || 0,
  };
}

function mapItemFromApi(item) {
  return {
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    listPrice: item.listPrice,
    discount: item.discount,
    tax: item.tax,
    lineTotal: item.lineTotal,
  };
}

export function mapInvoiceToApi(form) {
  return {
    subject: form.subject,
    customer_id: form.customerId || null,
    owner_id: form.ownerId || null,
    sales_order_id: form.salesOrderId || null,
    invoice_date: form.invoiceDate || null,
    due_date: form.dueDate || null,
    purchase_order_number: form.purchaseOrderNumber || "",
    status: form.status || "draft",
    terms_and_conditions: form.termsAndConditions || "",
    description: form.description || "",
    billing_add: mapAddressToApi(form.billingAddress),
    shipping_add: mapAddressToApi(form.shippingAddress),
    items: (form.items || []).filter((item) => item.productId).map(mapItemToApi),
  };
}

export function mapInvoiceFromApi(data) {
  if (!data) return null;
  return {
    id: data.id,
    subject: data.subject || "",
    invoiceNumber: data.invoiceNumber || "",
    status: data.status || "draft",
    invoiceDate: data.invoiceDate || "",
    dueDate: data.dueDate || "",
    ownerId: data.ownerId || "",
    customerId: data.customerId || "",
    salesOrderId: data.salesOrderId || "",
    purchaseOrderNumber: data.purchaseOrderNumber || "",
    termsAndConditions: data.termsAndConditions || "",
    description: data.description || "",
    billingAddress: mapAddressFromApi(data.billingAddress),
    shippingAddress: mapAddressFromApi(data.shippingAddress),
    items: (data.items || []).map(mapItemFromApi),
  };
}

export function emptyItem() {
  return { productId: "", productName: "", quantity: 1, listPrice: 0, discount: 0, tax: 0 };
}

export function emptyInvoiceForm() {
  return {
    subject: "",
    ownerId: "",
    salesOrderId: "",
    purchaseOrderNumber: "",
    invoiceDate: "",
    customerId: "",
    dueDate: "",
    status: "draft",
    termsAndConditions: "",
    description: "",
    billingAddress: { country: "", flatNo: "", streetAddress: "", city: "", state: "", zipCode: "" },
    shippingAddress: { country: "", flatNo: "", streetAddress: "", city: "", state: "", zipCode: "" },
    items: [emptyItem()],
  };
}