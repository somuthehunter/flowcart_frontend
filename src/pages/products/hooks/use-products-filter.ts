import { useCallback } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { DEFAULT_PAGE_SIZE } from "@/constants/default-constants";

export const productsFilterParsers = {
    pageNumber: parseAsInteger.withDefault(1),
    rowsPerPage: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
    searchKeyword: parseAsString,
    categoryId: parseAsString,
    status: parseAsString,
};

const useProductsFilter = () => {
    const [{ pageNumber, rowsPerPage, searchKeyword, categoryId, status }, setFilters] =
        useQueryStates(productsFilterParsers);

    const handlePageChange = (page: number, perPage: number) => {
        setFilters({ pageNumber: page, rowsPerPage: perPage });
    };

    const handleFilterChange = useCallback(
        (name: "searchKeyword" | "categoryId" | "status", value: string | null) => {
            setFilters({ pageNumber: 1, [name]: value });
        },
        [setFilters]
    );

    const resetFilters = () => {
        setFilters(null);
    };

    return {
        pageNumber,
        rowsPerPage,
        searchKeyword,
        categoryId,
        status,
        handlePageChange,
        handleFilterChange,
        resetFilters,
    };
};

export default useProductsFilter;
