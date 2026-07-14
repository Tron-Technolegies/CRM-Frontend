import React from "react";

const StockInfo = () => {
    return (
        <div className="border border-gray-300 shadow-lg rounded-lg p-7 my-6">

            <h1 className="text-[#2C62FF] font-semibold mb-5">
                Stock Information
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Usage Unit
                    </label>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Qty Ordered
                    </label>

                    <div className="relative">
                        <input
                            type="text"
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] pl-10 pr-4 text-sm outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Quantity in Stock
                    </label>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Reorder Level
                    </label>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Handler
                    </label>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Quantity in Demand
                    </label>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockInfo;