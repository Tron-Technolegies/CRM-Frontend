import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

import AccountsKpis from "../components/accounts/AccountsKpis";
import AccountsList from "../components/accounts/AccountsList";
import AccountFormModal from "../components/accounts/AccountFormModal";
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

function normalizeAccount(account) {
  return {
    id: account.id,
    accountName: account.account_name || account.accountName || "",
    assignedToId: account.assigned_to?.id || account.assigned_to_id || account.assignedToId || "",
    assignedTo:
      account.assigned_to?.fullName ||
      account.assigned_to?.name ||
      account.assignedTo ||
      account.assigned_to_name ||
      "",
    phoneNumber: account.phone_number || account.phoneNumber || "",
    accountSite: account.account_site || account.accountSite || "",
    parentAccountId: account.parent_account?.id || account.parent_account_id || account.parentAccountId || "",
    parentAccount:
      account.parent_account?.account_name ||
      account.parentAccount ||
      account.parent_account_name ||
      "",
    website: account.website || "",
    accountType: account.account_type || account.accountType || "",
    industry: account.industry || "",
    ownership: account.ownership || "",
    employees: account.employees || "",
    billingAddress: normalizeAddress(account.billing_address || account.billingAddress),
    shippingAddress: normalizeAddress(account.shipping_address || account.shippingAddress),
    createdAt: account.created_at || account.createdAt || null,
  };
}

export default function Accounts() {
  const { pushToast } = useToast();
  const [accounts, setAccounts] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editAccount, setEditAccount] = useState(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAccounts = () => {
    api
      .get("/account/view/")
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setAccounts(data.map(normalizeAccount));
      })
      .catch((error) => {
        console.error("Failed to fetch accounts:", error);
        pushToast({ title: "Failed to load accounts", variant: "error" });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAccounts();
    api
      .get("/staff/view/")
      .then((response) => setStaff(Array.isArray(response.data) ? response.data : []))
      .catch((error) => {
        console.error("Failed to fetch staff:", error);
      });
  }, []);

  const requestDelete = (id) => {
    setDeleteTargetId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/account/delete/${deleteTargetId}/`);
      setAccounts((previous) => previous.filter((account) => account.id !== deleteTargetId));
      pushToast({ title: "Account deleted", variant: "success" });
    } catch (error) {
      console.error("Delete failed:", error);
      pushToast({ title: "Failed to delete account", variant: "error" });
    } finally {
      setDeleteLoading(false);
      setConfirmDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  const toAddressPayload = (address) => {
    if (!address || Object.values(address).every((value) => String(value || "").trim() === "")) return null;
    return {
      country: address.country.trim(),
      address: address.address.trim(),
      street_add: address.streetAdd.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      zip_code: address.zipCode.trim(),
    };
  };

  const buildPayload = (form) => ({
    acc_name: form.accountName.trim(),
    assigned_to: form.assignedTo || null,
    phone: form.phoneNumber.trim(),
    acc_site: form.accountSite.trim(),
    parent_acc: form.parentAccount || null,
    website: form.website.trim(),
    acc_type: form.accountType.trim(),
    industry: form.industry.trim(),
    ownership: form.ownership.trim(),
    employees: form.employees.trim(),
    billing_add: toAddressPayload(form.billingAddress),
    shipping_add: toAddressPayload(form.shippingAddress),
  });

  const addAccount = async (form) => {
    setAddLoading(true);
    try {
      await api.post("/account/add/", buildPayload(form));
      fetchAccounts();
      pushToast({
        title: "Account created",
        message: `${form.accountName} added successfully`,
        variant: "success",
      });
    } catch (error) {
      console.error("Add account failed:", error);
      pushToast({ title: "Failed to add account", variant: "error" });
    } finally {
      setAddLoading(false);
      setAddOpen(false);
    }
  };

  const updateAccount = async (form) => {
    setAddLoading(true);
    try {
      await api.put(`/account/update/${editAccount.id}/`, buildPayload(form));
      fetchAccounts();
      pushToast({
        title: "Account updated",
        message: `${form.accountName} updated successfully`,
        variant: "success",
      });
    } catch (error) {
      console.error("Update account failed:", error);
      pushToast({ title: "Failed to update account", variant: "error" });
    } finally {
      setAddLoading(false);
      setEditAccount(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[#64748B]">Loading accounts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#111827]">Accounts</h1>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2"
        >
          <Plus size={18} />
          Add Account
        </button>
      </div>

      <AccountsKpis accounts={accounts} />
      <AccountsList
        accounts={accounts}
        onDelete={requestDelete}
        onEdit={(account) => setEditAccount(account)}
      />

      <AccountFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={addAccount}
        loading={addLoading}
        staff={staff}
        accounts={accounts}
      />

      <AccountFormModal
        open={!!editAccount}
        onClose={() => setEditAccount(null)}
        onSubmit={updateAccount}
        loading={addLoading}
        initialData={editAccount}
        staff={staff}
        accounts={accounts}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete account?"
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
