import { Plus } from "lucide-react";
import { useState } from "react";

import LeadsKpis from "../components/leads/LeadsKpis";
import LeadsList from "../components/leads/LeadsList";
import LeadFormModal from "../components/leads/LeadFormModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useToast } from "../components/ui/toastContext";

import useLead from "../hooks/useLead";
import {
  addLead,
  updateLead,
  deleteLead,
} from "../api/lead";

export default function LeadsManagement() {
  const { pushToast } = useToast();

  const {
    leads,
    staff,
    loading,
    fetchLeads,
    setLeads,
  } = useLead();

  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLead, setEditLead] = useState(null);

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
      await deleteLead(deleteTargetId);

      setLeads((prev) =>
        prev.filter((lead) => lead.id !== deleteTargetId)
      );

      pushToast({
        title: "Lead deleted",
        variant: "success",
      });
    } catch (err) {
      console.error(err);

      pushToast({
        title: "Failed to delete lead",
        variant: "error",
      });
    } finally {
      setDeleteLoading(false);
      setConfirmDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  const handleAddLead = async (form) => {
    setAddLoading(true);

    try {
      await addLead({
        full_name: form.fullName.trim(),
        phone_number: `${form.countryCode} ${form.phoneNumber.trim()}`,
        email: form.email.trim(),
        company_name: form.companyName.trim(),
        lead_source: form.leadSource,
        priority: form.priority,
        expected_closing_date: form.expectedClosingDate || null,
        lead_description: form.description.trim(),
        assigned_to: form.assignedTo || null,
      });

      await fetchLeads();

      pushToast({
        title: "Lead created",
        message: `${form.fullName} added successfully`,
        variant: "success",
      });
    } catch (err) {
      console.error(err);

      pushToast({
        title: "Failed to add lead",
        variant: "error",
      });
    } finally {
      setAddLoading(false);
      setAddOpen(false);
    }
  };

  const handleUpdateLead = async (form) => {
    if (!editLead) return;

    setAddLoading(true);

    try {
      await updateLead(editLead.id, {
        full_name: form.fullName.trim(),
        phone_number: form.phoneNumber.trim(),
        email: form.email.trim(),
        company_name: form.companyName.trim(),
        lead_source: form.leadSource,
        priority: form.priority,
        status: form.status.toLowerCase(),
        expected_closing_date: form.expectedClosingDate || null,
        lead_description: form.description.trim(),
        assigned_to: form.assignedTo || null,
      });

      await fetchLeads();

      pushToast({
        title: "Lead updated",
        message: `${form.fullName} updated successfully`,
        variant: "success",
      });
    } catch (err) {
      console.error(err);

      pushToast({
        title: "Failed to update lead",
        variant: "error",
      });
    } finally {
      setAddLoading(false);
      setEditLead(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[#64748B]">
          Loading leads...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#111827]">
          Leads
        </h1>

        <button
          onClick={() => setAddOpen(true)}
          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2"
        >
          <Plus size={18} />
          Add Lead
        </button>
      </div>

      <LeadsKpis leads={leads} />

      <LeadsList
        leads={leads}
        onDelete={requestDelete}
        onEdit={setEditLead}
      />

      <LeadFormModal
        open={addOpen || !!editLead}
        onClose={() => {
          setAddOpen(false);
          setEditLead(null);
        }}
        onSubmit={editLead ? handleUpdateLead : handleAddLead}
        loading={addLoading}
        initialData={editLead}
        staff={staff}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete lead?"
        description="This action cannot be undone."
        confirmText="Delete"
        danger
        loading={deleteLoading}
        onCancel={() => {
          if (!deleteLoading) setConfirmDeleteOpen(false);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}