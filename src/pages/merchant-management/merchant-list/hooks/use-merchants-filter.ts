import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { getEnumEntries, separateWords } from "@/lib/object-utils";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { DealerStatus } from "@/types/response/dealer-response";
import { DEFAULT_PAGE_SIZE } from "@/constants/default-constants";
import { useDebounce } from "@/hooks/useDebounce";

type SelectOption = {
    label: string;
    value: string;
};

const filterParsers = {
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
    search: parseAsString,
    status: parseAsInteger,
};

const useMerchantsFilter = () => {
    const [filters, setFilters] = useQueryStates(filterParsers);

    const [searchKeyword, setSearchKeyword] = useState(filters.search ?? "");
    const debouncedSearchKeyword = useDebounce(searchKeyword, 300);

    useEffect(() => {
        if (debouncedSearchKeyword !== (filters.search ?? "")) {
            setFilters({
                search: debouncedSearchKeyword || null,
                page: 1,
            });
        }
    }, [debouncedSearchKeyword, filters.search, setFilters]);

    const statusOptions = useMemo(
        () =>
            getEnumEntries(DealerStatus).map(([label, value]) => ({
                label: separateWords(label),
                value: String(value),
            })),
        []
    );

    const selectedStatus = useMemo(
        () =>
            statusOptions.find(
                (option) => option.value === String(filters.status)
            ) ?? null,
        [statusOptions, filters.status]
    );

    const handleSearchChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setSearchKeyword(event.target.value);
        },
        []
    );

    const handleStatusChange = useCallback(
        (value: SelectOption | null) => {
            setFilters({
                status: value ? Number(value.value) : null,
                page: 1,
            });
        },
        [setFilters]
    );

    const clearSearch = useCallback(() => {
        setSearchKeyword("");

        setFilters({
            search: null,
            page: 1,
        });
    }, [setFilters]);

    const resetFilters = useCallback(() => {
        setSearchKeyword("");

        setFilters({
            search: null,
            status: null,
            page: 1,
        });
    }, [setFilters]);

    const handlePageChange = useCallback(
        (page: number, perPage: number) => {
            setFilters({
                page,
                perPage,
            });
        },
        [setFilters]
    );

    return {
        filters,
        setFilters,
        searchKeyword,
        debouncedSearchKeyword,
        statusOptions,
        selectedStatus,
        resetFilters,
        clearSearch,
        handlePageChange,
        handleSearchChange,
        handleStatusChange,
    };
};

export default useMerchantsFilter;
