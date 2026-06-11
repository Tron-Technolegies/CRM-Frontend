import { useEffect, useMemo, useState } from "react";
import { Eye, MoreVertical, Pencil, Search, Trash2 } from "lucide-react";
import { useToast } from "../ui/toastContext.js";

const PAGE_SIZE = 8;

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
    case "pending": return "bg-slate-100 text-slate-600";
    default: return "bg-slate-100 text-slate-600";
  }
}

function statusLabel(status) {
  switch (status?.toLowerCase()) {
    case "in_progress": return "In Progress";
    case "completed": return "Completed";
    case "pending": return "Not Started";
    default: return status;
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
  const [page, setPage] = useState(1);

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

  useEffect(() => {
    setPage(1);
  }, [query, status, priority]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openNotImplemented = (label) => {
    pushToast({ title: `${label} not implemented`, message: "Wire this to your backend later.", variant: "info" });
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
      {/* Filters */}
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

      {/* Table */}
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
              <tr key={task.id} className="hover:bg-[#FAFAFA]">
                <td className="px-6 py-5">
                  <p className={`text-sm font-medium ${task.status?.toLowerCase() === "completed" ? "line-through text-[#64748B]" : "text-[#111827]"}`}>{task.title}</p>
                  {task.description && <p className="text-sm text-[#64748B] mt-0.5 truncate max-w-[200px]">{task.description}</p>}
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{task.assignedTo || "—"}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{task.relatedTo || "—"}</p>
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
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3 text-[#64748B]">
                    <button type="button" className="hover:text-[#111827]" aria-label="View" onClick={() => openNotImplemented("View")}><Eye size={18} /></button>
                    <button type="button" className="hover:text-[#111827]" aria-label="Edit" onClick={() => onEdit(task)}><Pencil size={18} /></button>
                    <button type="button" className="hover:text-[#111827]" aria-label="More" onClick={() => openNotImplemented("More")}><MoreVertical size={18} /></button>
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

      {/* Footer */}
      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-[#64748B]">
          Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} tasks
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-9 h-9 rounded-lg border border-[#E5E7EB] grid place-items-center disabled:opacity-40">‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} type="button" onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg grid place-items-center text-sm ${p === page ? "bg-blue-600 text-white" : "border border-[#E5E7EB] text-[#111827]"}`}>{p}</button>
          ))}
          <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0} className="w-9 h-9 rounded-lg border border-[#E5E7EB] grid place-items-center disabled:opacity-40">›</button>
        </div>
      </div>
    </div>
  );
}