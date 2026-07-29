import React, { useState } from "react";
import { Plus } from "lucide-react";
import AccountsKpis from "../components/accounts/AccountsKpis";
import AccountsList from "../components/accounts/AccountsList";
import AccountFormModal from "../components/accounts/AccountFormModal";
import AccountViewModal from "../components/accounts/AccountViewModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import useAccount from "../hooks/useAccount";

const Accounts = () => {

  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [viewAccount, setViewAccount] = useState(null);

  const {
    accounts,
    staff,
    loading,
    addAccount,
    updateAccount,
    deleteAccount,
    editAccount,
    setEditAccount,
    addLoading,
    deleteLoading,
  } = useAccount();

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <h1 className="text-[28px] font-semibold text-[#111827]">
          Accounts
        </h1>

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2"
        >
          <Plus size={18} />
          Add Account
        </button>

      </div>

      {/* KPI */}
      <AccountsKpis
        accounts={accounts}
      />

      {/* Accounts Table */}
      <AccountsList
        accounts={accounts}
        onView={setViewAccount}
        onEdit={setEditAccount}
        onDelete={(id) => setDeleteId(id)}
      />

      {/* View Account */}
      <AccountViewModal
        open={!!viewAccount}
        account={viewAccount}
        accounts={accounts}
        onClose={() => setViewAccount(null)}
        onEdit={(account) => setEditAccount(account)}
      />

      {/* Add Account */}
      <AccountFormModal
        open={addOpen}
        loading={addLoading}
        staff={staff}
        accounts={accounts}
        onClose={() => setAddOpen(false)}
        onSubmit={async (data) => {
          await addAccount(data);
          setAddOpen(false);
        }}
      />

      {/* Edit Account */}
      <AccountFormModal
        open={!!editAccount}
        initialData={editAccount}
        loading={addLoading}
        staff={staff}
        accounts={accounts}
        onClose={() => setEditAccount(null)}
        onSubmit={async (id, data) => {
          await updateAccount(id, data);
          setEditAccount(null);
        }}
      />

      {/* Delete Confirmation */}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete account?"
        description="This action cannot be undone."
        confirmText="Delete"
        danger
        loading={deleteLoading}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          await deleteAccount(deleteId);
          setDeleteId(null);
        }}
      />

    </div>
  );
};

export default Accounts;