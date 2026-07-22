import React from "react";

const PriceInfo = ({ formData, handleChange }) => {
    return (
        <div className="border border-gray-300 shadow-lg rounded-lg p-9 my-6">

            <h1 className="font-bold mb-5 text-xl">
                Price Information
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mx-9">

                {/* Unit Price */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Unit Price
                    </label>

                    <input
                        type="number"
                        name="unit_price"
                        value={formData?.unit_price || ""}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>


                {/* Cost Price */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Cost Price
                    </label>
                    <input
                        type="number"
                        name="cost_price"
                        value={formData?.cost_price || ""}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>


                {/* Tax Percentage */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">Tax</label>
                    <select
                        name="tax_percentage"
                        value={formData.tax_percentage}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none">
                        <option value="0">None</option>
                        <option value="5">GST 5%</option>
                        <option value="12">GST 12%</option>
                        <option value="18">GST 18%</option>
                        <option value="28">GST 28%</option>
                    </select>
                </div>


            </div>

        </div>
    );
};

export default PriceInfo;