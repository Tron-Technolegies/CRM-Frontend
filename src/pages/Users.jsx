import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

import UsersKpis from "../components/users/UsersKpis";
import UsersList from "../components/users/UsersList";
import UserFormModal from "../components/users/UserFormModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useToast } from "../components/ui/toastContext.js";

const api = axios.create({
  baseURL: "http://localhost:8000/api/admin",
});

export default function Users() {
  const { pushToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = () => {
    api.get("/staff/view/")
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        pushToast({ title: "Failed to load users", variant: "error" });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const requestDelete = (id) => {
    setDeleteTargetId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/staff/delete/${deleteTargetId}/`);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTargetId));
      pushToast({ title: "User deleted", variant: "success" });
    } catch (err) {
      console.error("Delete failed:", err);
      pushToast({ title: "Failed to delete user", variant: "error" });
    } finally {
      setDeleteLoading(false);
      setConfirmDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  const addUser = async (form) => {
    setAddLoading(true);
    try {
      await api.post("/staff/add/", {
        full_name: form.fullName.trim(),
        email: form.email.trim(),
        role: form.role.toLowerCase(),
        department: form.department.trim(),
      });
      fetchUsers();
      pushToast({ title: "Invitation sent", message: `${form.fullName} invited successfully`, variant: "success" });
    } catch (err) {
      console.error("Invite user failed:", err);
      pushToast({ title: "Failed to invite user", variant: "error" });
    } finally {
      setAddLoading(false);
      setAddOpen(false);
    }
  };

  const updateUser = async (form) => {
    setAddLoading(true);
    try {
      await api.put(`/staff/update/${editUser.id}/`, {
        full_name: form.fullName.trim(),
        email: form.email.trim(),
      });
      fetchUsers();
      pushToast({ title: "User updated", message: `${form.fullName} updated successfully`, variant: "success" });
    } catch (err) {
      console.error("Update user failed:", err);
      pushToast({ title: "Failed to update user", variant: "error" });
    } finally {
      setAddLoading(false);
      setEditUser(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[#64748B]">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#111827]">Users</h1>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} />
          Invite User
        </button>
      </div>

      <UsersKpis users={users} />
      <UsersList users={users} onDelete={requestDelete} onEdit={(u) => setEditUser(u)} />

      {/* Add modal */}
      <UserFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={addUser}
        loading={addLoading}
      />

      {/* Edit modal */}
      <UserFormModal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        onSubmit={updateUser}
        loading={addLoading}
        initialData={editUser}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Remove user?"
        description="This action cannot be undone."
        confirmText="Remove"
        danger
        loading={deleteLoading}
        onCancel={() => (deleteLoading ? null : setConfirmDeleteOpen(false))}
        onConfirm={confirmDelete}
      />
    </div>
  );
}