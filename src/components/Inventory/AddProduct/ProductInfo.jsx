import React from "react";

const ProductInfo = ({ formData = {}, handleChange }) => {
    return (
        <div className="border border-gray-300 shadow-lg rounded-lg p-9">
            <h1 className="font-bold text-xl mb-5">
                Product Information
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mx-9">

                {/* Product Owner */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Product Owner
                    </label>

                    <input
                        type="text"
                        name="product_owner"
                        value={formData.product_owner || ""}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>

                {/* Product Name */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Product Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>

                {/* Product Code */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Product Code
                    </label>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            name="product_code"
                            value={formData.product_code || ""}
                            onChange={handleChange}
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        SKU
                    </label>

                    <input
                        type="text"
                        name="sku"
                        value={formData.sku || ""}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>

                {/* Vendor Name */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Vendor Name
                    </label>

                    <div className="relative">
                        <input
                            type="text"
                            name="vendor_id"
                            value={formData.vendor_id || ""}
                            onChange={handleChange}
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] pl-10 pr-4 text-sm outline-none"
                        />
                    </div>
                </div>

                {/* Product Active */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Product Active
                    </label>

                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="status"
                            checked={formData.status === "active"}
                            onChange={(e) =>
                                handleChange({
                                    target: {
                                        name: "status",
                                        value: e.target.checked
                                            ? "active"
                                            : "inactive",
                                        type: "text",
                                    },
                                })
                            }
                            className="h-5 w-5 accent-[#2B61FF]"
                        />
                    </label>
                </div>

                {/* Manufacturer */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Manufacturer
                    </label>

                    <select
                        name="manufacturer"
                        value={formData.manufacturer || ""}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none"
                    >
                        <option value="">None</option>
                        <option value="website">Website</option>
                        <option value="referral">Referral</option>
                        <option value="social">Social Media</option>
                    </select>
                </div>

                {/* Product Category */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Product Category
                    </label>

                    <select
                        name="category"
                        value={formData.category || ""}
                        onChange={handleChange}
                        className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none"
                    >
                        <option value="">None</option>
                        <option value="website">Website</option>
                        <option value="referral">Referral</option>
                        <option value="social">Social Media</option>
                    </select>
                </div>

                {/* Sales Start Date */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2 mt-2">
                        Sales Start Date
                    </label>

                    <input
                        type="date"
                        name="sales_start_date"
                        value={formData.sales_start_date || ""}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>

                {/* Sales End Date */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Sales End Date
                    </label>

                    <input
                        type="date"
                        name="sales_end_date"
                        value={formData.sales_end_date || ""}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>

                {/* Support Start Date */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Support Start Date
                    </label>

                    <input
                        type="date"
                        name="support_start_date"
                        value={formData.support_start_date || ""}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>

                {/* Support End Date */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Support End Date
                    </label>

                    <input
                        type="date"
                        name="support_end_date"
                        value={formData.support_end_date || ""}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>

                {/* Additional Date */}
                <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-2">
                        Sales Start Date
                    </label>

                    <input
                        type="date"
                        name="additional_date"
                        value={formData.additional_date || ""}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>

            </div>
        </div>
    );
};

export default ProductInfo;