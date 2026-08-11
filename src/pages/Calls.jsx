import { useEffect, useState } from "react";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import CallsTable from "../components/Calls/CallsTable";
import AddCall from "../components/Calls/AddCall";
import CallViewModal from "../components/Calls/CallViewModal";
import { useToast } from "../components/ui/toastContext";
import { Plus } from "lucide-react";

import {
  getCalls,
  createCall,
  updateCall,
  deleteCall,
} from "../api/call";

import { createTask } from "../api/task";

import { getStaff } from "../api/staff";
import { getLeads } from "../api/lead";
import { getCustomers } from "../api/customer";
import { getDeals } from "../api/deal";
import { getAccounts } from "../api/account";

export default function Calls() {
  const { pushToast } = useToast();

  const [calls, setCalls] = useState([]);
  const [staff, setStaff] = useState([]);
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [deals, setDeals] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editCall, setEditCall] = useState(null);

  const [viewCallId, setViewCallId] = useState(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCalls = async () => {
    try {
      const { data } = await getCalls();
      setCalls(data);
    } catch (err) {
      console.error(err);
      pushToast({ title: "Failed to load calls", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const staffData = await getStaff();
      const leadData = await getLeads();
      const customerData = await getCustomers();
      const dealData = await getDeals();
      const accountData = await getAccounts();

      setStaff(staffData);
      setLeads(leadData);
      setCustomers(customerData);
      setDeals(dealData);
      setAccounts(accountData);
    } catch (err) {
      console.error("Failed to load dropdown data:", err);
    }
  };

  useEffect(() => {
    fetchCalls();
    fetchDropdowns();
  }, []);

  const requestDelete = (id) => {
    setDeleteTargetId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;

    setDeleteLoading(true);

    try {
      await deleteCall(deleteTargetId);
      setCalls((prev) => prev.filter((call) => call.id !== deleteTargetId));
      pushToast({ title: "Call deleted", variant: "success" });
    } catch (err) {
      console.error(err);
      pushToast({ title: "Failed to delete call", variant: "error" });
    } finally {
      setDeleteLoading(false);
      setConfirmDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  const handleAddCall = async (form, taskPayload) => {
    setAddLoading(true);

    try {
      await createCall(form);

      if (taskPayload) {
        try {
          await createTask(taskPayload);
        } catch (taskErr) {
          console.error("Failed to create follow-up task:", taskErr);
          pushToast({ title: "Call created, but follow-up task failed", variant: "error" });
        }
      }

      await fetchCalls();
      pushToast({ title: "Call created", variant: "success" });
      setAddOpen(false);
    } catch (err) {
      console.error(err);
      pushToast({ title: "Failed to create call", variant: "error" });
    } finally {
      setAddLoading(false);
    }
  };

  const handleUpdateCall = async (form, taskPayload) => {
    if (!editCall) return;

    setAddLoading(true);

    try {
      await updateCall(editCall.id, form);

      if (taskPayload) {
        try {
          await createTask(taskPayload);
        } catch (taskErr) {
          console.error("Failed to create follow-up task:", taskErr);
          pushToast({ title: "Call updated, but follow-up task failed", variant: "error" });
        }
      }

      await fetchCalls();
      pushToast({ title: "Call updated", variant: "success" });
      setEditCall(null);
    } catch (err) {
      console.error(err);
      pushToast({ title: "Failed to update call", variant: "error" });
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[#64748B]">Loading calls...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-5">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-[28px] font-bold text-[#111827]">Calls</h1>

          <button
            onClick={() => setAddOpen(true)}
            className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Log Call
          </button>
        </div>

        <CallsTable
          calls={calls}
          loading={loading}
          onDelete={requestDelete}
          onEdit={(call) => setEditCall(call)}
          onView={(id) => setViewCallId(id)}
        />
      </div>

      <AddCall
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAddCall}
        loading={addLoading}
        staff={staff}
        leads={leads}
        customers={customers}
        deals={deals}
        accounts={accounts}
      />

      <AddCall
        open={!!editCall}
        onClose={() => setEditCall(null)}
        onSubmit={handleUpdateCall}
        loading={addLoading}
        initialData={editCall}
        staff={staff}
        leads={leads}
        customers={customers}
        deals={deals}
        accounts={accounts}
      />

      <CallViewModal
        open={!!viewCallId}
        onClose={() => setViewCallId(null)}
        callId={viewCallId}
        onEdit={(call) => setEditCall(call)}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete call?"
        description="This action cannot be undone."
        confirmText="Delete"
        danger
        loading={deleteLoading}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}