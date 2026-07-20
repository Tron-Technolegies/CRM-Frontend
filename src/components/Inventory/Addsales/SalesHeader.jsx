import React from "react";


const SalesHeader = () => {
    return (
        <div className="mt-6 flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold py-3">Sales Orders</h1>
            <div className="flex items-center space-x-4">
                <button className="border font-semibold rounded-md px-3 py-2">Cancel</button>
                <button className="bg-[#2B61FF] text-white py-2 px-7 rounded-md">Save Product</button>
            </div>
        </div>
    );
};

export default SalesHeader;