import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";
import AccountViewModal from "./AccountViewModal";

const PAGE_SIZE = 8;

function getLabel(value, fallback = "—") {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "object") {
    return value.fullName || value.name || value.accountName || value.label || fallback;
  }
  return String(value);
}

function initials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] || "";
  const second = parts[1]?.[0] || "";
  return (first + second).toUpperCase() || String(name || "?").slice(0, 2).toUpperCase();
}

export default function AccountsList({ accounts, onDelete, onEdit }) {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("All");
  const [assignedTo, setAssignedTo] = useState("All");
  const [page, setPage] = useState(1);
  const [viewAccount, setViewAccount] = useState(null);

  const industryOptions = useMemo(() => {
    const unique = Array.from(new Set(accounts.map((account) => account.industry).filter(Boolean)));
    return ["All", ...unique];
  }, [accounts]);

  const assignedOptions = useMemo(() => {
    const unique = Array.from(
      new Set(accounts.map((account) => getLabel(account.assignedTo)).filter((value) => value && value !== "—")),
    );
    return ["All", ...unique];
  }, [accounts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return accounts.filter((account) => {
      const matchesQuery =
        !q ||
        [account.accountName, account.phoneNumber, account.website, account.accountType, account.ownership]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q));
      const matchesIndustry = industry === "All" || account.industry === industry;
      const matchesAssigned = assignedTo === "All" || getLabel(account.assignedTo) === assignedTo;
      return matchesQuery && matchesIndustry && matchesAssigned;
    });
  }, [accounts, query, industry, assignedTo]);

  useEffect(() => {
    setPage(1);
  }, [query, industry, assignedTo]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-[#EEF2F7] flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="h-12 w-full xl:w-[340px] rounded-xl border border-[#E5E7EB] px-4 flex items-center gap-3">
          <Search size={18} className="text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white"
          >
            {industryOptions.map((option) => (
              <option key={option} value={option}>
                Industry: {option}
              </option>
            ))}
          </select>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white"
          >
            {assignedOptions.map((option) => (
              <option key={option} value={option}>
                Assigned: {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="md:hidden divide-y divide-[#EEF2F7]">
        {paginated.map((account) => (
          <div key={account.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#111827] truncate">{account.accountName}</p>
                <p className="text-sm text-[#64748B] mt-0.5 truncate">{account.phoneNumber || "-"}</p>
                <p className="text-sm text-[#64748B] truncate">{account.industry || "-"}</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#F1F5F9] border border-[#E5E7EB] flex items-center justify-center text-sm font-semibold text-[#475569]">
                {initials(account.accountName)}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[#64748B]">Assigned</p>
                <p className="text-[#111827] font-medium">{getLabel(account.assignedTo)}</p>
              </div>
              <div>
                <p className="text-[#64748B]">Parent</p>
                <p className="text-[#111827] font-medium">{getLabel(account.parentAccount)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[#64748B]">Website</p>
                <p className="text-[#111827] font-medium truncate">{account.website || "-"}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 text-[#64748B]">
              <button type="button" className="h-10 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827]" onClick={() => setViewAccount(account)}>
                View
              </button>
              <button type="button" className="h-10 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827]" onClick={() => onEdit(account)}>
                Edit
              </button>
              <button type="button" className="h-10 px-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium" onClick={() => onDelete(account.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {paginated.length === 0 && <p className="p-6 text-sm text-[#64748B]">No accounts found.</p>}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead className="border-b border-[#EEF2F7]">
            <tr className="text-left">
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Account Name</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Phone</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Type</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Industry</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Assigned To</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Parent Account</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF2F7]">
            {paginated.map((account) => (
              <tr key={account.id} className="hover:bg-[#FAFAFA]">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] border border-[#E5E7EB] flex items-center justify-center text-sm font-semibold text-[#475569]">
                      {initials(account.accountName)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#111827] truncate">{account.accountName}</p>
                      <p className="text-sm text-[#64748B] truncate">{account.website || "-"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{account.phoneNumber || "-"}</p>
                  <p className="text-sm text-[#64748B]">{account.accountSite || "-"}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{account.accountType || "-"}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{account.industry || "-"}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{getLabel(account.assignedTo)}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{getLabel(account.parentAccount)}</p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3 text-[#64748B]">
                    <button type="button" className="hover:text-[#111827]" aria-label="View" onClick={() => setViewAccount(account)}>
                      <Eye size={18} />
                    </button>
                    <button type="button" className="hover:text-[#111827]" aria-label="Edit" onClick={() => onEdit(account)}>
                      <Pencil size={18} />
                    </button>
                    <button type="button" className="hover:text-red-600" aria-label="Delete" onClick={() => onDelete(account.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-sm text-[#64748B]">
                  No accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-[#64748B]">
          Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} accounts
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="w-9 h-9 rounded-lg border border-[#E5E7EB] grid place-items-center disabled:opacity-40"
          >
            {"<"}
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setPage(value)}
              className={`w-9 h-9 rounded-lg grid place-items-center text-sm ${
                value === page ? "bg-blue-600 text-white" : "border border-[#E5E7EB] text-[#111827]"
              }`}
            >
              {value}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="w-9 h-9 rounded-lg border border-[#E5E7EB] grid place-items-center disabled:opacity-40"
          >
            {">"}
          </button>
        </div>
      </div>

      <AccountViewModal open={!!viewAccount} onClose={() => setViewAccount(null)} account={viewAccount} />
    </div>
  );
}
