import React from "react";

const InvoiceInfo = () => {
    return (
        <div className="border border-gray-300 shadow-lg rounded-lg p-9">

            <h1 className="font-bold mb-7 text-xl">
                Invoice Information
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mx-9">

                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Invoice Owner
                    </label>

                    <input
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Sales Order
                    </label>

                    <input
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Subject
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
                        Purchase Order
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
                        Invoice Date
                    </label>

                    <div className="relative">
                        <input
                            type="date"
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] pl-10 pr-4 text-sm outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Account Name
                    </label>

                    <div className="relative">
                        <input
                            type="number"
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] pl-10 pr-4 text-sm outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Contact Name
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
                        Deal Name
                    </label>
                    <input
                        type="date"
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>


                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2 mt-2">
                        Due Date
                    </label>

                    <input
                        type="date"
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Excise Duty
                    </label>

                    <input
                        type="text"
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Sales Commission
                    </label>

                    <input
                        type="text"
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Status
                    </label>

                    <input
                        type="text"
                        placeholder="Created"
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>


            </div>
        </div>
    );
};

export default InvoiceInfo;