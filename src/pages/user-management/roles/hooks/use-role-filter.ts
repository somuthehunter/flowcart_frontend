import { useCallback, useMemo, useState } from "react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

import { useDebounce } from "@/hooks/useDebounce";
import { getEnumEntries } from "@/lib/object-utils";
import { RoleStatus } from "@/types/response/role-response";

export const useRoleFilter = () => {
    const [pageNumber, setPageNumber] = useQueryState(
        "page",
        parseAsInteger.withDefault(1)
    );
    const [rowsPerPage, setRowsPerPage] = useQueryState(
        "rows",
        parseAsInteger.withDefault(20)
    );
    
    // For roles, we might just use searchKeyword instead of full nuqs if it's debounced,
    // or keep it in local state and use the debounced value for the API request.
    const [searchKeyword, setSearchKeyword] = useState("");
    const debouncedSearchKeyword = useDebounce(searchKeyword, 300);

    const [statusStr, setStatusStr] = useQueryState(
        "status",
        parseAsString
    );

    const status = statusStr ? (Number(statusStr) as RoleStatus) : null;

    const statusOptions = useMemo(() => {
        return getEnumEntries(RoleStatus).map(([label, value]) => ({
            label,
            value: value.toString(),
        }));
    }, []);

    const handlePageChange = useCallback(
        (page: number) => {
            setPageNumber(page);
        },
        [setPageNumber]
    );

    const handleChange = useCallback(
        (name: string, value: any) => {
            setPageNumber(1);
            if (name === "searchKeyword") {
                setSearchKeyword(value);
            } else if (name === "status") {
                setStatusStr(value || null);
            } else if (name === "rowsPerPage") {
                setRowsPerPage(value);
            }
        },
        [setPageNumber, setStatusStr, setRowsPerPage]
    );

    const resetFilters = useCallback(() => {
        setPageNumber(1);
        setSearchKeyword("");
        setStatusStr(null);
    }, [setPageNumber, setStatusStr]);

    return {
        pageNumber,
        rowsPerPage,
        searchKeyword,
        debouncedSearchKeyword,
        status,
        statusOptions,
        handlePageChange,
        handleChange,
        resetFilters,
    };
};

export type RoleFilterProps = ReturnType<typeof useRoleFilter>;
