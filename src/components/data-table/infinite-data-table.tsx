"use client";

import { useCallback, useEffect, useRef } from "react";
import { getCommonPinningStyles } from "@/lib/data-table";
import { cn } from "@/lib/utils";
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronDown } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "../ui/button";

interface InfiniteDataTableProps<TData> extends React.ComponentProps<"div"> {
    table: TanstackTable<TData>;
    actionBar?: React.ReactNode;
    fetchMoreOnBottomReached: (
        containerElement?: HTMLDivElement | null
    ) => void;
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
    isLoading: boolean;
    tableHeight?: number | string;
    rowHeight?: number;
    overscan?: number;
}

export function InfiniteDataTable<TData>({
    table,
    actionBar,
    children,
    className,
    fetchMoreOnBottomReached,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
    tableHeight = 600,
    rowHeight = 45,
    overscan = 5,
    ...props
}: InfiniteDataTableProps<TData>) {
    // Create a reference to the scrollable div
    const tableContainerRef = useRef<HTMLDivElement>(null);

    const { rows } = table.getRowModel();

    // Generate dynamic grid template columns based on column definitions
    const getGridTemplateColumns = useCallback(() => {
        const columns = table.getVisibleLeafColumns();
        if (columns.length === 0) return "1fr";

        // Build grid template using actual column sizing properties
        const gridColumns = columns.map((column, index) => {
            // First column (usually select/checkbox) gets auto sizing
            if (index === 0) {
                return "auto";
            }

            const size = column.getSize();
            const minSize = column.columnDef.minSize || 100;
            const maxSize = column.columnDef.maxSize;

            // If column has a specific size, use it with a reasonable min/max
            if (size && size > 0) {
                const min = Math.min(minSize, size);
                const max =
                    maxSize && maxSize < size * 2 ? maxSize : size * 1.5;
                return `minmax(${min}px, ${max}px)`;
            }

            // If only minSize is set, use it with flexible growth
            if (minSize && !maxSize) {
                return `minmax(${minSize}px, 1fr)`;
            }

            // If both min and max are set
            if (minSize && maxSize) {
                return `minmax(${minSize}px, ${maxSize}px)`;
            }

            // Default fallback
            return "minmax(120px, 1fr)";
        });

        return gridColumns.join(" ");
    }, [table]);

    // Set up the virtualizer for efficient rendering
    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        estimateSize: () => rowHeight,
        getScrollElement: () => tableContainerRef.current,
        overscan,
        measureElement:
            typeof window !== "undefined" &&
            navigator.userAgent.indexOf("Firefox") === -1
                ? (element) => element?.getBoundingClientRect().height
                : undefined,
    }); // Initial load check - only run once after the component has fully rendered
    const initialCheckRef = useRef(false);

    useEffect(() => {
        // Only check once after initial render to avoid loops
        if (!initialCheckRef.current && rows.length > 0) {
            // Use a small timeout to ensure the container has properly rendered
            const timer = setTimeout(() => {
                // Check if we need to load more data on initial render
                if (
                    tableContainerRef.current &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchMoreOnBottomReached(tableContainerRef.current);
                }
                initialCheckRef.current = true;
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [
        fetchMoreOnBottomReached,
        rows.length,
        hasNextPage,
        isFetchingNextPage,
    ]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (!tableContainerRef.current) return;

        // Scroll down on PageDown or Arrow Down
        if (
            event.key === "PageDown" ||
            (event.key === "ArrowDown" && event.ctrlKey)
        ) {
            event.preventDefault();
            tableContainerRef.current.scrollTop +=
                tableContainerRef.current.clientHeight * 0.8;
        }

        // Scroll up on PageUp or Arrow Up
        if (
            event.key === "PageUp" ||
            (event.key === "ArrowUp" && event.ctrlKey)
        ) {
            event.preventDefault();
            tableContainerRef.current.scrollTop -=
                tableContainerRef.current.clientHeight * 0.8;
        }

        // Scroll to bottom on End
        if (event.key === "End") {
            event.preventDefault();
            tableContainerRef.current.scrollTop =
                tableContainerRef.current.scrollHeight;
        }

        // Scroll to top on Home
        if (event.key === "Home") {
            event.preventDefault();
            tableContainerRef.current.scrollTop = 0;
        }
    }, []);
    return (
        <div
            className={cn("flex w-full flex-col gap-2.5", className)}
            {...props}>
            {children}
            <div className="overflow-hidden rounded-md border bg-card">
                {/* Fixed Header */}
                <div className="bg-muted/50 border-b">
                    <Table className="bg-card">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="grid"
                                    style={{
                                        gridTemplateColumns:
                                            getGridTemplateColumns(),
                                    }}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className="grid items-center"
                                            style={{
                                                ...getCommonPinningStyles({
                                                    column: header.column,
                                                }),
                                                width: "100%",
                                            }}>
                                            <span>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </span>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                    </Table>
                </div>

                {/* Scrollable Body */}
                <div
                    ref={tableContainerRef}
                    onScroll={(e) => {
                        // Throttle scroll events to improve performance
                        if (!hasNextPage || isFetchingNextPage) return;
                        fetchMoreOnBottomReached(e.currentTarget);
                    }}
                    onKeyDown={handleKeyDown}
                    className="overflow-auto"
                    style={{
                        height:
                            typeof tableHeight === "number"
                                ? tableHeight - 50
                                : `calc(${tableHeight} - 50px)`, // Subtract header height
                        position: "relative",
                    }}
                    tabIndex={0} // Make container focusable for keyboard navigation
                >
                    {isLoading && rows.length === 0 ? (
                        <div className="flex flex-col gap-2 p-4">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>
                    ) : (
                        <Table className="bg-card">
                            <TableBody
                                style={{
                                    height: `${rowVirtualizer.getTotalSize()}px`,
                                    position: "relative",
                                }}>
                                {rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={
                                                table.getVisibleLeafColumns()
                                                    .length
                                            }
                                            className="h-24 text-center">
                                            <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
                                                <p className="my-56 text-sm font-medium">
                                                    No results found. Try
                                                    adjusting your filters or
                                                    keywords.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rowVirtualizer
                                        .getVirtualItems()
                                        .map((virtualRow) => {
                                            const row = rows[virtualRow.index];
                                            if (!row) return null;

                                            return (
                                                <TableRow
                                                    key={row.id}
                                                    data-index={
                                                        virtualRow.index
                                                    }
                                                    ref={(node) =>
                                                        rowVirtualizer.measureElement(
                                                            node
                                                        )
                                                    }
                                                    data-state={
                                                        row.getIsSelected() &&
                                                        "selected"
                                                    }
                                                    className="grid"
                                                    style={{
                                                        position: "absolute",
                                                        top: 0,
                                                        left: 0,
                                                        transform: `translateY(${virtualRow.start}px)`,
                                                        width: "100%",
                                                        gridTemplateColumns:
                                                            getGridTemplateColumns(),
                                                    }}>
                                                    {row
                                                        .getVisibleCells()
                                                        .map((cell) => (
                                                            <TableCell
                                                                key={cell.id}
                                                                className="grid h-full items-center"
                                                                style={{
                                                                    ...getCommonPinningStyles(
                                                                        {
                                                                            column: cell.column,
                                                                        }
                                                                    ),
                                                                    width: "100%",
                                                                    // width: cell.column.getSize(), // Removed for CSS Grid
                                                                }}>
                                                                <span>
                                                                    {flexRender(
                                                                        cell
                                                                            .column
                                                                            .columnDef
                                                                            .cell,
                                                                        cell.getContext()
                                                                    )}
                                                                </span>
                                                            </TableCell>
                                                        ))}
                                                </TableRow>
                                            );
                                        })
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
            {/* Footer with loading indicator */}
            {(isFetchingNextPage || hasNextPage) && (
                <div className="text-muted-foreground flex justify-center pt-2 text-sm">
                    {isFetchingNextPage ? (
                        <div className="flex items-center gap-2">
                            <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                            Loading more...
                        </div>
                    ) : hasNextPage ? (
                        <div className="flex flex-col items-center">
                            <ChevronDown className="h-4 w-4 animate-bounce" />
                            <div className="flex flex-row items-center gap-2">
                                Scroll down or
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        if (!hasNextPage || isFetchingNextPage)
                                            return;
                                        fetchMoreOnBottomReached(
                                            tableContainerRef.current
                                        );
                                    }}>
                                    Click here
                                </Button>
                                to load more
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
            {/* Bottom action bar if needed */}
            {actionBar && <div className="mt-2">{actionBar}</div>}
        </div>
    );
}
