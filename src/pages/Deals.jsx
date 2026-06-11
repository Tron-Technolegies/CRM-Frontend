import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

import DealsKpis from "../components/deals/DealsKpis";
import DealsList from "../components/deals/DealsList";
import DealFormModal from "../components/deals/DealFormModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useToast } from "../components/ui/toastContext.js";

const api = axios.create({
  baseURL: "http://localhost:8000/api/admin",
});

export default function Deals() {
  const { pushToast } = useToast();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editDeal, setEditDeal] = useState(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchDeals = () => {
    api.get("/deal/view/")
      .then((res) => setDeals(res.data))
      .catch((err) => {
        console.error("Failed to fetch deals:", err);
        pushToast({ title: "Failed to load deals", variant: "error" });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const requestDelete = (id) => {
    setDeleteTargetId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/deal/delete/${deleteTargetId}/`);
      setDeals((prev) => prev.filter((d) => d.id !== deleteTargetId));
      pushToast({ title: "Deal deleted", variant: "success" });
    } catch (err) {
      console.error("Delete failed:", err);
      pushToast({ title: "Failed to delete deal", variant: "error" });
    } finally {
      setDeleteLoading(false);
      setConfirmDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  const addDeal = async (form) => {
    setAddLoading(true);
    try {
      await api.post("/deal/add/", {
        deal_name: form.dealName.trim(),
        company_name: form.companyName.trim(),
        deal_amount: Number(form.dealAmount),
        stage: form.stage,
        assigned_to: null,
        expected_close_date: form.expectedCloseDate,
        deal_source: form.dealSource,
        priority: form.priority,
        deal_description: form.description.trim(),
        lead_id: form.leadId || null, 
      });
      fetchDeals();
      pushToast({ title: "Deal created", message: `${form.dealName} added successfully`, variant: "success" });
    } catch (err) {
      console.error("Add deal failed:", err);
      pushToast({ title: "Failed to add deal", variant: "error" });
    } finally {
      setAddLoading(false);
      setAddOpen(false);
    }
  };

  const updateDeal = async (form) => {
    setAddLoading(true);
    try {
      await api.put(`/deal/update/${editDeal.id}/`, {
        deal_name: form.dealName.trim(),
        company_name: form.companyName.trim(),
        deal_amount: Number(form.dealAmount),
        stage: form.stage,
        expected_close_date: form.expectedCloseDate,
        deal_source: form.dealSource,
        priority: form.priority,
        deal_description: form.description.trim(),
      });
      fetchDeals();
      pushToast({ title: "Deal updated", message: `${form.dealName} updated successfully`, variant: "success" });
    } catch (err) {
      console.error("Update deal failed:", err);
      pushToast({ title: "Failed to update deal", variant: "error" });
    } finally {
      setAddLoading(false);
      setEditDeal(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[#64748B]">Loading deals...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#111827]">Deals</h1>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} />
          Add Deal
        </button>
      </div>

      <DealsKpis deals={deals} />
      <DealsList deals={deals} onDelete={requestDelete} onEdit={(deal) => setEditDeal(deal)} />

      {/* Add modal */}
      <DealFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={addDeal}
        loading={addLoading}
      />

      {/* Edit modal */}
      <DealFormModal
        open={!!editDeal}
        onClose={() => setEditDeal(null)}
        onSubmit={updateDeal}
        loading={addLoading}
        initialData={editDeal}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete deal?"
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