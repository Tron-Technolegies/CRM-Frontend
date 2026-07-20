import React from "react";
import { useNavigate } from "react-router-dom";

const ProductHeader = ({ saveProduct, editId }) => {

    const navigate = useNavigate();

    return (
        <div className="mt-6 flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">
                {editId ? "Update Product" : "Create Product"}
            </h1>

            <div className="flex items-center space-x-4">

                <button
                    type="button"
                    onClick={() => navigate("/inventory/products")}
                    className="border font-semibold rounded-md px-3 py-2"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={saveProduct}
                    className="bg-[#2B61FF] text-white py-2 px-7 rounded-md"
                >
                    {editId ? "Update Product" : "Save Product"}
                </button>

            </div>
        </div>
    );
};

export default ProductHeader;