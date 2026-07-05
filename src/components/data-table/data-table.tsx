import type * as React from "react";
import { getCommonPinningStyles } from "@/lib/data-table";
import { cn } from "@/lib/utils";
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
    table: TanstackTable<TData>;
    actionBar?: React.ReactNode;
    type?: "table" | "grid";
    gridSettings?: {
        cardComponent: React.ComponentType<{
            data: TData;
            isSelected: boolean;
        }>;
        classes?: {
            root?: string;
            card?: string;
        };
        gridCols?: number;
    };
    pageSizeOptions?: number[];
    showSelectedRowCount?: boolean;
    classNames?: {
        table?: string;
        tableWrap?: string;
        tableHeader?: string;
        tableHead?: string;
        tableCell?: string;
    };
}

export function DataTable<TData>({
    table,
    actionBar,
    children,
    className,
    type = "table",
    pageSizeOptions = [10, 20, 30, 40, 50],
    showSelectedRowCount = false,
    gridSettings: { cardComponent: CardComponent, classes, gridCols = 3 } = {
        cardComponent: () => null,
    },
    classNames,
    ...props
}: DataTableProps<TData>) {
    const gridClass =
        {
            1: "grid-cols-1",
            2: "grid-cols-1 md:grid-cols-2",
            3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
            4: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
            5: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5",
            6: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6",
        }[gridCols] || "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

    return (
        <>
            {type === "table" && (
                <div className="min-w-0 space-y-4">
                    <div
                        className={cn(
                            "flex max-h-[calc(100vh-260px)] w-full flex-col gap-2.5 overflow-auto rounded-xl border",
                            className
                        )}
                        {...props}>
                        {children}

                        <Table className={cn("bg-card", classNames?.table)}>
                            <TableHeader className="bg-card sticky top-0 z-10">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                style={{
                                                    ...getCommonPinningStyles({
                                                        column: header.column,
                                                    }),
                                                }}
                                                className={cn(
                                                    "text-muted-foreground px-4 text-xs font-medium",
                                                    classNames?.tableHead
                                                )}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={
                                                row.getIsSelected() &&
                                                "selected"
                                            }>
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell
                                                        key={cell.id}
                                                        style={{
                                                            ...getCommonPinningStyles(
                                                                {
                                                                    column: cell.column,
                                                                }
                                                            ),
                                                        }}
                                                        className={cn(
                                                            "max-w-75 p-4",
                                                            classNames?.tableCell
                                                        )}>
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={
                                                table.getAllColumns().length
                                            }
                                            className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <DataTablePagination
                            table={table}
                            pageSizeOptions={pageSizeOptions}
                            showSelectedRowCount={showSelectedRowCount}
                        />
                        {actionBar &&
                            table.getFilteredSelectedRowModel().rows.length >
                                0 &&
                            actionBar}
                    </div>
                </div>
            )}
            {type === "grid" && (
                <div
                    className={cn("flex w-full flex-col gap-2.5", className)}
                    {...props}>
                    {children}
                    <div className={cn("rounded-md", classes?.root)}>
                        {table.getRowModel().rows?.length ? (
                            <div
                                className={cn(
                                    "grid auto-rows-fr gap-4",
                                    gridClass
                                )}>
                                {table.getRowModel().rows.map((row) => (
                                    <div
                                        key={row.id}
                                        className={cn(
                                            "transition-all duration-200",
                                            row.getIsSelected() &&
                                                "ring-primary ring-2",
                                            classes?.card
                                        )}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }>
                                        <CardComponent
                                            data={row.original}
                                            isSelected={row.getIsSelected()}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground flex h-24 items-center justify-center text-center">
                                No results.
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <DataTablePagination
                            table={table}
                            pageSizeOptions={pageSizeOptions}
                            showSelectedRowCount={showSelectedRowCount}
                        />
                        {actionBar &&
                            table.getFilteredSelectedRowModel().rows.length >
                                0 &&
                            actionBar}
                    </div>
                </div>
            )}
        </>
    );
}
