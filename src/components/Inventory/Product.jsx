import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";
import Pagination from "../Pagination"
import usePagination from "../../api/usePagination"
import { useNavigate } from "react-router-dom";
import useProducts from "../../hooks/useProducts";


const Product = () => {

    const [viewProduct, setViewProduct] = useState(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const navigate = useNavigate();

    const { products, loading, removeProduct } = useProducts();

    const filteredProducts = (products || []).filter((product) => {
        const matchesSearch = product.name
            ?.toLowerCase()
            .includes(search.toLowerCase());

        const matchesFilter =
            filter === "all" ||
            product.status?.toLowerCase() === filter.toLowerCase();

        return matchesSearch && matchesFilter;
    });

    const {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        paginatedData: paginatedProducts,
        changePage,
        resetPage,
    } = usePagination(filteredProducts, 10);

    useEffect(() => {
        resetPage();
    }, [search, resetPage]);

    return (
        <div className="mt-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-[#111827]">
                    Products
                </h1>

                <Link to="addproduct">
                    <button
                        type="button"
                        className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        Create Product
                    </button>
                </Link>
            </div>

            {/* Search & Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex h-12 w-full max-w-sm items-center gap-3 rounded-xl border border-[#E5E7EB] px-4">
                    <Search size={18} className="text-[#6B7280]" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent text-sm outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border rounded-lg border-slate-300">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-[#E5EEFF] border border-gray-300">
                            <th className="px-5 py-6 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                Product Name
                            </th>

                            <th className="px-5 py-6 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                Product Code
                            </th>

                            <th className="px-5 py-6 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                PRODUCT ACTIVE
                            </th>

                            <th className="px-5 py-6 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                PRODUCT OWNER
                            </th>

                            <th className="px-5 py-6 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="py-6 text-center text-gray-500"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : paginatedProducts.length > 0 ? (
                            paginatedProducts.map((product) => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium text-gray-700">
                                        {product.name}
                                    </td>

                                    <td className="border-b border-gray-200 px-5 py-4 text-sm">
                                        {product.productCode}
                                    </td>

                                    <td className="border-b border-gray-200 px-5 py-4 text-sm">
                                        {product.status}
                                    </td>

                                    <td className="border-b border-gray-200 px-5 py-4 text-sm">
                                        {product.manufacturer || "-"}
                                    </td>

                                    <td className="border-b border-gray-200 px-5 py-4">
                                        <div className="flex gap-3 text-slate-500">
                                            <button
                                                onClick={() =>
                                                    setViewProduct(product)
                                                }>
                                                <Eye size={18} />
                                            </button>

                                            <button
                                                onClick={() => navigate(`addproduct?id=${product.id}`)
                                                }>
                                                <Pencil size={18} />
                                            </button>

                                            <button
                                                onClick={() => removeProduct(product.id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="py-6 text-center text-gray-500"
                                >
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-5">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    itemName="products"
                    onPageChange={changePage}
                />
            </div>

            {/* Product View Modal */}
            {/* <ProductViewModal
                open={!!viewProduct}
                onClose={() => setViewProduct(null)}
                product={viewProduct}
            /> */}
        </div>
    );
};

export default Product;