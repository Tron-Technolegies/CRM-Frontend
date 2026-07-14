import React from "react";
import { Link } from "react-router-dom";

const Invoices = () => {
    const invoices = [
        {
            id: 1, subject: "text", status: "created", invoice: "Rs.65,677.00", grand: "text", contact: "text", account: "text", owner: "Mathew John"
        },
        {
            id: 1, subject: "text", status: "created", invoice: "Rs.65,677.00", grand: "text", contact: "text", account: "text", owner: "Mathew John"
        },
    ];


    return (
        <div className="mt-5">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-[28px] font-bold text-[#111827]">
                    Invoices
                </h1>
                <Link to="addinvoice">
                    <button
                        type="button"
                        className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-medium text-white transition hover:bg-blue-700">
                        Create Invoices
                    </button>
                </Link>
            </div>
            <div className="overflow-x-auto border rounded-lg border-slate-300">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-[#E5EEFF] border border-gray-300">
                            <th className="px-5 py-5 text-left text-sm font-bold  tracking-wide text-[#64748B]">
                                SUBJECT
                            </th>
                            <th className="px-5 py-8 text-left text-sm font-bold  tracking-wide text-[#64748B]">
                                STATUS
                            </th>
                            <th className="px-5 py-5 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                INVOICE DATE
                            </th>
                            <th className="px-5 py-5 text-left text-sm font-bold  tracking-wide text-[#64748B]">
                                GRAND TOTAL
                            </th>
                            <th className="px-5 py-5 text-left text-sm font-bold  tracking-wide text-[#64748B]">
                                CONTACT NAME
                            </th>
                            <th className="px-5 py-5 text-left text-sm font-bold  tracking-wide text-[#64748B]">
                                ACCOUNT NAME
                            </th>
                            <th className="px-5 py-5 text-left text-sm font-bold  tracking-wide text-[#64748B]">
                                INVOICE OWNER
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr
                                key={invoice.id}
                                className="hover:bg-gray-50">
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium text-gray-700">
                                    {invoice.subject}
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    {invoice.status}
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    {invoice.invoice}
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    {invoice.grand}
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    {invoice.contact}
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    {invoice.account}
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    {invoice.owner}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Invoices;