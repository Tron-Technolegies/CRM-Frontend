import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

import TasksKpis from "../components/tasks/TasksKpis";
import TasksList from "../components/tasks/TasksList";
import TaskFormModal from "../components/tasks/TaskFormModal";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import { useToast } from "../components/ui/toastContext.js";

const api = axios.create({
  baseURL: "http://localhost:8000/api/admin",
});

export default function Tasks() {
  const { pushToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTasks = () => {
    api.get("/task/view/")
      .then((res) => setTasks(res.data))
      .catch((err) => {
        console.error("Failed to fetch tasks:", err);
        pushToast({ title: "Failed to load tasks", variant: "error" });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const requestDelete = (id) => {
    setDeleteTargetId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/task/delete/${deleteTargetId}/`);
      setTasks((prev) => prev.filter((t) => t.id !== deleteTargetId));
      pushToast({ title: "Task deleted", variant: "success" });
    } catch (err) {
      console.error("Delete failed:", err);
      pushToast({ title: "Failed to delete task", variant: "error" });
    } finally {
      setDeleteLoading(false);
      setConfirmDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  const addTask = async (form) => {
    setAddLoading(true);
    try {
      await api.post("/task/add/", {
        title: form.title.trim(),
        description: form.description.trim(),
        assigned_to: null,
        related_to: form.relatedTo.trim(),
        priority: form.priority.toLowerCase(),
        status: form.status.toLowerCase(),
        due_date: form.dueDate,
      });
      fetchTasks();
      pushToast({ title: "Task created", message: `${form.title} added successfully`, variant: "success" });
    } catch (err) {
      console.error("Add task failed:", err);
      pushToast({ title: "Failed to add task", variant: "error" });
    } finally {
      setAddLoading(false);
      setAddOpen(false);
    }
  };

  const updateTask = async (form) => {
    setAddLoading(true);
    try {
      await api.put(`/task/update/${editTask.id}/`, {
        title: form.title.trim(),
        description: form.description.trim(),
        related_to: form.relatedTo.trim(),
        priority: form.priority.toLowerCase(),
        status: form.status.toLowerCase(),
        due_date: form.dueDate,
      });
      fetchTasks();
      pushToast({ title: "Task updated", message: `${form.title} updated successfully`, variant: "success" });
    } catch (err) {
      console.error("Update task failed:", err);
      pushToast({ title: "Failed to update task", variant: "error" });
    } finally {
      setAddLoading(false);
      setEditTask(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[#64748B]">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#111827]">Tasks</h1>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} />
          Add Tasks
        </button>
      </div>

      <TasksKpis tasks={tasks} />
      <TasksList tasks={tasks} onDelete={requestDelete} onEdit={(t) => setEditTask(t)} />

      {/* Add modal */}
      <TaskFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={addTask}
        loading={addLoading}
      />

      {/* Edit modal */}
      <TaskFormModal
        open={!!editTask}
        onClose={() => setEditTask(null)}
        onSubmit={updateTask}
        loading={addLoading}
        initialData={editTask}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete task?"
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