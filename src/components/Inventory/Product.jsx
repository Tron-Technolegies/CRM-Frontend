import React from "react";
import { Link } from "react-router-dom";

const Products = () => {
    const products = [
        {
            id: 1, name: "text", code: "0000", active: "Yes", owner: "Mathew John"
        },
        {
            id: 2, name: "text", code: "0000", active: "Yes", owner: "Mathew John"
        },
    ];


    return (
        <div className="mt-5">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-[#111827]">
                    Products
                </h1>
                <Link to="addproduct">
                    <button
                        type="button"
                        className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-medium text-white transition hover:bg-blue-700">
                        Create Product
                    </button>
                </Link>
            </div>
            <div className="overflow-x-auto border rounded-lg border-slate-300">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-[#E5EEFF] border border-gray-300">
                            <th className="px-5 py-8 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                PRODUCT NAME
                            </th>
                            <th className="px-5 py-5 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                PRODUCT CODE
                            </th>
                            <th className="px-5 py-5 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                PRODUCT ACTIVE
                            </th>
                            <th className="px-5 py-5 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                PRODUCT OWNER
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                className="hover:bg-gray-50">
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium text-gray-700">
                                    {product.name}
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    {product.code}
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    {product.active}
                                </td>
                                <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                                    {product.owner}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;