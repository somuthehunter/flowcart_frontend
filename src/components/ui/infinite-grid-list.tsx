import { FC, ReactNode } from "react";

import { cn } from "../../lib/utils";
import FailedMessage from "../failed-message";
import { InfiniteScrollCount } from "./infinite-scroll-count";
import { NoMoreData } from "./no-more-data";

type QueryStatus = "pending" | "success" | "error";

type GridColumns = {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
};

type InfiniteGridListProps<T> = {
    // Data & status
    status: QueryStatus;
    data: T[];
    error?: Error | null;

    // Infinite scroll
    loaderRef: (node?: Element | null) => void;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;

    // Render functions
    renderItem: (item: T, index: number) => ReactNode;
    renderSkeleton: () => ReactNode;
    getItemKey: (item: T, index: number) => string | number;

    // Grid configuration
    columns?: GridColumns;
    gap?: number;

    // Loading states
    initialSkeletonCount?: number;
    loadingSkeletonCount?: number;

    // Empty/Error states
    emptyTitle?: string;
    emptyDescription?: string;
    errorMessage?: string;

    // Optional counter
    showCounter?: boolean;
    counterLabel?: string;
    totalCount?: number;

    // Optional no more data message
    noMoreDataMessage?: string;

    // Additional classes
    className?: string;
    gridClassName?: string;
};

const InfiniteGridListInner = <T,>({
    status,
    data,
    error,
    loaderRef,
    hasNextPage,
    isFetchingNextPage,
    renderItem,
    renderSkeleton,
    getItemKey,
    columns = { default: 1, sm: 2, xl: 3, "2xl": 4 },
    initialSkeletonCount = 6,
    loadingSkeletonCount = 3,
    emptyTitle = "No Data Found",
    emptyDescription,
    errorMessage,
    showCounter = false,
    counterLabel = "items",
    totalCount,
    noMoreDataMessage,
    className,
    gridClassName,
}: InfiniteGridListProps<T>) => {
    // Build grid class from columns config
    const gridColVariants: { [key: string]: { [key: number]: string } } = {
        default: {
            1: "grid-cols-1",
            2: "grid-cols-2",
            3: "grid-cols-3",
            4: "grid-cols-4",
            5: "grid-cols-5",
            6: "grid-cols-6",
        },
        sm: {
            1: "sm:grid-cols-1",
            2: "sm:grid-cols-2",
            3: "sm:grid-cols-3",
            4: "sm:grid-cols-4",
            5: "sm:grid-cols-5",
            6: "sm:grid-cols-6",
        },
        md: {
            1: "md:grid-cols-1",
            2: "md:grid-cols-2",
            3: "md:grid-cols-3",
            4: "md:grid-cols-4",
            5: "md:grid-cols-5",
            6: "md:grid-cols-6",
        },
        lg: {
            1: "lg:grid-cols-1",
            2: "lg:grid-cols-2",
            3: "lg:grid-cols-3",
            4: "lg:grid-cols-4",
            5: "lg:grid-cols-5",
            6: "lg:grid-cols-6",
        },
        xl: {
            1: "xl:grid-cols-1",
            2: "xl:grid-cols-2",
            3: "xl:grid-cols-3",
            4: "xl:grid-cols-4",
            5: "xl:grid-cols-5",
            6: "xl:grid-cols-6",
        },
        "2xl": {
            1: "2xl:grid-cols-1",
            2: "2xl:grid-cols-2",
            3: "2xl:grid-cols-3",
            4: "2xl:grid-cols-4",
            5: "2xl:grid-cols-5",
            6: "2xl:grid-cols-6",
        },
    };

    const gridColsClass = Object.entries(columns)
        .map(([breakpoint, numCols]) =>
            numCols ? gridColVariants[breakpoint]?.[numCols] : null
        )
        .filter(Boolean)
        .join(" ");

    return (
        <div className={className}>
            {/* Error State */}
            {status === "error" && (
                <FailedMessage
                    type="error"
                    text={errorMessage || error?.message}
                />
            )}

            {/* Empty State */}
            {status === "success" && data.length === 0 && (
                <FailedMessage type="no-data" text={emptyDescription} />
            )}

            {/* Counter */}
            {showCounter && status === "success" && data.length > 0 && (
                <InfiniteScrollCount
                    currentCount={data.length}
                    totalCount={totalCount ?? 0}
                    label={counterLabel}
                    className="mb-6"
                />
            )}

            {/* Grid */}
            <div
                className={cn(
                    "grid justify-between gap-4",
                    gridColsClass,
                    gridClassName
                )}>
                {/* Initial Loading Skeletons */}
                {status === "pending" &&
                    Array.from({ length: initialSkeletonCount }).map((_, i) => (
                        <div key={`skeleton-initial-${i}`}>
                            {renderSkeleton()}
                        </div>
                    ))}

                {/* Data Items */}
                {status === "success" &&
                    data.length > 0 &&
                    data.map((item, index) => (
                        <div
                            key={getItemKey(item, index) ?? index}
                            ref={
                                index === data.length - 1
                                    ? loaderRef
                                    : undefined
                            }>
                            {renderItem(item, index)}
                        </div>
                    ))}

                {/* Loading More Skeletons */}
                {(hasNextPage || isFetchingNextPage) &&
                    Array.from({ length: loadingSkeletonCount }).map((_, i) => (
                        <div key={`skeleton-loading-${i}`}>
                            {renderSkeleton()}
                        </div>
                    ))}
            </div>

            {/* No More Data */}
            {status === "success" && !hasNextPage && data.length > 0 && (
                <NoMoreData message={noMoreDataMessage} />
            )}
        </div>
    );
};

// Export with proper generic support
export const InfiniteGridList = InfiniteGridListInner as <T>(
    props: InfiniteGridListProps<T>
) => ReturnType<FC<InfiniteGridListProps<T>>>;
