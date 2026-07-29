import React, { useState, useEffect } from "react";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";
import Pagination from "../Pagination";
import usePagination from "../../api/usePagination";


const AccountsList = ({
  accounts = [],
  onDelete,
  onEdit,
  onView,
}) => {

  const [search, setSearch] = useState("");

  const filteredAccounts = accounts.filter((account) =>
    account.account_name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData: paginatedAccounts,
    changePage,
    resetPage,
  } = usePagination(filteredAccounts, 10);

  useEffect(() => {
    resetPage();
  }, [search, resetPage]);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-[#EEF2F7] flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="h-12 w-full xl:w-[340px] rounded-xl border border-[#E5E7EB] px-4 flex items-center gap-3">

          <Search size={18} className="text-[#6B7280]" />

          <input
            type="text"
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />

        </div>
        <div className="flex flex-wrap gap-3">
          <select className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm">
            <option>
              Industry: All
            </option>
          </select>
          <select className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm">
            <option>
              Assigned: All
            </option>
          </select>


        </div>


      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead className="border-b border-[#EEF2F7]">

            <tr className="text-left">

              <th className="px-6 py-4 text-sm text-[#64748B]">
                Account Name
              </th>

              <th className="px-6 py-4 text-sm text-[#64748B]">
                Phone
              </th>

              <th className="px-6 py-4 text-sm text-[#64748B]">
                Type
              </th>

              <th className="px-6 py-4 text-sm text-[#64748B]">
                Industry
              </th>

              <th className="px-6 py-4 text-sm text-[#64748B]">
                Assigned To
              </th>

              <th className="px-6 py-4 text-sm text-[#64748B]">
                Parent Account
              </th>

              <th className="px-6 py-4 text-sm text-[#64748B]">
                Actions
              </th>
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

                        <p className="text-sm font-semibold">
                          {account.account_name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {account.website || "-"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm">
                    {account.phone_number || "-"}
                  </td>
                  <td className="px-6 py-5 text-sm">
                    {account.account_type || "-"}
                  </td>
                  <td className="px-6 py-5 text-sm">
                    {account.industry || "-"}
                  </td>
                  <td className="px-6 py-5 text-sm">
                    {account.assigned_to_name || "-"}
                  </td>
                  <td className="px-6 py-5 text-sm">
                    {parentAccount?.account_name || "-"}
                  </td>
                  <td className="px-6 py-5">
                    <div
                      className="flex gap-3 text-slate-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onView(account)}>
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onEdit(account)}>
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(account.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>

                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-5">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          itemName="accounts"
          onPageChange={changePage}
        />
      </div>
    </div>
  );
};


export default AccountsList;