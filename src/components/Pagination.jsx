import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    itemName = "items",
    onPageChange,
}) => {
    const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            <p className="text-sm text-gray-500">
                Showing <span className="font-semibold">{start}</span> to{" "}
                <span className="font-semibold">{end}</span> of{" "}
                <span className="font-semibold">{totalItems}</span> {itemName}
            </p>

            {totalPages > 1 && (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => onPageChange(index + 1)}
                            className={`h-9 w-9 rounded-md text-sm font-medium transition ${currentPage === index + 1
                                ? "bg-blue-600 text-white"
                                : "border border-gray-300 hover:bg-gray-100"
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Pagination;