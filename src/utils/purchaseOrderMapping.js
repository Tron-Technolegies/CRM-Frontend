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
  description: "",
  quantity: 1,
  listPrice: 0,
  discount: 0,
  tax: 0,
});

export const blankPurchaseOrderForm = () => ({
  subject: "",
  purchaseOrderNumber: "", // read-only, only populated in edit mode
  status: "created",
  ownerId: "",
  vendorId: "",
  purchaseDate: "",
  expectedDeliveryDate: "",
  termsAndConditions: "",
  description: "",
  billingAddress: emptyAddress(),
  shippingAddress: emptyAddress(),
  copyBilling: false,
  items: [emptyLineItem()],
});

// GET /purchaseorder/single/view/<id>/ -> form shape
export const fromApiResponse = (data) => ({
  subject: data.subject || "",
  purchaseOrderNumber: data.purchaseOrderNumber || "",
  status: data.status || "created",
  ownerId: data.ownerId || "",
  vendorId: data.vendorId || "",
  purchaseDate: data.purchaseDate || "",
  expectedDeliveryDate: data.expectedDeliveryDate || "",
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
          description: item.description || "",
          quantity: item.quantity ?? 1,
          listPrice: item.listPrice ?? 0,
          discount: item.discount ?? 0,
          tax: item.tax ?? 0,
        }))
      : [emptyLineItem()],
});

// form shape -> payload for add_purchase_order / update_purchase_order
export const toApiPayload = (form) => {
  const mapAddress = (addr) => {
    if (!addr) return null;
    const hasContent = addr.address || addr.streetAdd || addr.city || addr.state || addr.zipCode || addr.country;
    if (!hasContent) return null;
    return {
      country: addr.country || "",
      address: addr.address || "",
      street_add: addr.streetAdd || "", // matches shared _create_address/_update_address helper
      city: addr.city || "",
      state: addr.state || "",
      zip_code: addr.zipCode || "",
    };
  };

  return {
    subject: form.subject,
    status: form.status,
    owner_id: form.ownerId || null,
    vendor_id: form.vendorId || null,
    purchase_date: form.purchaseDate || null,
    expected_delivery_date: form.expectedDeliveryDate || null,
    terms_and_conditions: form.termsAndConditions,
    description: form.description,
    billing_add: mapAddress(form.billingAddress),
    shipping_add: form.copyBilling ? mapAddress(form.billingAddress) : mapAddress(form.shippingAddress),
    items: (form.items || [])
      .filter((i) => i.productId)
      .map((i) => ({
        product_id: i.productId,
        quantity: Number(i.quantity) || 1,
        list_price: Number(i.listPrice) || 0,
        discount: Number(i.discount) || 0,
        tax: Number(i.tax) || 0,
        description: i.description || "",
      })),
  };
};

// Matches PurchaseOrderItem.save(): line_total = (list_price * quantity) - discount + tax
export const lineTotal = (item) => {
  const amount = Number(item.quantity || 0) * Number(item.listPrice || 0);
  return amount - Number(item.discount || 0) + Number(item.tax || 0);
};