import { useState, react } from "react";
import { Eye, Pencil, Funnel, Search } from "lucide-react";
import Pagination from "../Pagination";

const QuotesTable = () => {
    const [quotes, setQuotes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const totalItems = quotes.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
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
                                className="w-full rounded-md border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        </div>

                        <div className="ml-auto flex items-center gap-3">

                            <div className="flex items-center rounded-lg bg-[#E5EEFF] p-2">
                                <button className="rounded-md px-4 py-1 text-md font-semibold text-[#5A5F68] hover:bg-white hover:text-[#004EDC] transition">
                                    All
                                </button>
                                <button className="rounded-md px-4 py-1 text-md font-semibold text-[#5A5F68] hover:bg-white hover:text-[#004EDC] transition">
                                    Draft
                                </button>
                                <button className="rounded-md px-4 py-1 text-md font-semibold text-[#5A5F68] hover:bg-white hover:text-[#004EDC] transition">
                                    Sent
                                </button>
                                <button className="rounded-md px-4 py-1 text-md font-semibold text-[#5A5F68] hover:bg-white hover:text-[#004EDC] transition">
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
                            <tr className="hover:bg-gray-50">
                                <td className="border-b border-gray-200 px-5 py-4 text-sm text-gray-700 font-medium">
                                    Text
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 font-medium">
                                    Text
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    Text
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    Text
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    Text
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    Text
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    Text
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4">
                                    <div className="flex justify-center gap-3">
                                        <Eye
                                            size={18}
                                            className="cursor-pointer text-gray-700 hover:text-blue-600"
                                        />
                                        <Pencil
                                            size={18}
                                            className="cursor-pointer text-gray-700 hover:text-green-600"
                                        />
                                    </div>
                                </td>
                            </tr>
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