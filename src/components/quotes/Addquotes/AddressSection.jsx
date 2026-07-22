import React from "react";

const AddressSection = ({ formData, handleChange }) => {
    return (
        <div className="flex gap-5 my-5 mx-6">

            {/* Billing Address */}
            <div className="border border-gray-300 shadow-lg rounded-lg p-7 w-1/2">

                <h1 className="text-[#2C62FF] font-semibold mb-5">
                    Billing Address
                </h1>

                <textarea
                    name="billing_address"
                    value={formData.billing_address || ""}
                    onChange={handleChange}
                    placeholder="Street Address"
                    className="mt-2 w-full min-h-[110px] rounded-xl border border-[#E5E7EB] p-4 text-sm outline-none resize-none"
                />


                <div className="flex gap-5 mt-3">

                    <input
                        name="billing_city"
                        value={formData.billing_city || ""}
                        onChange={handleChange}
                        type="text"
                        placeholder="City"
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />


                    <input
                        name="billing_state"
                        value={formData.billing_state || ""}
                        onChange={handleChange}
                        type="text"
                        placeholder="State"
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />

                </div>


                <div className="flex gap-5 mt-3">

                    <input
                        name="billing_zip_code"
                        value={formData.billing_zip_code || ""}
                        onChange={handleChange}
                        type="text"
                        placeholder="Zip Code"
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />


                    <input
                        name="billing_country"
                        value={formData.billing_country || ""}
                        onChange={handleChange}
                        type="text"
                        placeholder="Country"
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />

                </div>

            </div>



            {/* Shipping Address */}
            <div className="border border-gray-300 shadow-lg rounded-lg p-7 w-1/2">

                <h1 className="text-[#2C62FF] font-semibold mb-5">
                    Shipping Address
                </h1>


                <textarea
                    name="shipping_address"
                    value={formData.shipping_address || ""}
                    onChange={handleChange}
                    placeholder="Street Address"
                    className="mt-2 w-full min-h-[110px] rounded-xl border border-[#E5E7EB] p-4 text-sm outline-none resize-none"
                />


                <div className="flex gap-5 mt-3">

                    <input
                        name="shipping_city"
                        value={formData.shipping_city || ""}
                        onChange={handleChange}
                        type="text"
                        placeholder="City"
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />


                    <input
                        name="shipping_state"
                        value={formData.shipping_state || ""}
                        onChange={handleChange}
                        type="text"
                        placeholder="State"
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />

                </div>


                <div className="flex gap-5 mt-3">

                    <input
                        name="shipping_zip_code"
                        value={formData.shipping_zip_code || ""}
                        onChange={handleChange}
                        type="text"
                        placeholder="Zip Code"
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />


                    <input
                        name="shipping_country"
                        value={formData.shipping_country || ""}
                        onChange={handleChange}
                        type="text"
                        placeholder="Country"
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />

                </div>


            </div>

        </div>
    );
};

export default AddressSection;