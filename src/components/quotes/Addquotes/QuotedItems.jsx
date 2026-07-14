import React from "react";

const QuotedItems = () => {
    return (
        <div className="border border-gray-300 shadow-lg rounded-lg mx-6 overflow-hidden">

            <div className="flex justify-between p-6 bg-[#EFF6FF]">
                <h1 className="text-[#004EDC] font-semibold">
                    Quoted Items
                </h1>

                <button className="text-[#004EDC] font-semibold">
                    + Add Line Item
                </button>

            </div>

            <div className="overflow-x-auto bg-white">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-slate-400 text-xs uppercase tracking-wide border-b border-slate-300">
                            <th className="px-6 py-3 font-medium w-10">#</th>
                            <th className="px-2 py-3 font-medium">Product Name</th>
                            <th className="px-2 py-3 font-medium w-24">Quantity</th>
                            <th className="px-2 py-3 font-medium w-28">List Price</th>
                            <th className="px-2 py-3 font-medium w-24">Discount</th>
                            <th className="px-2 py-3 font-medium w-20">Tax (%)</th>
                            <th className="px-6 py-3 font-medium text-right">Total</th>
                        </tr>
                    </thead>

                    <tbody>

                        {/* Row 1 */}
                        <tr className="border-b border-slate-300">
                            <td className="px-6 py-4 text-slate-400">1</td>

                            <td className="px-2 py-4 font-medium text-slate-800">
                                Enterprise Cloud License
                            </td>

                            <td className="px-2 py-4">
                                <input
                                    type="number"
                                    defaultValue={12}
                                    className="w-16 border border-slate-300 rounded-md px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                />
                            </td>

                            <td className="px-2 py-4 text-slate-700">
                                $ 1,200.00
                            </td>

                            <td className="px-2 py-4">
                                <div className="flex items-center gap-1">
                                    <input
                                        type="number"
                                        defaultValue={10}
                                        className="w-14 border border-slate-300 rounded-md px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                    />
                                    <span className="text-slate-500">%</span>
                                </div>
                            </td>

                            <td className="px-2 py-4">
                                <input
                                    type="number"
                                    defaultValue={8.5}
                                    className="w-14 border border-slate-300 rounded-md px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                />
                            </td>

                            <td className="px-6 py-4 text-right font-semibold text-slate-800">
                                $14,040.00
                            </td>
                        </tr>

                        {/* Row 2 */}
                        <tr className="border-b border-slate-300 last:border-b-0">
                            <td className="px-6 py-4 text-slate-400">2</td>

                            <td className="px-2 py-4 font-medium text-slate-800">
                                Implementation Support (Per Hour)
                            </td>

                            <td className="px-2 py-4">
                                <input
                                    type="number"
                                    defaultValue={40}
                                    className="w-16 border border-slate-400 rounded-md px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                />
                            </td>

                            <td className="px-2 py-4 text-slate-700">
                                $ 150.00
                            </td>

                            <td className="px-2 py-4">
                                <div className="flex items-center gap-1">
                                    <input
                                        type="number"
                                        defaultValue={0}
                                        className="w-14 border border-slate-400 rounded-md px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                    />
                                    <span className="text-slate-500">%</span>
                                </div>
                            </td>

                            <td className="px-2 py-4">
                                <input
                                    type="number"
                                    defaultValue={8.5}
                                    className="w-14 border border-slate-400 rounded-md px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                />
                            </td>

                            <td className="px-6 py-4 text-right font-semibold text-slate-800">
                                $6,510.00
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <div className="flex justify-end px-6 py-6">
                <div className="w-full max-w-xs space-y-2">

                    <div className="flex justify-between text-slate-500 text-sm">
                        <span>Subtotal</span>
                        <span className="font-semibold text-slate-800">
                            $19,100.00
                        </span>
                    </div>

                    <div className="flex justify-between text-slate-500 text-sm">
                        <span>Tax (8.5%)</span>
                        <span className="font-semibold text-slate-800">
                            $1,623.50
                        </span>
                    </div>

                    <div className="flex justify-between text-slate-500 text-sm">
                        <span>Discount</span>
                        <span className="font-semibold text-red-500">
                            -$1,200.00
                        </span>
                    </div>

                    <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                        <span className="font-semibold text-slate-800">
                            Grand Total
                        </span>

                        <span className="text-blue-600 font-bold text-xl">
                            $19,523.50
                        </span>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default QuotedItems;