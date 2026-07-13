import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

import QuotesKpis from "../components/quotes/QuotesKpis";
import QuotesList from "../components/quotes/QuotesList";
import QuoteFormModal from "../components/quotes/QuoteFormModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useToast } from "../components/ui/toastContext.js";

const api = axios.create({
  baseURL: "http://localhost:8000/api/admin",
});

function normalizeAddress(address) {
  if (!address) return null;
  return {
    id: address.id,
    country: address.country || "",
    address: address.address || "",
    street_address: address.street_address || address.streetAddress || "",
    city: address.city || "",
    state: address.state || "",
    zip_code: address.zip_code || address.zipCode || "",
  };
}

function normalizeProduct(product) {
  return {
    id: product.id,
    product: product.product || "",
    description: product.description || "",
    quantity: product.quantity ?? 1,
    list_price: product.list_price ?? "",
    amount: product.amount ?? "",
    discount: product.discount ?? "",
    tax: product.tax ?? "",
    total: product.total ?? "",
  };
}

function normalizeQuote(quote) {
  return {
    id: quote.id,
    subject: quote.subject || "",
    quoteStage: quote.quote_stage || quote.quoteStage || "draft",
    validUntil: quote.valid_until || quote.validUntil || "",
    assignedToId: quote.assigned_to?.id || quote.assigned_to_id || quote.assignedToId || "",
    assignedTo: quote.assigned_to?.fullName || quote.assigned_to?.name || quote.assignedTo || quote.assigned_to_name || "",
    dealId: quote.deal?.id || quote.deal_id || quote.dealId || "",
    dealName: quote.deal?.name || quote.deal?.subject || quote.dealName || quote.deal_name || "",
    contactName: quote.contact_name || quote.contactName || "",
    accountId: quote.account?.id || quote.account_id || quote.accountId || "",
    accountName: quote.account?.account_name || quote.accountName || quote.account_name || "",
    billingAddress: normalizeAddress(quote.billing_address || quote.billingAddress),
    shippingAddress: normalizeAddress(quote.shipping_address || quote.shippingAddress),
    products: Array.isArray(quote.products) ? quote.products.map(normalizeProduct) : Array.isArray(quote.quote_products) ? quote.quote_products.map(normalizeProduct) : [],
    total: quote.total ?? quote.quote_total ?? 0,
    createdAt: quote.created_at || quote.createdAt || null,
  };
}

function trimAddress(address) {
  if (!address || Object.values(address).every((value) => String(value || "").trim() === "")) return null;
  return {
    country: address.country.trim(),
    address: address.address.trim(),
    street_address: address.streetAdd.trim(),
    city: address.city.trim(),
    state: address.state.trim(),
    zip_code: address.zipCode.trim(),
  };
}

function lineTotal(item) {
  const quantity = Number(item.quantity || 0);
  const price = Number(item.list_price || 0);
  const amount = Number(item.amount || quantity * price || 0);
  const discount = Number(item.discount || 0);
  const tax = Number(item.tax || 0);
  const base = Number.isFinite(amount) ? amount : 0;
  const discounted = base - (base * discount) / 100;
  return discounted + (discounted * tax) / 100;
}

function buildProducts(products) {
  return products.map((item) => ({
    product: item.product.trim(),
    description: item.description.trim(),
    quantity: Number(item.quantity || 1),
    list_price: Number(item.list_price || 0),
    amount: Number(item.amount || 0) || Number(item.quantity || 1) * Number(item.list_price || 0),
    discount: Number(item.discount || 0),
    tax: Number(item.tax || 0),
    total: Number(item.total || 0) || lineTotal(item),
  }));
}

export default function Quotes() {
  const { pushToast } = useToast();
  const [quotes, setQuotes] = useState([]);
  const [staff, setStaff] = useState([]);
  const [deals, setDeals] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editQuote, setEditQuote] = useState(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchQuotes = () => {
    api
      .get("/quote/view/")
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setQuotes(data.map(normalizeQuote));
      })
      .catch((error) => {
        console.error("Failed to fetch quotes:", error);
        pushToast({ title: "Failed to load quotes", variant: "error" });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuotes();
    api.get("/staff/view/").then((response) => setStaff(Array.isArray(response.data) ? response.data : [])).catch(() => {});
    api.get("/deal/view/").then((response) => setDeals(Array.isArray(response.data) ? response.data : [])).catch(() => {});
    api.get("/account/view/").then((response) => setAccounts(Array.isArray(response.data) ? response.data : [])).catch(() => {});
  }, []);

  const requestDelete = (id) => {
    setDeleteTargetId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/quote/delete/${deleteTargetId}/`);
      setQuotes((previous) => previous.filter((quote) => quote.id !== deleteTargetId));
      pushToast({ title: "Quote deleted", variant: "success" });
    } catch (error) {
      console.error("Delete failed:", error);
      pushToast({ title: "Failed to delete quote", variant: "error" });
    } finally {
      setDeleteLoading(false);
      setConfirmDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  const addQuote = async (form) => {
    setAddLoading(true);
    try {
      await api.post("/quote/add/", {
        subject: form.subject.trim(),
        quote_stage: form.quoteStage,
        valid_until: form.validUntil || null,
        assigned_to: form.assignedTo || null,
        deal_id: form.dealId || null,
        contact_name: form.contactName.trim(),
        account_id: form.accountId || null,
        billing_add: trimAddress(form.billingAddress),
        shipping_add: trimAddress(form.shippingAddress),
        products: buildProducts(form.products),
      });
      fetchQuotes();
      pushToast({ title: "Quote created", message: `${form.subject} added successfully`, variant: "success" });
    } catch (error) {
      console.error("Add quote failed:", error);
      pushToast({ title: "Failed to add quote", variant: "error" });
    } finally {
      setAddLoading(false);
      setAddOpen(false);
    }
  };

  const updateQuote = async (form) => {
    setAddLoading(true);
    try {
      await api.put(`/quote/update/${editQuote.id}/`, {
        subject: form.subject.trim(),
        quote_stage: form.quoteStage,
        valid_until: form.validUntil || null,
        assigned_to: form.assignedTo || null,
        deal_id: form.dealId || null,
        contact_name: form.contactName.trim(),
        account_id: form.accountId || null,
        billing_add: trimAddress(form.billingAddress),
        shipping_add: trimAddress(form.shippingAddress),
        products: buildProducts(form.products),
      });
      fetchQuotes();
      pushToast({ title: "Quote updated", message: `${form.subject} updated successfully`, variant: "success" });
    } catch (error) {
      console.error("Update quote failed:", error);
      pushToast({ title: "Failed to update quote", variant: "error" });
    } finally {
      setAddLoading(false);
      setEditQuote(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[#64748B]">Loading quotes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#111827]">Quotes</h1>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2"
        >
          <Plus size={18} />
          Add Quote
        </button>
      </div>

      <QuotesKpis quotes={quotes} />
      <QuotesList
        quotes={quotes}
        onDelete={requestDelete}
        onEdit={(quote) => setEditQuote(quote)}
      />

      <QuoteFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={addQuote}
        loading={addLoading}
        staff={staff}
        deals={deals}
        accounts={accounts}
      />

      <QuoteFormModal
        open={!!editQuote}
        onClose={() => setEditQuote(null)}
        onSubmit={updateQuote}
        loading={addLoading}
        initialData={editQuote}
        staff={staff}
        deals={deals}
        accounts={accounts}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete quote?"
        description="This action cannot be undone."
        confirmText="Delete"
        danger
        loading={deleteLoading}
        onCancel={() => (deleteLoading ? null : setConfirmDeleteOpen(false))}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
