import React, { useState, useEffect, useMemo } from "react";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";
import Pagination from "../Pagination";
import usePagination from "../../api/usePagination";

const AccountsList = ({
  accounts = [],
  onDelete,
  onEdit,
  onView,
}) => {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("All");
  const [assignedTo, setAssignedTo] = useState("All");

  const industryOptions = useMemo(() => {
    const unique = Array.from(new Set(accounts.map((a) => a.industry))).filter(Boolean);
    return ["All", ...unique];
  }, [accounts]);

  const assignedOptions = useMemo(() => {
    const unique = Array.from(new Set(accounts.map((a) => a.assigned_to_name))).filter(Boolean);
    return ["All", ...unique];
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return accounts.filter((account) => {
      const matchesQuery =
        !q ||
        [account.account_name, account.phone_number, account.website]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q));
      const matchesIndustry = industry === "All" || account.industry === industry;
      const matchesAssigned = assignedTo === "All" || account.assigned_to_name === assignedTo;
      return matchesQuery && matchesIndustry && matchesAssigned;
    });
  }, [accounts, query, industry, assignedTo]);

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData: paginatedAccounts,
    changePage,
    resetPage,
  } = usePagination(filteredAccounts, 8);

  useEffect(() => {
    resetPage();
  }, [query, industry, assignedTo]);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
      {/* Filters */}
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
            {industryOptions.map((o) => (
              <option key={o} value={o}>Industry: {o}</option>
            ))}
          </select>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white"
          >
            {assignedOptions.map((o) => (
              <option key={o} value={o}>Assigned: {o}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-[#EEF2F7]">
        {paginatedAccounts.map((account) => {
          const parentAccount = accounts.find(
            (a) => String(a.id) === String(account.parent_account),
          );

          return (
            <div
              key={account.id}
              className="p-5"
              onClick={() => onView(account)}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-semibold shrink-0">
                  {account.account_name?.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#111827] truncate">{account.account_name}</p>
                  <p className="text-sm text-slate-500 truncate">{account.website || "-"}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[#64748B]">Phone</p>
                  <p className="text-[#111827] font-medium">{account.phone_number || "-"}</p>
                </div>
                <div>
                  <p className="text-[#64748B]">Type</p>
                  <p className="text-[#111827] font-medium">{account.account_type || "-"}</p>
                </div>
                <div>
                  <p className="text-[#64748B]">Industry</p>
                  <p className="text-[#111827] font-medium">{account.industry || "-"}</p>
                </div>
                <div>
                  <p className="text-[#64748B]">Assigned To</p>
                  <p className="text-[#111827] font-medium">{account.assigned_to_name || "-"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[#64748B]">Parent Account</p>
                  <p className="text-[#111827] font-medium">{parentAccount?.account_name || "-"}</p>
                </div>
              </div>

              <div
                className="mt-4 flex items-center gap-3 text-[#64748B]"
                onClick={(e) => e.stopPropagation()}
              >
                <button type="button" className="h-10 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827]" onClick={() => onView(account)}>View</button>
                <button type="button" className="h-10 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827]" onClick={() => onEdit(account)}>Edit</button>
                <button type="button" className="h-10 px-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium" onClick={() => onDelete(account.id)}>Delete</button>
              </div>
            </div>
          );
        })}
        {paginatedAccounts.length === 0 && <p className="p-6 text-sm text-[#64748B]">No accounts found.</p>}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead className="border-b border-[#EEF2F7]">
            <tr className="text-left">
              <th className="px-6 py-4 text-sm text-[#64748B]">Account Name</th>
              <th className="px-6 py-4 text-sm text-[#64748B]">Phone</th>
              <th className="px-6 py-4 text-sm text-[#64748B]">Type</th>
              <th className="px-6 py-4 text-sm text-[#64748B]">Industry</th>
              <th className="px-6 py-4 text-sm text-[#64748B]">Assigned To</th>
              <th className="px-6 py-4 text-sm text-[#64748B]">Parent Account</th>
              <th className="px-6 py-4 text-sm text-[#64748B]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF2F7]">
            {paginatedAccounts.map((account) => {
              const parentAccount = accounts.find(
                (a) => String(a.id) === String(account.parent_account),
              );

              return (
                <tr
                  key={account.id}
                  onClick={() => onView(account)}
                  className="hover:bg-[#FAFAFA] cursor-pointer"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-semibold">
                        {account.account_name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{account.account_name}</p>
                        <p className="text-sm text-slate-500">{account.website || "-"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm">{account.phone_number || "-"}</td>
                  <td className="px-6 py-5 text-sm">{account.account_type || "-"}</td>
                  <td className="px-6 py-5 text-sm">{account.industry || "-"}</td>
                  <td className="px-6 py-5 text-sm">{account.assigned_to_name || "-"}</td>
                  <td className="px-6 py-5 text-sm">{parentAccount?.account_name || "-"}</td>
                  <td className="px-6 py-5">
                    <div
                      className="flex gap-3 text-slate-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button onClick={() => onView(account)}>
                        <Eye size={18} />
                      </button>
                      <button onClick={() => onEdit(account)}>
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => onDelete(account.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {paginatedAccounts.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-sm text-[#64748B]">No accounts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        itemName="accounts"
        onPageChange={changePage}
      />
    </div>
  );
};

export default AccountsList;