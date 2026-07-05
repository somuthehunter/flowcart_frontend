"use client";

import { cn } from "@/lib/utils";
import type { ColumnDef, RowData } from "@tanstack/react-table";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import type { AlignmentType } from "@/types/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type ExtraData = {
    classes?: {
        header?: string;
        rowItem?: string;
    };
    align?: AlignmentType;
};

export type ModifiedColumnDef<
    TData extends RowData,
    TValue = unknown,
> = ColumnDef<TData, TValue> & ExtraData;

interface DataTableProps<TData, TValue> {
    columns: Array<ModifiedColumnDef<TData, TValue>>;
    data: Array<TData>;
    stickyHeader?: boolean;
    totalRows?: number;
    rowsPerPageOptions?: Array<number>;
    enableFilter?: boolean;
    enableColumnViewOptions?: boolean;
    enablePagination?: boolean;
}

export const StaticDataTable = <TData, TValue>({
    columns,
    data,
    stickyHeader,
    totalRows = -1,
}: DataTableProps<TData, TValue>) => {
    const colMeta = columns.reduce<Record<string, ExtraData>>(
        (acc, { id, align, classes }) => ({
            ...acc,
            [id || ""]: { align, classes },
        }),
        {}
    );
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),

        rowCount: totalRows,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const getHeaderAlignmentClass = (alignment: AlignmentType) => {
        switch (alignment) {
            case "left":
                return "text-left";
            case "right":
                return "text-right";
            case "center":
                return "text-center";
            default:
                return "text-left";
        }
    };
    const getBodyAlignmentClass = (alignment: AlignmentType) => {
        switch (alignment) {
            case "left":
                return "text-left";
            case "right":
                return "text-right";
            case "center":
                return "text-center";
            default:
                return "text-left";
        }
    };

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader className={cn(stickyHeader && "sticky top-0")}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={cn(
                                                getHeaderAlignmentClass(
                                                    colMeta[header.id]?.align ??
                                                        "left"
                                                ),
                                                colMeta[header.id]?.classes
                                                    ?.header
                                            )}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={cn(
                                                getBodyAlignmentClass(
                                                    colMeta[cell.column.id]
                                                        ?.align ?? "left"
                                                ),
                                                colMeta[cell.column.id]?.classes
                                                    ?.rowItem
                                            )}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
};
