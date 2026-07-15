import React from "react";

const ProductInfo = () => {
    return (
        <div className="border border-gray-300 shadow-lg rounded-lg p-9">

            <h1 className="font-bold text-xl mb-5">
                Product Information
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mx-9">

                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Product Owner
                    </label>

                    <input
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Product Name
                    </label>

                    <input
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Product Code
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
                        Vendor Name
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
                        Product Active
                    </label>

                    <label className="block text-xs font-medium  mb-2">
                        <input
                            type="checkbox"
                            className="h-5 w-5 accent-[#2B61FF]"
                        />
                    </label>
                </div>

                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Manufacturer
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
                        Product Category
                    </label>

                    <select
                        className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none"
                    >
                        <option value="">None</option>
                        <option value="website">Website</option>
                        <option value="referral">Referral</option>
                        <option value="social">Social Media</option>
                    </select>
                </div>


                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2 mt-2">
                        Sales Start Date
                    </label>

                    <input
                        type="date"
                        placeholder="FedEx, UPS, etc."
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Sales End Date
                    </label>

                    <input
                        type="date"
                        placeholder="Name"
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Support Start Date
                    </label>

                    <input
                        type="date"
                        placeholder="FedEx, UPS, etc."
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Support End Date
                    </label>

                    <input
                        type="date"
                        placeholder="Name"
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Sales Start Date
                    </label>

                    <input
                        type="date"
                        placeholder="FedEx, UPS, etc."
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>

            </div>
        </div>
    );
};

export default ProductInfo;