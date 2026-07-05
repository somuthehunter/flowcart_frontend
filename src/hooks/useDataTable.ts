"use client";

import * as React from "react";
import { useMemo } from "react";
import {
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnPinningState,
    type OnChangeFn,
    type PaginationState,
    type VisibilityState,
} from "@tanstack/react-table";

interface UseDataTableProps<TData, TValue> {
    data: Array<TData>;
    columns: Array<ColumnDef<TData, TValue>>;
    totalRows: number;
    page: number;
    rowsPerPage: number;
    onPageChange?: (page: number, rowsPerPage: number) => void;
    initialColumnPinning?: ColumnPinningState;
    getRowId?: (originalRow: TData) => string;
}

export function useDataTable<TData, TValue>({
    data,
    columns,
    totalRows,
    page,
    rowsPerPage,
    onPageChange,
    initialColumnPinning,
    getRowId,
}: UseDataTableProps<TData, TValue>) {
    const [columnPinning, setColumnPinning] =
        React.useState<ColumnPinningState>(initialColumnPinning ?? {});
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const pageCount = useMemo(
        () => Math.ceil(totalRows / rowsPerPage),
        [totalRows, rowsPerPage]
    );

    const pagination: PaginationState = React.useMemo(
        () => ({
            pageIndex: page - 1,
            pageSize: rowsPerPage,
        }),
        [page, rowsPerPage]
    );

    const handlePaginationChange: OnChangeFn<PaginationState> =
        React.useCallback(
            (updater) => {
                const next =
                    typeof updater === "function"
                        ? updater(pagination)
                        : updater;
                onPageChange?.(next.pageIndex + 1, next.pageSize);
            },
            [pagination, onPageChange]
        );

    const table = useReactTable({
        data,
        columns,
        pageCount: pageCount ?? -1,
        state: {
            pagination,
            columnVisibility,
            rowSelection,
            columnPinning,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: handlePaginationChange,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnPinningChange: setColumnPinning,
        enableColumnPinning: false,
        initialState: { columnPinning: initialColumnPinning },
        getCoreRowModel: getCoreRowModel(),
        getRowId: getRowId,
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
    });

    return { table };
}
