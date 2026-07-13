import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";
import QuoteViewModal from "./QuoteViewModal";

const PAGE_SIZE = 8;

function getLabel(value, fallback = "—") {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "object") {
    return value.subject || value.name || value.accountName || value.label || fallback;
  }
  return String(value);
}

function statusStyles(status) {
  switch (String(status || "draft").toLowerCase()) {
    case "sent":
      return "bg-blue-50 text-blue-700";
    case "accepted":
      return "bg-emerald-50 text-emerald-700";
    case "rejected":
      return "bg-rose-50 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function money(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amount);
}

export default function QuotesList({ quotes, onDelete, onEdit }) {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("All");
  const [page, setPage] = useState(1);
  const [viewId, setViewId] = useState(null);

  const stageOptions = useMemo(() => {
    const unique = Array.from(new Set(quotes.map((quote) => quote.quoteStage || quote.quote_stage).filter(Boolean)));
    return ["All", ...unique];
  }, [quotes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return quotes.filter((quote) => {
      const matchesQuery =
        !q ||
        [quote.subject, quote.contactName, quote.contact_name, quote.accountName, quote.account_name]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q));
      const matchesStage = stage === "All" || String(quote.quoteStage || quote.quote_stage) === stage;
      return matchesQuery && matchesStage;
    });
  }, [quotes, query, stage]);

  useEffect(() => {
    setPage(1);
  }, [query, stage]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-[#EEF2F7] flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="h-12 w-full xl:w-[340px] rounded-xl border border-[#E5E7EB] px-4 flex items-center gap-3">
          <Search size={18} className="text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search quotes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="h-11 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] bg-white"
          >
            {stageOptions.map((option) => (
              <option key={option} value={option}>
                Stage: {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="md:hidden divide-y divide-[#EEF2F7]">
        {paginated.map((quote) => (
          <div key={quote.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#111827] truncate">{quote.subject}</p>
                <p className="text-sm text-[#64748B] mt-0.5 truncate">{getLabel(quote.accountName || quote.account_name)}</p>
                <p className="text-sm text-[#64748B] truncate">{getLabel(quote.contactName || quote.contact_name)}</p>
              </div>
              <span className={`shrink-0 inline-flex px-3 py-1 rounded-full text-sm ${statusStyles(quote.quoteStage || quote.quote_stage)}`}>
                {quote.quoteStage || quote.quote_stage || "draft"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[#64748B]">Valid Until</p>
                <p className="text-[#111827] font-medium">{quote.validUntil || quote.valid_until || "—"}</p>
              </div>
              <div>
                <p className="text-[#64748B]">Total</p>
                <p className="text-[#111827] font-medium">{money(quote.total)}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 text-[#64748B]">
              <button type="button" className="h-10 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827]" onClick={() => setViewId(quote.id)}>
                View
              </button>
              <button type="button" className="h-10 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#111827]" onClick={() => onEdit(quote)}>
                Edit
              </button>
              <button type="button" className="h-10 px-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium" onClick={() => onDelete(quote.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {paginated.length === 0 && <p className="p-6 text-sm text-[#64748B]">No quotes found.</p>}
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
            {paginated.map((quote) => (
              <tr key={quote.id} className="hover:bg-[#FAFAFA]">
                <td className="px-6 py-5">
                  <p className="text-sm font-semibold text-[#111827]">{quote.subject}</p>
                  <p className="text-sm text-[#64748B]">{getLabel(quote.dealName || quote.deal_name || quote.deal)}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{getLabel(quote.contactName || quote.contact_name)}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{getLabel(quote.accountName || quote.account_name)}</p>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm ${statusStyles(quote.quoteStage || quote.quote_stage)}`}>
                    {quote.quoteStage || quote.quote_stage || "draft"}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#64748B]">{quote.validUntil || quote.valid_until || "—"}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-[#111827]">{money(quote.total)}</p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3 text-[#64748B]">
                    <button type="button" className="hover:text-[#111827]" aria-label="View" onClick={() => setViewId(quote.id)}>
                      <Eye size={18} />
                    </button>
                    <button type="button" className="hover:text-[#111827]" aria-label="Edit" onClick={() => onEdit(quote)}>
                      <Pencil size={18} />
                    </button>
                    <button type="button" className="hover:text-red-600" aria-label="Delete" onClick={() => onDelete(quote.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-sm text-[#64748B]">
                  No quotes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-[#64748B]">
          Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} quotes
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="w-9 h-9 rounded-lg border border-[#E5E7EB] grid place-items-center disabled:opacity-40">
            {"<"}
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setPage(value)}
              className={`w-9 h-9 rounded-lg grid place-items-center text-sm ${value === page ? "bg-blue-600 text-white" : "border border-[#E5E7EB] text-[#111827]"}`}
            >
              {value}
            </button>
          ))}
          <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages || totalPages === 0} className="w-9 h-9 rounded-lg border border-[#E5E7EB] grid place-items-center disabled:opacity-40">
            {">"}
          </button>
        </div>
      </div>

      <QuoteViewModal
        open={!!viewId}
        onClose={() => setViewId(null)}
        quoteId={viewId}
        onEdit={onEdit}
      />
    </div>
  );
}
