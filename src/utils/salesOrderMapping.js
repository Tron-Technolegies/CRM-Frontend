export const emptyAddress = () => ({
  country: "",
  address: "",
  streetAdd: "",
  city: "",
  state: "",
  zipCode: "",
});

export const emptyLineItem = () => ({
  key: crypto.randomUUID(),
  productId: "",
  productName: "",
  serviceId: "",
  serviceName: "",
  description: "",
  quantity: 1,
  listPrice: 0,
  discount: 0,
  tax: 0,
});

export const blankSalesOrderForm = () => ({
  subject: "",
  status: "created",
  ownerId: "",
  accountId: "",
  accountName: "",
  customerId: "",
  customerName: "",
  quoteId: "",
  dealId: "",
  contactName: "", // UI only — not stored on SalesOrder model, see note above
  purchaseOrderNumber: "",
  carrier: "",
  salesCommission: 0,
  dueDate: "",
  exciseDuty: 0,
  pending: "", // UI only — not stored on SalesOrder model
  termsAndConditions: "",
  description: "",
  billingAddress: emptyAddress(),
  shippingAddress: emptyAddress(),
  copyBilling: false,
  items: [emptyLineItem()],
});

// GET /salesorder/single/view/<id>/ -> form shape
export const fromApiResponse = (data) => ({
  subject: data.subject || "",
  status: data.status || "created",
  ownerId: data.ownerId || "",
  accountId: data.accountId != null ? String(data.accountId) : "",
  accountName: data.accountName || "",
  customerId: data.customerId || "",
  customerName: data.customerName || "",
  quoteId: data.quoteId || "",
  dealId: data.dealId || "",
  contactName: "",
  purchaseOrderNumber: data.purchaseOrderNumber || "",
  carrier: data.carrier || "",
  salesCommission: data.salesCommission ?? 0,
  dueDate: data.dueDate || "",
  exciseDuty: data.exciseDuty ?? 0,
  pending: "",
  termsAndConditions: data.termsAndConditions || "",
  description: data.description || "",
  billingAddress: {
    country: data.billingAddress?.country || "",
    address: data.billingAddress?.address || "",
    streetAdd: data.billingAddress?.streetAddress || "",
    city: data.billingAddress?.city || "",
    state: data.billingAddress?.state || "",
    zipCode: data.billingAddress?.zipCode || "",
  },
  shippingAddress: {
    country: data.shippingAddress?.country || "",
    address: data.shippingAddress?.address || "",
    streetAdd: data.shippingAddress?.streetAddress || "",
    city: data.shippingAddress?.city || "",
    state: data.shippingAddress?.state || "",
    zipCode: data.shippingAddress?.zipCode || "",
  },
  copyBilling: false,
  items:
    Array.isArray(data.items) && data.items.length > 0
      ? data.items.map((item) => ({
          key: crypto.randomUUID(),
          productId: item.productId || "",
          productName: item.productName || "",
          serviceId: item.serviceId || "",
          serviceName: item.serviceName || "",
          description: item.description || "",
          quantity: item.quantity ?? 1,
          listPrice: item.listPrice ?? 0,
          discount: item.discount ?? 0,
          tax: item.tax ?? 0,
        }))
      : [emptyLineItem()],
});

// form shape -> payload for add_sales_order / update_sales_order
export const toApiPayload = (form) => {
  const mapAddress = (addr) => {
    if (!addr) return null;
    const hasContent = addr.address || addr.streetAdd || addr.city || addr.state || addr.zipCode || addr.country;
    if (!hasContent) return null;
    return {
      country: addr.country || "",
      address: addr.address || "",
      // Sales order backend reads "street_add", NOT "street_address" like Quotes does.
      street_add: addr.streetAdd || "",
      city: addr.city || "",
      state: addr.state || "",
      zip_code: addr.zipCode || "",
    };
  };

  return {
    subject: form.subject,
    status: form.status,
    owner_id: form.ownerId || null,
    account_id: form.accountId || null,
    customer_id: form.customerId || null,
    quote_id: form.quoteId || null,
    deal_id: form.dealId || null,
    purchase_order_number: form.purchaseOrderNumber,
    carrier: form.carrier,
    sales_commission: Number(form.salesCommission) || 0,
    due_date: form.dueDate || null,
    excise_duty: Number(form.exciseDuty) || 0,
    terms_and_conditions: form.termsAndConditions,
    description: form.description,
    billing_add: mapAddress(form.billingAddress),
    shipping_add: form.copyBilling ? mapAddress(form.billingAddress) : mapAddress(form.shippingAddress),
    items: (form.items || [])
      .filter((i) => i.productId || i.serviceId)
      .map((i) => ({
        product_id: i.productId || null,
        service_id: i.serviceId || null,
        quantity: Number(i.quantity) || 1,
        list_price: Number(i.listPrice) || 0,
        discount: Number(i.discount) || 0,
        tax: Number(i.tax) || 0,
        description: i.description || "",
      })),
  };
};

// Matches SalesOrderItem.save(): line_total = (list_price * quantity) - discount + tax
// Tax here is a flat amount ADDED — not a percentage like in Quotes.
export const lineTotal = (item) => {
  const amount = Number(item.quantity || 0) * Number(item.listPrice || 0);
  return amount - Number(item.discount || 0) + Number(item.tax || 0);
};

// GET /quote/prefill/<quote_id>/ -> patch applied onto the sales order form
export const fromQuotePrefill = (data) => ({
  subject: data.subject || "",

  accountId: data.accountId != null ? String(data.accountId) : "",
  accountName: data.accountName || "",
  customerId: data.customerId != null ? String(data.customerId) : "",
  customerName: data.customerName || "",

  contactName: data.contactName || "",
  dealId: data.dealId != null ? String(data.dealId) : "",

  billingAddress: data.billingAddress,
  shippingAddress: data.shippingAddress,
  items:
    Array.isArray(data.items) && data.items.length > 0
      ? data.items.map((item) => ({
          key: crypto.randomUUID(),
          productId: item.productId || "",
          productName: item.productName || "",
          serviceId: item.serviceId || "",
          serviceName: item.serviceName || "",
          description: item.description || "",
          quantity: item.quantity ?? 1,
          listPrice: item.listPrice ?? 0,
          discount: item.discount ?? 0,
          tax: item.tax ?? 0,
        }))
      : [emptyLineItem()],
});