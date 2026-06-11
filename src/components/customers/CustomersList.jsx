import { useEffect, useMemo, useState } from "react";
import { Eye, MoreVertical, Pencil, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { useToast } from "../ui/toastContext.js";

const PAGE_SIZE = 8;

function formatCurrency(value) {
  const n = Number(value || 0);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function initials(company) {
  const parts = String(company || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase() || String(company || "?").slice(0, 2).toUpperCase();
}

function statusStyles(status) {
  switch (status) {
    case "Active": return "bg-emerald-50 text-emerald-700";
    case "Inactive": return "bg-rose-50 text-rose-700";
    case "On Hold": return "bg-amber-50 text-amber-700";
    default: return "bg-slate-100 text-slate-700";
  }
}

export default function CustomersList({ customers, onDelete, onEdit }) {
  const { pushToast } = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [industry, setIndustry] = useState("All");
  const [page, setPage] = useState(1);

  const statusOptions = useMemo(() => {
    const unique = Array.from(new Set(customers.map((c) => c.status))).filter(Boolean);
    return ["All", ...unique];
  }, [customers]);

  const industryOptions = useMemo(() => {
    const unique = Array.from(new Set(customers.map((c) => c.industry))).filter(Boolean);
    return ["All", ...unique];
  }, [customers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      const matchesQuery = !q || [c.companyName, c.contactName, c.email, c.phone].filter(Boolean).some((v) => v.toLowerCase().includes(q));
      const matchesStatus = status === "All" || c.status === status;
      const matchesIndustry = industry === "All" || c.industry === industry;
      return matchesQuery && matchesStatus && matchesIndustry;
    });
  }, [customers, query, status, industry]);

  useEffect(() => {
    setPage(1);
  }, [query, status, industry]);

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
          <input type="text" placeholder="Search customers..." value={query} onChange={(e) => setQuery(e.target.value)} className="bg-transparent outline-none w-full text-sm cursor-text" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white cursor-pointer">
            {statusOptions.map((o) => <option key={o} value={o}>Status: {o}</option>)}
          </select>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white cursor-pointer">
            {industryOptions.map((o) => <option key={o} value={o}>Industry: {o}</option>)}
          </select>
          <button type="button" onClick={() => openNotImplemented("More filters")} className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white flex items-center gap-2 hover:bg-[#F8FAFC] transition cursor-pointer">
            <SlidersHorizontal size={16} className="text-[#64748B]" />
            More Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead className="border-b border-[#EEF2F7]">
            <tr>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Customer</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Email</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Phone</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Industry</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Status</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Lifetime Value</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Join Date</th>
              <th className="px-6 py-4 text-left text-sm text-[#64748B] font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EEF2F7]">
            {paginated.map((c) => (
              <tr key={c.id} className="hover:bg-[#FAFAFA]">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] border border-[#E5E7EB] flex items-center justify-center text-sm font-semibold text-[#475569]">
                      {initials(c.companyName)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#111827] truncate">{c.companyName}</p>
                      <p className="text-sm text-[#64748B] truncate">{c.contactName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5"><p className="text-sm text-[#111827]">{c.email}</p></td>
                <td className="px-6 py-5"><p className="text-sm text-[#111827]">{c.phone}</p></td>
                <td className="px-6 py-5"><p className="text-sm text-[#111827]">{c.industry}</p></td>
                <td className="px-6 py-5">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm ${statusStyles(c.status)}`}>{c.status}</span>
                </td>
                <td className="px-6 py-5"><p className="text-sm text-[#111827]">{formatCurrency(c.lifetimeValue)}</p></td>
                <td className="px-6 py-5"><p className="text-sm text-[#64748B]">{formatDate(c.joinDate)}</p></td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3 text-[#64748B]">
                    <button type="button" className="hover:text-[#111827] cursor-pointer" aria-label="View" onClick={() => openNotImplemented("View")}><Eye size={18} /></button>
                    <button type="button" className="hover:text-[#111827] cursor-pointer" aria-label="Edit" onClick={() => onEdit(c)}><Pencil size={18} /></button>
                    <button type="button" className="hover:text-[#111827] cursor-pointer" aria-label="More" onClick={() => openNotImplemented("More")}><MoreVertical size={18} /></button>
                    <button type="button" className="hover:text-red-600 cursor-pointer" aria-label="Delete" onClick={() => onDelete(c.id)}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan={8} className="px-6 py-10 text-sm text-[#64748B]">No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-[#64748B]">
          Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} customers
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-9 h-9 rounded-lg border border-[#E5E7EB] grid place-items-center disabled:opacity-40 cursor-pointer">‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} type="button" onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg grid place-items-center text-sm cursor-pointer ${p === page ? "bg-blue-600 text-white" : "border border-[#E5E7EB] text-[#111827]"}`}>{p}</button>
          ))}
          <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0} className="w-9 h-9 rounded-lg border border-[#E5E7EB] grid place-items-center disabled:opacity-40 cursor-pointer">›</button>
        </div>
      </div>
    </div>
  );
}