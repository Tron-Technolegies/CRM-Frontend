import { useEffect, useMemo, useState } from "react";
import { Mail, MoreVertical, Pencil, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { useToast } from "../ui/toastContext.js";

const PAGE_SIZE = 6;

function initials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

function roleStyles(role) {
  switch (role?.toLowerCase()) {
    case "admin": return "bg-violet-50 text-violet-600";
    case "manager": return "bg-blue-50 text-blue-600";
    default: return "bg-slate-100 text-slate-600";
  }
}

function statusStyles(status) {
  switch (status) {
    case "Active": return "bg-emerald-50 text-emerald-600";
    case "Invited": return "bg-amber-50 text-amber-600";
    case "Offline": return "bg-slate-100 text-slate-600";
    default: return "bg-slate-100 text-slate-600";
  }
}

function formatRole(role) {
  if (!role) return "Member";
  return role.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export default function UsersList({ users, onDelete, onEdit }) {
  const { pushToast } = useToast();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const roleOptions = useMemo(() => {
    const unique = Array.from(new Set(users.map((u) => u.role))).filter(Boolean);
    return ["All", ...unique];
  }, [users]);

  const statusOptions = useMemo(() => {
    const unique = Array.from(new Set(users.map((u) => u.status))).filter(Boolean);
    return ["All", ...unique];
  }, [users]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchesQuery = !q || [u.fullName, u.email].filter(Boolean).some((v) => v.toLowerCase().includes(q));
      const matchesRole = role === "All" || u.role === role;
      const matchesStatus = status === "All" || u.status === status;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [users, query, role, status]);

  useEffect(() => {
    setPage(1);
  }, [query, role, status]);

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
            placeholder="Search users by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select value={role} onChange={(e) => setRole(e.target.value)} className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white">
            {roleOptions.map((o) => (
              <option key={o} value={o}>Role: {o === "All" ? "All" : formatRole(o)}</option>
            ))}
          </select>

          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white">
            {statusOptions.map((o) => (
              <option key={o} value={o}>Status: {o}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => openNotImplemented("More filters")}
            className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white flex items-center gap-2 hover:bg-[#F8FAFC] transition"
          >
            <SlidersHorizontal size={16} className="text-[#64748B]" />
            Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="border-b border-[#EEF2F7]">
            <tr className="text-left">
              {/* <th className="px-6 py-4 w-10">
                <input type="checkbox" aria-label="Select all" className="rounded border-[#E5E7EB]" />
              </th> */}
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">User</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Role</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Department</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Status</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Last Active</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EEF2F7]">
            {paginated.map((u) => (
              <tr key={u.id} className="hover:bg-[#FAFAFA]">
                {/* <td className="px-6 py-5">
                  <input type="checkbox" aria-label={`Select ${u.fullName}`} className="rounded border-[#E5E7EB]" />
                </td> */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#F1F5F9] border border-[#E5E7EB] flex items-center justify-center text-xs font-semibold text-[#475569]">
                      {initials(u.fullName)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#111827] truncate">{u.fullName}</p>
                      <p className="text-sm text-[#64748B] truncate">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm ${roleStyles(u.role)}`}>{formatRole(u.role)}</span>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{u.department || "—"}</p>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${statusStyles(u.status)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#64748B]">{u.status === "Invited" ? "Never" : formatDate(u.invitedAt)}</p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3 text-[#64748B]">
                    <button type="button" className="hover:text-[#111827]" aria-label="Email" onClick={() => openNotImplemented("Email")}><Mail size={18} /></button>
                    <button type="button" className="hover:text-[#111827]" aria-label="Edit" onClick={() => onEdit(u)}><Pencil size={18} /></button>
                    <button type="button" className="hover:text-red-600" aria-label="Delete" onClick={() => onDelete(u.id)}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-sm text-[#64748B]">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-[#64748B]">
          Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} users
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