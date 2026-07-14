import React from "react";
import { Link } from "react-router-dom";

const SalesOrder = () => {
    const salesorder = [
        {
            id: 1, subject: "text", status: "created", grand: "Rs.65,677.00", deal: "text", contact: "text", account: "text", order: "Mathew John"
        },
        {
            id: 2, subject: "text", status: "created", grand: "Rs.65,677.00", deal: "text", contact: "text", account: "text", order: "Mathew John"

        },
    ];


    return (
        <div className="mt-5">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-[28px] font-bold text-[#111827]">
                    Sales Order
                </h1>
                <Link to="addsales">
                    <button
                        type="button"
                        className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-medium text-white transition hover:bg-blue-700">
                        Create Sales Order
                    </button>
                </Link>

            </div>
            <div className="overflow-x-auto border rounded-lg border-slate-300">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-[#E5EEFF] border border-gray-300">
                            <th className="px-5 py-5 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                SUBJECT
                            </th>
                            <th className="px-5 py-8 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                STATUS
                            </th>
                            <th className="px-5 py-5 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                GRAND TOTAL
                            </th>
                            <th className="px-5 py-5 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                DEAL NAME
                            </th>
                            <th className="px-5 py-5 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                CONTACT NAME
                            </th>
                            <th className="px-5 py-5 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                ACCOUNT NAME
                            </th>
                            <th className="px-5 py-5 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                ORDER OWNER
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesorder.map((sales) => (
                            <tr
                                key={sales.id}
                                className="hover:bg-gray-50">
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium text-gray-700">
                                    {sales.subject}
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    {sales.status}
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    {sales.grand}
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    {sales.deal}
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    {sales.contact}
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    {sales.account}
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    {sales.order}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesOrder;