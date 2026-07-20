import { Plus } from "lucide-react";
import { useState } from "react";

import DealsKpis from "../components/deals/DealsKpis";
import DealsList from "../components/deals/DealsList";
import DealFormModal from "../components/deals/DealFormModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useToast } from "../components/ui/toastContext";

import useDeal from "../hooks/useDeal";

import {
  addDeal,
  updateDeal,
  deleteDeal,
} from "../api/deal";

export default function Deals() {
  const { pushToast } = useToast();

  const {
    deals,
    loading,
    fetchDeals,
    setDeals,
  } = useDeal();

  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editDeal, setEditDeal] = useState(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const requestDelete = (id) => {
    setDeleteTargetId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;

    setDeleteLoading(true);

    try {
      await deleteDeal(deleteTargetId);

      setDeals((prev) =>
        prev.filter((deal) => deal.id !== deleteTargetId)
      );

      pushToast({
        title: "Deal deleted",
        variant: "success",
      });
    } catch (err) {
      console.error(err);

      pushToast({
        title: "Failed to delete deal",
        variant: "error",
      });
    } finally {
      setDeleteLoading(false);
      setConfirmDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  const handleAddDeal = async (form) => {
    setAddLoading(true);

    try {
      await addDeal({
        deal_name: form.dealName.trim(),
        company_name: form.companyName.trim(),
        deal_amount: Number(form.dealAmount),
        stage: form.stage,
        assigned_to: form.assignedTo || null,
        expected_close_date: form.expectedCloseDate || null,
        deal_source: form.dealSource,
        priority: form.priority,
        deal_description: form.description.trim(),
        lead_id: form.leadId || null,
      });

      await fetchDeals();

      pushToast({
        title: "Deal created",
        message: `${form.dealName} added successfully`,
        variant: "success",
      });
    } catch (err) {
      console.error(err);

      pushToast({
        title: "Failed to add deal",
        variant: "error",
      });
    } finally {
      setAddLoading(false);
      setAddOpen(false);
    }
  };

  const handleUpdateDeal = async (form) => {
    if (!editDeal) return;

    setAddLoading(true);

    try {
      await updateDeal(editDeal.id, {
        deal_name: form.dealName.trim(),
        company_name: form.companyName.trim(),
        deal_amount: Number(form.dealAmount),
        stage: form.stage,
        assigned_to: form.assignedTo || null,
        expected_close_date: form.expectedCloseDate || null,
        deal_source: form.dealSource,
        priority: form.priority,
        deal_description: form.description.trim(),
      });

      await fetchDeals();

      pushToast({
        title: "Deal updated",
        message: `${form.dealName} updated successfully`,
        variant: "success",
      });
    } catch (err) {
      console.error(err);

      pushToast({
        title: "Failed to update deal",
        variant: "error",
      });
    } finally {
      setAddLoading(false);
      setEditDeal(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[#64748B]">
          Loading deals...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#111827]">
          Deals
        </h1>

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

      <DealsList
        deals={deals}
        onDelete={requestDelete}
        onEdit={setEditDeal}
      />

      <DealFormModal
        open={addOpen || !!editDeal}
        onClose={() => {
          setAddOpen(false);
          setEditDeal(null);
        }}
        onSubmit={editDeal ? handleUpdateDeal : handleAddDeal}
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
        onCancel={() => {
          if (!deleteLoading) {
            setConfirmDeleteOpen(false);
          }
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}