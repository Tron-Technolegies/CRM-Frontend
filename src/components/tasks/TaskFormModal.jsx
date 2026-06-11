import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";

const api = axios.create({ baseURL: "http://localhost:8000/api/admin" });

const defaultPriorities = ["High", "Medium", "Low"];
const defaultStatuses = ["Pending", "In Progress", "Completed"];

function validateTask(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "Task title is required";
  if (!form.dueDate) errors.dueDate = "Due date is required";
  return errors;
}

export default function TaskFormModal({ open, onClose, onSubmit, loading = false, initialData = null }) {
  const blankForm = useMemo(() => ({
    title: "",
    description: "",
    assignedTo: "",
    relatedTo: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
  }), []);

  const [form, setForm] = useState(blankForm);
  const [touched, setTouched] = useState({});
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    api.get("/deal/view/")
      .then((res) => setDeals(res.data))
      .catch((err) => console.error("Failed to fetch deals:", err));
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        assignedTo: initialData.assignedTo || "",
        relatedTo: initialData.relatedTo || "",
        priority: initialData.priority?.charAt(0).toUpperCase() + initialData.priority?.slice(1) || "Medium",
        status: initialData.status === "in_progress" ? "In Progress" : initialData.status?.charAt(0).toUpperCase() + initialData.status?.slice(1) || "Pending",
        dueDate: initialData.dueDate || "",
      });
    } else {
      setForm(blankForm);
    }
    setTouched({});
  }, [initialData]);

  const errors = validateTask(form);
  const hasErrors = Object.keys(errors).length > 0;

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const closeAndReset = () => {
    if (loading) return;
    setForm(blankForm);
    setTouched({});
    onClose();
  };

  const submit = () => {
    setTouched({ title: true, dueDate: true });
    if (hasErrors) return;
    onSubmit(form);
  };

  return (
    <Modal
      open={open}
      title={initialData ? "Edit Task" : "Add New Task"}
      subtitle={initialData ? "Update the task details below" : "Fill in the details below to add a new task"}
      onClose={closeAndReset}
      maxWidthClassName="max-w-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="text-sm text-[#111827] font-medium">Task Title <span className="text-red-500">*</span></label>
          <input
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, title: true }))}
            placeholder="e.g. Follow up with ABC Solutions"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
          {touched.title && errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-[#111827] font-medium">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Add task description..."
            className="mt-2 w-full min-h-[90px] rounded-xl border border-[#E5E7EB] p-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 resize-none"
          />
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">Assigned To <span className="text-red-500">*</span></label>
          <input
            value={form.assignedTo}
            onChange={(e) => setField("assignedTo", e.target.value)}
            placeholder="e.g. Mark Brown"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">Related To</label>
          <select
            value={form.relatedTo}
            onChange={(e) => setField("relatedTo", e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="">e.g. Deal: Website Redesign</option>
            {deals.map((d) => (
              <option key={d.id} value={`Deal: ${d.name}`}>Deal: {d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">Priority <span className="text-red-500">*</span></label>
          <select
            value={form.priority}
            onChange={(e) => setField("priority", e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
          >
            {defaultPriorities.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">Status <span className="text-red-500">*</span></label>
          <select
            value={form.status}
            onChange={(e) => setField("status", e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
          >
            {defaultStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-[#111827] font-medium">Due Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setField("dueDate", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, dueDate: true }))}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
          {touched.dueDate && errors.dueDate && <p className="text-xs text-red-600 mt-1">{errors.dueDate}</p>}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button type="button" onClick={closeAndReset} disabled={loading} className="h-11 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] disabled:opacity-60">
          Cancel
        </button>
        <button type="button" onClick={submit} disabled={loading} className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2 disabled:opacity-60">
          {loading && <Spinner size={16} className="text-white" />}
          {initialData ? "Save Task" : "Add Task"}
        </button>
      </div>
    </Modal>
  );
}