import { useState } from "react";

const usePagination = (data = [], itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginatedData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const changePage = (page) => {
        setCurrentPage(page);
    };

    const resetPage = () => {
        setCurrentPage(1);
    };

    return {
        currentPage,
        totalPages,
        totalItems: data.length,
        itemsPerPage,
        paginatedData,
        changePage,
        resetPage,
    };
};

export default usePagination;