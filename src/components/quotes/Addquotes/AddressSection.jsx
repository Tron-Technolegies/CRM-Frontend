import React from "react";

const AddressSection = () => {
    return (
        <div className="flex gap-5 my-5 mx-6">

            {/* Billing Address */}
            <div className="border border-gray-300 shadow-lg rounded-lg p-7 w-1/2">

                <h1 className="text-[#2C62FF] font-semibold mb-5">
                    Billing Address
                </h1>

                <div>

                    <textarea
                        placeholder="Street Address"
                        className="mt-2 w-full min-h-[110px] rounded-xl border border-[#E5E7EB] p-4 text-sm outline-none resize-none"
                    />

                    <div className="flex gap-5 mt-3">
                        <input
                            type="text"
                            placeholder="City"
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />

                        <input
                            type="text"
                            placeholder="State"
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />
                    </div>

                    <div className="flex gap-5 mt-3">
                        <input
                            type="text"
                            placeholder="Zip Code"
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />

                        <input
                            type="text"
                            placeholder="Country"
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />
                    </div>

                </div>

            </div>

            {/* Shipping Address */}
            <div className="border border-gray-300 shadow-lg rounded-lg p-7 w-1/2">

                <h1 className="text-[#2C62FF] font-semibold mb-5">
                    Shipping Address
                </h1>

                <div>

                    <textarea
                        placeholder="Street Address"
                        className="mt-2 w-full min-h-[110px] rounded-xl border border-[#E5E7EB] p-4 text-sm outline-none resize-none"
                    />

                    <div className="flex gap-5 mt-3">
                        <input
                            type="text"
                            placeholder="City"
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />

                        <input
                            type="text"
                            placeholder="State"
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />
                    </div>

                    <div className="flex gap-5 mt-3">
                        <input
                            type="text"
                            placeholder="Zip Code"
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />

                        <input
                            type="text"
                            placeholder="Country"
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />
                    </div>

                </div>

            </div>

        </div>
    );
};

export default AddressSection;