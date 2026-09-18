import { Eye, Pencil, Funnel, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Pagination from "../Pagination";
import usePagination from "../../api/usePagination";
import usePermissions from "../../permissions/usePermissions";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);

const STAGE_LABELS = {
  draft: "Draft",
  negotiation: "Negotiation",
  delivered: "Delivered",
  on_hold: "On Hold",
  confirmed: "Confirmed",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

const QuotesTable = ({ quotes = [], loading = false, onEdit, onView, onDelete }) => {
  const { hasPermission } = usePermissions();
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("all");
  const searchText = search.trim().toLowerCase();

  const filteredQuotes = (quotes || []).filter((quote) => {
    const matchesSearch =
      searchText === "" ||
      quote.id?.toString().toLowerCase().includes(searchText) ||
      quote.subject?.toLowerCase().includes(searchText) ||
      quote.contactName?.toLowerCase().includes(searchText) ||
      quote.accountName?.toLowerCase().includes(searchText) ||
      quote.customerName?.toLowerCase().includes(searchText) ||
      quote.dealName?.toLowerCase().includes(searchText);

    const matchesStage = stage === "all" || quote.quoteStage?.toLowerCase() === stage;

    return matchesSearch && matchesStage;
  });

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData: paginatedQuotes,
    changePage,
    resetPage,
  } = usePagination(filteredQuotes, 10);

  useEffect(() => {
    resetPage();
  }, [search, stage]);

  return (
    <div className="max-w-full">
      <div className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden">
        <div className="px-12 py-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-12 w-full xl:w-[340px] rounded-xl border border-[#E5E7EB] px-4 flex items-center gap-3">
              <Search size={18} className="text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search by Quote ID, Customer or Subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none w-full text-sm cursor-text"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white cursor-pointer outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Stage: All</option>
                <option value="draft">Stage: Draft</option>
                <option value="negotiation">Stage: Negotiation</option>
                <option value="delivered">Stage: Delivered</option>
                <option value="on_hold">Stage: On Hold</option>
                <option value="confirmed">Stage: Confirmed</option>
                <option value="closed_won">Stage: Closed Won</option>
                <option value="closed_lost">Stage: Closed Lost</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border border-[#EEF2F7]">
                <th className="px-5 py-4 text-left text-sm font-medium tracking-wide text-[#64748B]">Subject</th>
                <th className="px-5 py-4 text-left text-sm font-medium tracking-wide text-[#64748B]">Quote Stage</th>
                <th className="px-5 py-4 text-left text-sm font-medium tracking-wide text-[#64748B]">Grand Total</th>
                <th className="px-5 py-4 text-left text-sm font-medium tracking-wide text-[#64748B]">Deal Name</th>
                <th className="px-5 py-4 text-left text-sm font-medium tracking-wide text-[#64748B]">Contact Name</th>
                <th className="px-5 py-4 text-left text-sm font-medium tracking-wide text-[#64748B]">Account Name</th>
                <th className="px-5 py-4 text-left text-sm font-medium tracking-wide text-[#64748B]">Customer Name</th>
                <th className="px-5 py-4 text-left text-sm font-medium tracking-wide text-[#64748B]">Quote Owner</th>
                <th className="px-5 py-4 text-center text-sm font-medium tracking-wide text-[#64748B]">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-gray-500">
                    Loading quotes...
                  </td>
                </tr>
              ) : paginatedQuotes.length > 0 ? (
                paginatedQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="border-b border-gray-200 px-5 py-4 text-sm text-gray-700 font-medium">
                      {quote.subject}
                    </td>
                    <td className="border-b border-gray-200 px-5 py-4 font-medium">
                      {STAGE_LABELS[quote.quoteStage] || quote.quoteStage}
                    </td>
                    <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                      {formatCurrency(quote.grandTotal)}
                    </td>
                    <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">{quote.dealName}</td>
                    <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">{quote.contactName}</td>
                    <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">{quote.accountName}</td>
                    <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">{quote.customerName}</td>
                    <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">{quote.quoteOwner}</td>
                    <td className="border-b border-gray-200 px-5 py-4">
                      <div className="flex justify-center gap-3">
                        <Eye size={18} className="cursor-pointer text-gray-700" onClick={() => onView?.(quote.id)} />
                        {hasPermission("quote.edit") && (
                          <Pencil size={18} className="cursor-pointer text-gray-700" onClick={() => onEdit?.(quote.id)} />
                        )}
                        {hasPermission("quote.delete") && (
                          <Trash2 size={18} className="cursor-pointer text-gray-700" onClick={() => onDelete?.(quote.id)} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-gray-500">
                    No quotes found
                  </td>
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
          itemName="quotes"
          onPageChange={changePage}
        />
      </div>
    </div>
  );
};

export default QuotesTable;