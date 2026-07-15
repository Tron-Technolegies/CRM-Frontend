import React from "react";

const AddressInfo = () => {
    return (
        <div className="border border-gray-300 shadow-lg rounded-lg p-9 my-6">

            <h1 className="font-semibold mb-6">
                Address Information
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-9">

                {/* Billing Address */}
                <div className="pr-8">
                    <h2 className="text-[#2B61FF] font-semibold mb-6">
                        Billing Address
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-[#64748B] mb-2">
                                Country / Region
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
                                Flat/ House No./ Building/ Apartment Name
                            </label>
                            <input
                                type="text"
                                className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[#64748B] mb-2">
                                Street Address
                            </label>
                            <input
                                type="text"
                                className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[#64748B] mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[#64748B] mb-2">
                                State/ Province
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
                                Zip/ Postal Code
                            </label>
                            <input
                                type="text"
                                className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="border-l border-gray-300 pl-16">
                    <h2 className="text-[#2B61FF] font-semibold mb-6">
                        Shipping Address
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-[#64748B] mb-2">
                                Country / Region
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
                                Flat/ House No./ Building/ Apartment Name
                            </label>
                            <input
                                type="text"
                                className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[#64748B] mb-2">
                                Street Address
                            </label>
                            <input
                                type="text"
                                className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[#64748B] mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[#64748B] mb-2">
                                State/ Province
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
                                Zip/ Postal Code
                            </label>
                            <input
                                type="text"
                                className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AddressInfo;