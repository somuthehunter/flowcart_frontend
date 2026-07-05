import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DataTableSkeletonProps extends React.ComponentProps<"div"> {
    columnCount: number;
    rowCount?: number;
    filterCount?: number;
    cellWidths?: string[];
    withViewOptions?: boolean;
    withPagination?: boolean;
    shrinkZero?: boolean;
}

export function DataTableSkeleton({
    columnCount,
    rowCount = 10,
    filterCount = 0,
    cellWidths = ["auto"],
    withViewOptions = false,
    withPagination = true,
    shrinkZero = false,
    className,
    ...props
}: DataTableSkeletonProps) {
    const cozyCellWidths = Array.from(
        { length: columnCount },
        (_, index) => cellWidths[index % cellWidths.length] ?? "auto"
    );

    return (
        <div
            className={cn(
                "flex w-full flex-col gap-2.5 overflow-auto",
                className
            )}
            {...props}>
            <div className="flex w-full items-center justify-between gap-2 overflow-auto p-1">
                <div className="flex flex-1 items-center gap-2">
                    {filterCount > 0
                        ? Array.from({ length: filterCount }).map((_, i) => (
                              <Skeleton
                                  key={i}
                                  className="h-7 w-[4.5rem] border-dashed"
                              />
                          ))
                        : null}
                </div>
                {withViewOptions ? (
                    <Skeleton className="ml-auto hidden h-7 w-[4.5rem] lg:flex" />
                ) : null}
            </div>
            <div className="border-border bg-card overflow-hidden rounded-lg border">
                <Table className="bg-card">
                    <TableHeader>
                        {Array.from({ length: 1 }).map((_, i) => (
                            <TableRow
                                key={i}
                                className="border-border bg-muted/20 gap-4 border-b p-4">
                                {Array.from({ length: columnCount }).map(
                                    (_, j) => (
                                        <TableHead
                                            key={j}
                                            className="p-2 py-4"
                                            style={{
                                                width: cozyCellWidths[j],
                                                minWidth: shrinkZero
                                                    ? cozyCellWidths[j]
                                                    : "auto",
                                            }}>
                                            <Skeleton
                                                className={cn("bg-muted", {
                                                    "h-4 w-4":
                                                        i === 0 && j === 0,
                                                    "h-4 w-20":
                                                        i === 0 && j > 0,
                                                })}
                                            />
                                        </TableHead>
                                    )
                                )}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: rowCount }).map((_, i) => (
                            <TableRow
                                key={i}
                                className="border-border hover:bg-muted/10 gap-4 border-b p-4">
                                {Array.from({ length: columnCount }).map(
                                    (_, j) => (
                                        <TableCell
                                            key={j}
                                            className="p-2 py-4"
                                            style={{
                                                width: cozyCellWidths[j],
                                                minWidth: shrinkZero
                                                    ? cozyCellWidths[j]
                                                    : "auto",
                                            }}>
                                            <Skeleton
                                                className={cn("bg-muted", {
                                                    "h-4 w-4": j === 0,
                                                    "h-4 w-28": j > 0,
                                                })}
                                            />
                                        </TableCell>
                                    )
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {withPagination ? (
                <div className="flex w-full items-center justify-between gap-4 overflow-auto p-1 sm:gap-8">
                    <Skeleton className="h-7 w-40 shrink-0" />
                    <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-7 w-24" />
                            <Skeleton className="h-7 w-[4.5rem]" />
                        </div>
                        <div className="flex items-center justify-center text-sm font-medium">
                            <Skeleton className="h-7 w-20" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="hidden size-7 lg:block" />
                            <Skeleton className="size-7" />
                            <Skeleton className="size-7" />
                            <Skeleton className="hidden size-7 lg:block" />
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
