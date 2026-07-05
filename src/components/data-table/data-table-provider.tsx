"use client";

import * as React from "react";

import {
    ExtendedColumnFilter,
    ExtendedColumnSort,
    JoinOperator,
} from "@/types/data-table";

interface DataTableContextValue<TData> {
    filters: ExtendedColumnFilter<TData>[];
    sorting: ExtendedColumnSort<TData>[];
    joinOperator: JoinOperator;
    page: number;
    perPage: number;
    setFilters: React.Dispatch<
        React.SetStateAction<ExtendedColumnFilter<TData>[]>
    >;
    setSorting: React.Dispatch<
        React.SetStateAction<ExtendedColumnSort<TData>[]>
    >;
    setJoinOperator: React.Dispatch<React.SetStateAction<JoinOperator>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setPerPage: React.Dispatch<React.SetStateAction<number>>;
}

// Using a generic type for the context to avoid 'any'
const DataTableContext = React.createContext<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DataTableContextValue<any> | undefined
>(undefined);

interface DataTableProviderProps<TData> {
    children: React.ReactNode;
    filters: ExtendedColumnFilter<TData>[];
    sorting: ExtendedColumnSort<TData>[];
    joinOperator: JoinOperator;
    page: number;
    perPage: number;
}

export function DataTableProvider<TData>({
    children,
    joinOperator: initialJoinOperator,
    sorting: initialSorting,
    filters: initialFilters,
    page: initialPage,
    perPage: initialPerPage,
}: DataTableProviderProps<TData>) {
    const [filters, setFilters] =
        React.useState<ExtendedColumnFilter<TData>[]>(initialFilters);
    const [sorting, setSorting] =
        React.useState<ExtendedColumnSort<TData>[]>(initialSorting);
    const [joinOperator, setJoinOperator] =
        React.useState<JoinOperator>(initialJoinOperator);
    const [page, setPage] = React.useState(initialPage);
    const [perPage, setPerPage] = React.useState(initialPerPage);

    const value = React.useMemo(
        () => ({
            filters,
            sorting,
            joinOperator,
            page,
            perPage,
            setFilters,
            setSorting,
            setJoinOperator,
            setPage,
            setPerPage,
        }),
        [
            filters,
            sorting,
            joinOperator,
            page,
            perPage,
            setFilters,
            setSorting,
            setJoinOperator,
            setPage,
            setPerPage,
        ]
    );
    return (
        <DataTableContext.Provider value={value}>
            {children}
        </DataTableContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDataTableContext<TData>() {
    const context = React.useContext(
        DataTableContext as React.Context<
            DataTableContextValue<TData> | undefined
        >
    );
    if (!context) {
        throw new Error(
            "useDataTableContext must be used within a DataTableProvider"
        );
    }
    return context;
}
