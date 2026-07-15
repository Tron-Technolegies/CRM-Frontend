import { Plus } from "lucide-react";

export default function OrderedItems() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">
                Ordered Items
            </h2>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full border-collapse table-fixed">
                    <thead>
                        <tr className="bg-[#EFF4FF]">
                            <th className="w-16 px-3 py-6 text-center text-sm font-semibold text-slate-700">
                                S.No
                            </th>
                            <th className="w-64 px-3 py-3 text-left text-sm font-semibold text-slate-700">
                                Product Name
                            </th>
                            <th className="px-3 py-3 text-center text-sm font-semibold text-slate-700">
                                Quantity
                            </th>
                            <th className=" px-3 py-3 text-center text-sm font-semibold text-slate-700">
                                List Price
                            </th>
                            <th className=" px-3 py-3 text-center text-sm font-semibold text-slate-700">
                                Amount
                            </th>
                            <th className="px-3 py-3 text-center text-sm font-semibold text-slate-700">
                                Discount
                            </th>
                            <th className=" px-3 py-3 text-center text-sm font-semibold text-slate-700">
                                Tax
                            </th>
                            <th className="px-3 py-3 text-center text-sm font-semibold text-slate-700">
                                Total
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border border-slate-200 p-3 text-center text-sm text-slate-700 bg-[#F5F5F5]">
                                1
                            </td>

                            <td className="border border-slate-200 p-2 bg-[#F5F5F5]">

                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none  bg-white"
                                />
                            </td>

                            <td className="border border-slate-200 p-2 bg-[#F5F5F5]">
                                <input
                                    type="number"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-center outline-none bg-white"
                                />
                            </td>

                            <td className="border border-slate-200 p-2 bg-[#F5F5F5]">
                                <input
                                    type="number"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-right outline-none bg-white"
                                />
                            </td>
                            <td className="border border-slate-200 p-2 bg-[#F5F5F5]">
                                <input
                                    type="number"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-right outline-none bg-white"
                                />
                            </td>
                            <td className="border border-slate-200 p-2 bg-[#F5F5F5]">
                                <input
                                    type="number"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-right outline-none bg-white"
                                />
                            </td>
                            <td className="border border-slate-200 p-2 bg-[#F5F5F5]">

                                <input
                                    type="number"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-right outline-none bg-white"
                                />
                            </td>
                            <td className="border border-slate-200 p-2 bg-[#F5F5F5]">

                                <input
                                    type="number"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-right outline-none bg-white"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row">
                <button className="inline-flex h-fit items-center gap-2 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50">
                    Add Row
                    <Plus size={16} />

                </button>

                <div className="w-full md:w-80 rounded-xl border border-slate-200 p-5">
                    <div className="space-y-4">

                        {/* Sub Total */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">
                                Sub Total
                            </span>
                            <input
                                type="text"
                                readOnly
                                className="w-36 rounded-lg bg-[#EBEBEB] px-3 py-2 text-sm outline-none"
                            />
                        </div>

                        {/* Discount */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">
                                Discount
                            </span>
                            <input
                                type="text"
                                readOnly
                                className="w-36 rounded-lg bg-[#EBEBEB] px-3 py-2 text-sm outline-none"
                            />
                        </div>

                        {/* Tax */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">
                                Tax
                            </span>
                            <input
                                type="text"
                                readOnly
                                className="w-36 rounded-lg bg-[#EBEBEB] px-3 py-2 text-sm outline-none"
                            />
                        </div>

                        {/* Adjustment */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">
                                Adjustment
                            </span>
                            <input
                                type="number"
                                className="w-36 rounded-lg bg-[#EBEBEB] px-3 py-2 text-sm outline-none"
                            />
                        </div>

                        {/* Grand Total */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-700">
                                Grand Total
                            </span>
                            <input
                                type="text"
                                readOnly
                                className="w-36 rounded-lg bg-[#EBEBEB] px-3 py-2 text-right font-semibold text-[#2B61FF] outline-none"
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}