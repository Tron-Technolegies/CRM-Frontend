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

    // Smart windowing for pages to prevent horizontal overflow
    const getPageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages = [];
        if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, "...", totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                Showing <span className="font-semibold">{start}</span> to{" "}
                <span className="font-semibold">{end}</span> of{" "}
                <span className="font-semibold">{totalItems}</span> {itemName}
            </p>

            {totalPages > 1 && (
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                    <button
                        type="button"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md border border-gray-300 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100 transition cursor-pointer"
                        aria-label="Previous page"
                    >
                        <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>

                    {getPageNumbers().map((item, index) => {
                        if (item === "...") {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="px-1 text-xs sm:text-sm text-gray-400 select-none"
                                >
                                    ...
                                </span>
                            );
                        }

                        return (
                            <button
                                key={item}
                                type="button"
                                onClick={() => onPageChange(item)}
                                className={`h-8 w-8 sm:h-9 sm:w-9 rounded-md text-xs sm:text-sm font-medium transition cursor-pointer ${
                                    currentPage === item
                                        ? "bg-blue-600 text-white"
                                        : "border border-gray-300 hover:bg-gray-100 text-gray-700"
                                }`}
                            >
                                {item}
                            </button>
                        );
                    })}

                    <button
                        type="button"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md border border-gray-300 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100 transition cursor-pointer"
                        aria-label="Next page"
                    >
                        <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Pagination;
