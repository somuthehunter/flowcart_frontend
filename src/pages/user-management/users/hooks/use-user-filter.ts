import { useCallback, useMemo, useState } from "react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

import { useDebounce } from "@/hooks/useDebounce";
import { getEnumEntries } from "@/lib/object-utils";
import { UserStatus } from "@/types/response/user-response";

export const useUserFilter = () => {
    const [pageNumber, setPageNumber] = useQueryState(
        "page",
        parseAsInteger.withDefault(1)
    );
    const [rowsPerPage, setRowsPerPage] = useQueryState(
        "rows",
        parseAsInteger.withDefault(20)
    );
    
    const [searchKeyword, setSearchKeyword] = useState("");
    const debouncedSearchKeyword = useDebounce(searchKeyword, 300);

    const [statusStr, setStatusStr] = useQueryState(
        "status",
        parseAsString
    );

    const status = statusStr ? (Number(statusStr) as UserStatus) : null;

    const statusOptions = useMemo(() => {
        return getEnumEntries(UserStatus).map(([label, value]) => ({
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

export type UserFilterProps = ReturnType<typeof useUserFilter>;
