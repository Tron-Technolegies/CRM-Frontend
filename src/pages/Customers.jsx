import { Plus } from "lucide-react";
import { useState } from "react";

import useCustomers from "../hooks/useCustomers";

import CustomersKpis from "../components/customers/CustomersKpis";
import CustomersList from "../components/customers/CustomersList";
import CustomerFormModal from "../components/customers/CustomerFormModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useToast } from "../components/ui/toastContext";

export default function Customers() {
  const { pushToast } = useToast();

  const {
    customers,
    loading,
    addCustomer: createCustomer,
    editCustomer: updateCustomerApi,
    removeCustomer,
  } = useCustomers();

  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);

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
      await removeCustomer(deleteTargetId);

      pushToast({
        title: "Customer deleted",
        variant: "success",
      });

      setConfirmDeleteOpen(false);
      setDeleteTargetId(null);
    } catch (err) {
      console.error("Delete failed:", err);

      pushToast({
        title: "Failed to delete customer",
        variant: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const addCustomer = async (form) => {
    setAddLoading(true);

    try {
      await createCustomer({
        company_name: form.companyName.trim(),
        contact_name: form.contactName.trim(),
        phone_number: form.phone.trim(),
        email: form.email.trim(),
        industry: form.industry,
        status: form.status.toLowerCase(),
        lifetime_value: Number(form.lifetimeValue || 0),
        deal_id: form.dealId || null,
      });

      pushToast({
        title: "Customer created",
        message: `${form.companyName} added successfully`,
        variant: "success",
      });

      setAddOpen(false);
    } catch (err) {
      console.error("Add customer failed:", err);

      pushToast({
        title: "Failed to add customer",
        variant: "error",
      });
    } finally {
      setAddLoading(false);
    }
  };

  const updateCustomer = async (form) => {
    if (!editCustomer) return;

    setAddLoading(true);

    try {
      await updateCustomerApi(editCustomer.id, {
        company_name: form.companyName.trim(),
        contact_name: form.contactName.trim(),
        phone_number: form.phone.trim(),
        email: form.email.trim(),
        industry: form.industry,
        status: form.status.toLowerCase(),
        lifetime_value: Number(form.lifetimeValue || 0),
      });

      pushToast({
        title: "Customer updated",
        message: `${form.companyName} updated successfully`,
        variant: "success",
      });

      setEditCustomer(null);
    } catch (err) {
      console.error("Update customer failed:", err);

      pushToast({
        title: "Failed to update customer",
        variant: "error",
      });
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[#64748B]">
          Loading customers...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#111827]">
          Customers
        </h1>

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

      <CustomersList
        customers={customers}
        onDelete={requestDelete}
        onEdit={setEditCustomer}
      />

      <CustomerFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={addCustomer}
        loading={addLoading}
      />

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
        onCancel={() =>
          deleteLoading ? null : setConfirmDeleteOpen(false)
        }
        onConfirm={confirmDelete}
      />
    </div>
  );
}