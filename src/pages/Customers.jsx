import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

import CustomersKpis from "../components/customers/CustomersKpis";
import CustomersList from "../components/customers/CustomersList";
import CustomerFormModal from "../components/customers/CustomerFormModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useToast } from "../components/ui/toastContext.js";

const api = axios.create({
  baseURL: "http://localhost:8000/api/admin",
});

export default function Customers() {
  const { pushToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCustomers = () => {
    api.get("/customer/view/")
      .then((res) => setCustomers(res.data))
      .catch((err) => {
        console.error("Failed to fetch customers:", err);
        pushToast({ title: "Failed to load customers", variant: "error" });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const requestDelete = (id) => {
    setDeleteTargetId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/customer/delete/${deleteTargetId}/`);
      setCustomers((prev) => prev.filter((c) => c.id !== deleteTargetId));
      pushToast({ title: "Customer deleted", variant: "success" });
    } catch (err) {
      console.error("Delete failed:", err);
      pushToast({ title: "Failed to delete customer", variant: "error" });
    } finally {
      setDeleteLoading(false);
      setConfirmDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  const addCustomer = async (form) => {
    setAddLoading(true);
    try {
      await api.post("/customer/add/", {
        company_name: form.companyName.trim(),
        contact_name: form.contactName.trim(),
        phone_number: form.phone.trim(),
        email: form.email.trim(),
        industry: form.industry,
        status: form.status.toLowerCase(),
        lifetime_value: Number(form.lifetimeValue || 0),
        deal_id: form.dealId || null,
      });
      fetchCustomers();
      pushToast({ title: "Customer created", message: `${form.companyName} added successfully`, variant: "success" });
    } catch (err) {
      console.error("Add customer failed:", err);
      pushToast({ title: "Failed to add customer", variant: "error" });
    } finally {
      setAddLoading(false);
      setAddOpen(false);
    }
  };

  const updateCustomer = async (form) => {
    setAddLoading(true);
    try {
      await api.put(`/customer/update/${editCustomer.id}/`, {
        company_name: form.companyName.trim(),
        contact_name: form.contactName.trim(),
        phone_number: form.phone.trim(),
        email: form.email.trim(),
        industry: form.industry,
        status: form.status.toLowerCase(),
        lifetime_value: Number(form.lifetimeValue || 0),
      });
      fetchCustomers();
      pushToast({ title: "Customer updated", message: `${form.companyName} updated successfully`, variant: "success" });
    } catch (err) {
      console.error("Update customer failed:", err);
      pushToast({ title: "Failed to update customer", variant: "error" });
    } finally {
      setAddLoading(false);
      setEditCustomer(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[#64748B]">Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#111827]">Customers</h1>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <CustomersKpis customers={customers} />
      <CustomersList customers={customers} onDelete={requestDelete} onEdit={(c) => setEditCustomer(c)} />

      {/* Add modal */}
      <CustomerFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={addCustomer}
        loading={addLoading}
      />

      {/* Edit modal */}
      <CustomerFormModal
        open={!!editCustomer}
        onClose={() => setEditCustomer(null)}
        onSubmit={updateCustomer}
        loading={addLoading}
        initialData={editCustomer}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete customer?"
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