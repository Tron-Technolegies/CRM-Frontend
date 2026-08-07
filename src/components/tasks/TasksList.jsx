import { useEffect, useMemo, useState } from "react";
import { Eye, MoreVertical, Pencil, Search, Trash2 } from "lucide-react";
import { useToast } from "../ui/toastContext.js";
import TaskViewModal from "./TaskViewModal.jsx";
import Pagination from "../Pagination";
import usePagination from "../../api/usePagination";

function priorityStyles(priority) {
  switch (priority?.toLowerCase()) {
    case "high": return "text-rose-600";
    case "medium": return "text-amber-600";
    case "low": return "text-emerald-600";
    default: return "text-slate-600";
  }
}

function priorityIcon(priority) {
  switch (priority?.toLowerCase()) {
    case "high": return "↑";
    case "medium": return "—";
    case "low": return "↓";
    default: return "—";
  }
}

function statusStyles(status) {
  switch (status?.toLowerCase()) {
    case "in_progress": return "bg-blue-50 text-blue-600";
    case "completed": return "bg-emerald-50 text-emerald-600";
    case "pending": return "bg-red-100 text-red-600";
    default: return "bg-slate-100 text-slate-600";
  }
}

function statusLabel(status) {
  switch (status?.toLowerCase()) {
    case "in_progress": return "In Progress";
    case "completed": return "Completed";
    case "pending": return "Pending";
    default: return status;
  }
}

function relatedTypeLabel(type) {
  switch (type) {
    case "lead": return "Lead";
    case "contact": return "Contact";
    case "deal": return "Deal";
    case "account": return "Account";
    default: return "";
  }
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function isOverdue(dueDate, status) {
  if (!dueDate || status?.toLowerCase() === "completed") return false;
  return new Date(dueDate) < new Date();
}

export default function TasksList({ tasks, onDelete, onEdit }) {
  const { pushToast } = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");

  const [viewId, setViewId] = useState(null);

  const statusOptions = ["All", "pending", "in_progress", "completed"];
  const priorityOptions = ["All", "high", "medium", "low"];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchesQuery = !q || [t.title, t.relatedTo, t.assignedTo].filter(Boolean).some((v) => v.toLowerCase().includes(q));
      const matchesStatus = status === "All" || t.status?.toLowerCase() === status;
      const matchesPriority = priority === "All" || t.priority?.toLowerCase() === priority;
      return matchesQuery && matchesStatus && matchesPriority;
    });
  }, [tasks, query, status, priority]);

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData: paginated,
    changePage,
    resetPage,
  } = usePagination(filtered, 8);

  useEffect(() => {
    resetPage();
  }, [query, status, priority]);

  const openNotImplemented = (label) => {
    pushToast({ title: `${label} not implemented`, message: "Wire this to your backend later.", variant: "info" });
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-[#EEF2F7] flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="h-12 w-full xl:w-[340px] rounded-xl border border-[#E5E7EB] px-4 flex items-center gap-3">
          <Search size={18} className="text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white">
            {statusOptions.map((o) => (
              <option key={o} value={o}>Status: {o === "All" ? "All" : statusLabel(o)}</option>
            ))}
          </select>

          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white">
            {priorityOptions.map((o) => (
              <option key={o} value={o}>Priority: {o === "All" ? "All" : o.charAt(0).toUpperCase() + o.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead className="border-b border-[#EEF2F7]">
            <tr className="text-left">
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Task</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Assigned To</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Related To</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Priority</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Status</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Due Date</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EEF2F7]">
            {paginated.map((task) => (
              <tr
                key={task.id}
                onClick={() => setViewId(task.id)}
                className="hover:bg-[#FAFAFA] cursor-pointer"
              >
                <td className="px-6 py-5">
                  <p className={`text-sm font-medium ${task.status?.toLowerCase() === "completed" ? "line-through text-[#64748B]" : "text-[#111827]"}`}>{task.title}</p>
                  {task.description && <p className="text-sm text-[#64748B] mt-0.5 truncate max-w-[200px]">{task.description}</p>}
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{task.assignedTo || "—"}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">
                    {task.relatedTo && task.relatedTo !== "—"
                      ? `${relatedTypeLabel(task.relatedType)}: ${task.relatedTo}`
                      : "—"}
                  </p>
                </td>
                <td className="px-6 py-5">
                  <span className={`text-sm font-medium ${priorityStyles(task.priority)}`}>
                    {priorityIcon(task.priority)} {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}
                  </span>
                </td>
                <td className="h-[1px] px-6 py-5">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm ${statusStyles(task.status)}`}>
                    {statusLabel(task.status)}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <p className={`text-sm font-medium ${isOverdue(task.dueDate, task.status) ? "text-rose-600" : "text-[#64748B]"}`}>
                    {formatDate(task.dueDate)}
                  </p>
                </td>
                <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-3 text-[#64748B]">
                    <button type="button" className="hover:text-[#111827]" aria-label="View" onClick={() => setViewId(task.id)}><Eye size={18} /></button>
                    <button type="button" className="hover:text-[#111827]" aria-label="Edit" onClick={() => onEdit(task)}><Pencil size={18} /></button>
                    <button type="button" className="hover:text-red-600" aria-label="Delete" onClick={() => onDelete(task.id)}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-sm text-[#64748B]">No tasks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        itemName="tasks"
        onPageChange={changePage}
      />

      <TaskViewModal
      open={!!viewId}
      onClose={() => setViewId(null)}
      onEdit={onEdit}
      taskId={viewId} />
    </div>
  );
}