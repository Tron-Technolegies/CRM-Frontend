let lineKeyCounter = 0;
const nextLineKey = () => `line-${Date.now()}-${lineKeyCounter++}`;

export const emptyLineItem = () => ({
  key: nextLineKey(),
  productId: "",
  productName: "",
  description: "",
  quantity: 1,
  listPrice: 0,
  discount: 0,
  tax: 0,
});

export const lineTotal = (line) => {
  const amount = Number(line.quantity || 0) * Number(line.listPrice || 0);
  const discounted = amount - Number(line.discount || 0);
  const taxAmount = discounted * (Number(line.tax || 0) / 100);
  return discounted + taxAmount;
};

const emptyAddress = () => ({
  country: "",
  address: "",
  streetAdd: "",
  city: "",
  state: "",
  zipCode: "",
});

export const blankQuoteForm = () => ({
  subject: "",
  quoteStage: "draft",
  validUntil: "",
  dealId: "",
  accountId: "",
  accountName: "",
  customerId: "",
  customerName: "",
  contactName: "",
  carrier: "",
  team: "",
  assignedTo: "",
  billingAddress: emptyAddress(),
  shippingAddress: emptyAddress(),
  copyBilling: false,
  termsConditions: "",
  description: "",
  products: [emptyLineItem()],
});

export const fromApiResponse = (data) => ({
  subject: data.subject || "",
  quoteStage: data.quoteStage || "draft",
  validUntil: data.validUntil || "",
  dealId: data.dealId ? String(data.dealId) : "",
  accountId: data.accountId ? String(data.accountId) : "",
  accountName: data.accountName || "",
  customerId: data.customerId ? String(data.customerId) : "",
  customerName: data.customerName || "",
  contactName: data.contactName || "",
  carrier: data.carrier || "",
  team: data.team || "",
  assignedTo: data.assignedToId ? String(data.assignedToId) : "",
  billingAddress: data.billingAddress
    ? {
        country: data.billingAddress.country || "",
        address: data.billingAddress.address || "",
        streetAdd: data.billingAddress.streetAdd || data.billingAddress.street_address || "",
        city: data.billingAddress.city || "",
        state: data.billingAddress.state || "",
        zipCode: data.billingAddress.zipCode || "",
      }
    : emptyAddress(),
  shippingAddress: data.shippingAddress
    ? {
        country: data.shippingAddress.country || "",
        address: data.shippingAddress.address || "",
        streetAdd: data.shippingAddress.streetAdd || data.shippingAddress.street_address || "",
        city: data.shippingAddress.city || "",
        state: data.shippingAddress.state || "",
        zipCode: data.shippingAddress.zipCode || "",
      }
    : emptyAddress(),
  copyBilling: false,
  termsConditions: data.termsConditions || "",
  description: data.description || "",
  products: Array.isArray(data.products) && data.products.length
    ? data.products.map((p) => ({
        key: nextLineKey(),
        productId: p.productId ? String(p.productId) : "",
        productName: p.product || "",
        description: p.description || "",
        quantity: p.quantity || 1,
        listPrice: p.listPrice || 0,
        discount: p.discount || 0,
        tax: p.tax || 0,
      }))
    : [emptyLineItem()],
});

// Note: account_id / customer_id are NOT required here — the backend derives
// them from deal_id. They're included as a fallback in case a quote is ever
// created without a linked deal.
export const toApiPayload = (form) => ({
  subject: form.subject,
  quote_stage: form.quoteStage,
  valid_until: form.validUntil || null,
  assigned_to: form.assignedTo || null,
  deal_id: form.dealId || null,
  account_id: form.accountId || null,
  customer_id: form.customerId || null,
  contact_name: form.contactName,
  carrier: form.carrier,
  team: form.team,
  billing_add: {
    country: form.billingAddress.country,
    address: form.billingAddress.address,
    street_address: form.billingAddress.streetAdd,
    city: form.billingAddress.city,
    state: form.billingAddress.state,
    zip_code: form.billingAddress.zipCode,
  },
  shipping_add: {
    country: form.shippingAddress.country,
    address: form.shippingAddress.address,
    street_address: form.shippingAddress.streetAdd,
    city: form.shippingAddress.city,
    state: form.shippingAddress.state,
    zip_code: form.shippingAddress.zipCode,
  },
  terms_conditions: form.termsConditions,
  description: form.description,
  products: form.products
    .filter((l) => l.productId)
    .map((l) => ({
      product: l.productId,
      description: l.description,
      quantity: l.quantity,
      discount: l.discount,
    })),
});