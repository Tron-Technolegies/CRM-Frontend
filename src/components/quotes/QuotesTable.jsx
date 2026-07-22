import { Eye, Pencil, Funnel, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import Pagination from "../Pagination"
import useQuotes from "../../hooks/useQuotes";

const QuotesTable = () => {
    const { quotes, fetchQuotes, removeQuote } = useQuotes();
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("")
    const searchText = search.toLowerCase();
    const [stage, setStage] = useState("all");

    const filteredQuotes = (quotes || []).filter((quote) => {
        const matchesSearch =
            quote.id?.toString().includes(searchText) ||
            quote.subject?.toLowerCase().includes(searchText) ||
            quote.contactName?.toLowerCase().includes(searchText) ||
            quote.accountName?.toLowerCase().includes(searchText) ||
            quote.dealName?.toLowerCase().includes(searchText);

        const matchesStage =
            stage === "all" ||
            quote.quoteStage?.toLowerCase() === stage;

        return matchesSearch && matchesStage;
    });
    useEffect(() => {
        fetchQuotes();
    }, []);

    const itemsPerPage = 10;

    const totalItems = filteredQuotes.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this quote?"
        );

        if (!confirmDelete) return;

        await removeQuote(id);
    };
    return (
        <div className="max-w-full">
            <div className="rounded-lg border border-gray-300 bg-white shadow-lg overflow-hidden">

                <div className="px-12 py-5">
                    <div className="flex flex-wrap items-center gap-3">

                        <div className="relative w-96">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input
                                type="text"
                                placeholder="Search by Quote ID, Customer or Subject..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-md border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        </div>

                        <div className="ml-auto flex items-center gap-3">

                            <div className="flex items-center rounded-lg bg-[#E5EEFF] p-2">
                                <button
                                    onClick={() => setStage("all")}
                                    className={`rounded-md px-4 py-1 text-md font-semibold transition ${stage === "all"
                                        ? "bg-white text-[#004EDC]"
                                        : "text-[#5A5F68] hover:bg-white hover:text-[#004EDC]"
                                        }`}
                                >
                                    All
                                </button>

                                <button
                                    onClick={() => setStage("draft")}
                                    className={`rounded-md px-4 py-1 text-md font-semibold transition ${stage === "draft"
                                        ? "bg-white text-[#004EDC]"
                                        : "text-[#5A5F68] hover:bg-white hover:text-[#004EDC]"
                                        }`}
                                >
                                    Draft
                                </button>

                                <button
                                    onClick={() => setStage("sent")}
                                    className={`rounded-md px-4 py-1 text-md font-semibold transition ${stage === "sent"
                                        ? "bg-white text-[#004EDC]"
                                        : "text-[#5A5F68] hover:bg-white hover:text-[#004EDC]"
                                        }`}>
                                    Sent
                                </button>

                                <button
                                    onClick={() => setStage("won")}
                                    className={`rounded-md px-3 py-1 text-md font-semibold transition ${stage === "won"
                                        ? "bg-white text-[#004EDC]"
                                        : "text-[#5A5F68] hover:bg-white hover:text-[#004EDC]"
                                        }`}
                                >
                                    Won
                                </button>
                            </div>


                            <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2 text-md font-semibold text-[#5A5F68] hover:bg-gray-100 transition">
                                <Funnel size={18} />
                                Filters
                            </button>
                        </div>
                    </div>
                </div>


                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-[#E5EEFF] border border-gray-300">
                                <th className="px-5 py-9 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                    Subject
                                </th>
                                <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                    Quote Stage
                                </th>
                                <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                    Grand Total
                                </th>
                                <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                    Deal Name
                                </th>
                                <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                    Contact Name
                                </th>
                                <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                    Account Name
                                </th>
                                <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                    Quote Owner
                                </th>
                                <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-[#64748B]">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredQuotes.length > 0 ? (
                                filteredQuotes
                                    .slice(
                                        (currentPage - 1) * itemsPerPage,
                                        currentPage * itemsPerPage
                                    )
                                    .map((quote) => (
                                        <tr key={quote.id} className="hover:bg-gray-50">

                                            <td className="border-b border-gray-200 px-5 py-4 text-sm text-gray-700 font-medium">
                                                {quote.subject}
                                            </td>

                                            <td className="border-b border-gray-200 px-5 py-4 font-medium">
                                                {quote.quoteStage}
                                            </td>

                                            <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                                {quote.grandTotal}
                                            </td>

                                            <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                                {quote.dealName}
                                            </td>

                                            <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                                {quote.contactName}
                                            </td>

                                            <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                                {quote.accountName}
                                            </td>

                                            <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                                {quote.quoteOwner}
                                            </td>

                                            <td className="border-b border-gray-200 px-5 py-4">
                                                <div className="flex justify-center gap-3">

                                                    <Eye
                                                        size={18}
                                                        className="cursor-pointer text-gray-700"
                                                    />

                                                    <Pencil
                                                        size={18}
                                                        className="cursor-pointer text-gray-700"
                                                    />

                                                    <Trash2
                                                        size={18}
                                                        className="cursor-pointer text-gray-700"
                                                        onClick={() => handleDelete(quote.id)}
                                                    />


                                                </div>
                                            </td>

                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="text-center py-5 text-gray-500">
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
                    onPageChange={setCurrentPage}
                />

            </div>
        </div>
    );
};

export default QuotesTable;