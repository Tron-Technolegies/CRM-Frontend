
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import LeadsKpis from "../components/leads/LeadsKpis";
import LeadsList from "../components/leads/LeadsList";
import LeadFormModal from "../components/leads/LeadFormModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useToast } from "../components/ui/toastContext.js";

const initialLeads = [
  {
    id: 1,
    name: "John Smith",
    phone: "+1 555-123-4567",
    email: "john.smith@email.com",
    source: "Website",
    status: "New",
    assignedTo: "Mark Brown",
    dateAdded: "May 18, 2025",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    phone: "+1 555-234-5678",
    email: "sarah.o@email.com",
    source: "WhatsApp",
    status: "Contacted",
    assignedTo: "David Lee",
    dateAdded: "May 18, 2025",
  },
  {
    id: 3,
    name: "Michael Lee",
    phone: "+1 555-345-6789",
    email: "michael.lee@email.com",
    source: "Facebook Ads",
    status: "Qualified",
    assignedTo: "Mark Brown",
    dateAdded: "May 17, 2025",
  },
  {
    id: 4,
    name: "Emily Davis",
    phone: "+1 555-456-7890",
    email: "emily.davis@email.com",
    source: "Referral",
    status: "New",
    assignedTo: "Sarah Wilson",
    dateAdded: "May 17, 2025",
  },
  {
    id: 5,
    name: "Daniel Wilson",
    phone: "+1 555-567-8901",
    email: "daniel.w@email.com",
    source: "Website",
    status: "Contacted",
    assignedTo: "David Lee",
    dateAdded: "May 16, 2025",
  },
  {
    id: 6,
    name: "Jessica Brown",
    phone: "+1 555-678-9012",
    email: "jessica.b@email.com",
    source: "Google Ads",
    status: "Qualified",
    assignedTo: "Sarah Wilson",
    dateAdded: "May 16, 2025",
  },
  {
    id: 7,
    name: "Chris Martin",
    phone: "+1 555-789-0123",
    email: "chris.martin@email.com",
    source: "WhatsApp",
    status: "Converted",
    assignedTo: "Mark Brown",
    dateAdded: "May 15, 2025",
  },
  {
    id: 8,
    name: "Laura Taylor",
    phone: "+1 555-890-1234",
    email: "laura.taylor@email.com",
    source: "Website",
    status: "Converted",
    assignedTo: "David Lee",
    dateAdded: "May 15, 2025",
  },
];

export default function LeadsManagement() {
  const { pushToast } = useToast();
  const [leads, setLeads] = useState(initialLeads);
  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const nextId = useMemo(() => Math.max(0, ...leads.map((l) => l.id)) + 1, [leads]);

  const requestDelete = (id) => {
    setDeleteTargetId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);

    await new Promise((r) => window.setTimeout(r, 700));

    setLeads((prev) => prev.filter((l) => l.id !== deleteTargetId));
    setDeleteLoading(false);
    setConfirmDeleteOpen(false);
    setDeleteTargetId(null);
    pushToast({ title: "Lead deleted", variant: "success" });
  };

  const addLead = async (form) => {
    setAddLoading(true);
    await new Promise((r) => window.setTimeout(r, 700));

    const newLead = {
      id: nextId,
      name: form.fullName.trim(),
      phone: `${form.countryCode} ${form.phoneNumber.trim()}`,
      email: form.email.trim(),
      source: form.leadSource,
      status: "New",
      assignedTo: form.assignedTo,
      dateAdded: "Today",
    };

    setLeads((prev) => [newLead, ...prev]);
    setAddLoading(false);
    setAddOpen(false);
    pushToast({ title: "Lead created", message: `${newLead.name} added successfully`, variant: "success" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#111827]">Leads</h1>

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2"
        >
          <Plus size={18} />
          Add Lead
        </button>
      </div>

      <LeadsKpis />
      <LeadsList leads={leads} onDelete={requestDelete} />

      <LeadFormModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={addLead} loading={addLoading} />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete lead?"
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
