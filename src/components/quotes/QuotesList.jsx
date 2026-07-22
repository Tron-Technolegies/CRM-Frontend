import { Eye, Pencil, Search, Trash2 } from "lucide-react";

const QuotesList = () => {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-[#EEF2F7] flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="h-12 w-full xl:w-[340px] rounded-xl border border-[#E5E7EB] px-4 flex items-center gap-3">
          <Search size={18} className="text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search quotes..."
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white">
            <option></option>
          </select>
        </div>
      </div>

      <div className="md:hidden divide-y divide-[#EEF2F7]">
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#111827] truncate">Subject text</p>
              <p className="text-sm text-[#64748B] mt-0.5 truncate">Account name</p>
              <p className="text-sm text-[#64748B] truncate">Contact name</p>
            </div>
            <span className="shrink-0 inline-flex px-3 py-1 rounded-full text-sm">
              draft
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[#64748B]">Valid Until</p>
              <p className="text-[#111827] font-medium">—</p>
            </div>
            <div>
              <p className="text-[#64748B]">Total</p>
              <p className="text-[#111827] font-medium">₹0.00</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 text-[#64748B]">
            <button type="button" className="h-10 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827]">
              View
            </button>
            <button type="button" className="h-10 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827]">
              Edit
            </button>
            <button type="button" className="h-10 px-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
              Delete
            </button>
          </div>
        </div>
        <p className="p-6 text-sm text-[#64748B]">No quotes found.</p>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead className="border-b border-[#EEF2F7]">
            <tr className="text-left">
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Subject</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Contact</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Account</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Stage</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Valid Until</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Total</th>
              <th className="px-6 py-4 text-sm text-[#64748B] font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF2F7]">
            <tr className="hover:bg-[#FAFAFA]">
              <td className="px-6 py-5">
                <p className="text-sm font-semibold text-[#111827]">Subject text</p>
                <p className="text-sm text-[#64748B]">Deal name</p>
              </td>
              <td className="px-6 py-5">
                <p className="text-sm text-[#111827]">Contact name</p>
              </td>
              <td className="px-6 py-5">
                <p className="text-sm text-[#111827]">Account name</p>
              </td>
              <td className="px-6 py-5">
                <span className="inline-flex px-3 py-1 rounded-full text-sm">
                  draft
                </span>
              </td>
              <td className="px-6 py-5">
                <p className="text-sm text-[#64748B]">—</p>
              </td>
              <td className="px-6 py-5">
                <p className="text-sm text-[#111827]">₹0.00</p>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-3 text-[#64748B]">
                  <button type="button" className="hover:text-[#111827]" aria-label="View">
                    <Eye size={18} />
                  </button>
                  <button type="button" className="hover:text-[#111827]" aria-label="Edit">
                    <Pencil size={18} />
                  </button>
                  <button type="button" className="hover:text-red-600" aria-label="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={7} className="px-6 py-10 text-sm text-[#64748B]">
                No quotes found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-[#64748B]">
          Showing 1 to 10 of 10 quotes
        </p>
        <div className="flex items-center gap-2">
          <button type="button" className="w-9 h-9 rounded-lg border border-[#E5E7EB] grid place-items-center disabled:opacity-40">
            {"<"}
          </button>
          <button type="button" className="w-9 h-9 rounded-lg grid place-items-center text-sm bg-blue-600 text-white">
            1
          </button>
          <button type="button" className="w-9 h-9 rounded-lg border border-[#E5E7EB] grid place-items-center disabled:opacity-40">
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotesList;
