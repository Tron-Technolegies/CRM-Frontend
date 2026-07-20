import React from "react";

const StockInfo = ({ formData = {}, handleChange }) => {
    return (
        <div className="border border-gray-300 shadow-lg rounded-lg p-9 my-6">
            <h1 className="font-bold text-xl mb-5">
                Stock Information
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mx-9">

                {/* Usage Unit */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Usage Unit
                    </label>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            name="unit"
                            value={formData.unit || ""}
                            onChange={handleChange}
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />
                    </div>
                </div>

                {/* Qty Ordered */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Qty Ordered
                    </label>

                    <div className="relative">
                        <input
                            type="number"
                            name="qty_ordered"
                            value={formData.qty_ordered || ""}
                            onChange={handleChange}
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] pl-10 pr-4 text-sm outline-none"
                        />
                    </div>
                </div>

                {/* Quantity in Stock */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Quantity in Stock
                    </label>

                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            name="quantity_in_stock"
                            value={formData.quantity_in_stock || ""}
                            onChange={handleChange}
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />
                    </div>
                </div>

                {/* Reorder Level */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Reorder Level
                    </label>

                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            name="reorder_level"
                            value={formData.reorder_level || ""}
                            onChange={handleChange}
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />
                    </div>
                </div>

                {/* Handler */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Handler
                    </label>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            name="handler"
                            value={formData.handler || ""}
                            onChange={handleChange}
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />
                    </div>
                </div>

                {/* Quantity in Demand */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Quantity in Demand
                    </label>

                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            name="quantity_in_demand"
                            value={formData.quantity_in_demand || ""}
                            onChange={handleChange}
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StockInfo;