import React from "react";
import { Link } from "react-router-dom";

const PurchaseOrders = () => {
    const PurchaseOrders = [
        {
            id: 1, subject: "text", status: "created", grand: "Rs.65,677.00", vendor: "text", contact: "text", order: "Mathew John"
        },
        {
            id: 1, subject: "text", status: "created", grand: "Rs.65,677.00", vendor: "text", contact: "text", order: "Mathew John"
        },
    ];


    return (
        <div className="mt-5">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-[28px] font-bold text-[#111827]">
                    PurchaseOrders
                </h1>
                <Link to="addpurchase">
                    <button
                        type="button"
                        className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-medium text-white transition hover:bg-blue-700">
                        Create PurchaseOrders
                    </button>
                </Link>
            </div>
            <div className="overflow-x-auto border rounded-lg border-slate-300">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-[#E5EEFF] border border-gray-300">
                            <th className="px-5 py-8 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                SUBJECT
                            </th>
                            <th className="px-5 py-5 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                STATUS
                            </th>
                            <th className="px-5 py-5 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                GRAND TOTAL
                            </th>
                            <th className="px-5 py-5 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                VENDOR NAME
                            </th>
                            <th className="px-5 py-5 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                CONTACT NAME
                            </th>
                            <th className="px-5 py-5 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                ORDER OWNER
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {PurchaseOrders.map((purchase) => (
                            <tr
                                key={purchase.id}
                                className="hover:bg-gray-50">
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium text-gray-700">
                                    {purchase.subject}
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    {purchase.status}
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    {purchase.grand}
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    {purchase.vendor}
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    {purchase.contact}
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    {purchase.order}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PurchaseOrders;