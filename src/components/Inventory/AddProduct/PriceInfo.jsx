import React from "react";

const PriceInfo = () => {
    return (
        <div className="border border-gray-300 shadow-lg rounded-lg p-9 my-6">

            <h1 className="font-bold mb-5 text-xl">
                Price Information
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mx-9">

                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Unit Price
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
                        Commission Rate
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
                        Tax
                    </label>

                    <select className="h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none">
                        <option value="">None</option>
                        <option value="website">Website</option>
                        <option value="referral">Referral</option>
                        <option value="social">Social Media</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Taxable
                    </label>

                    <label className="flex items-center h-11 gap-3">
                        <input
                            type="checkbox"
                            className="h-5 w-5 accent-[#2B61FF]" />
                        <span className="text-sm text-[#374151]">
                            Taxable
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default PriceInfo;