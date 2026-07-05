import { FC } from "react";

import { cn } from "../../lib/utils";
import { Badge } from "./badge";

interface InfiniteScrollCountProps {
    currentCount: number;
    totalCount: number;
    label?: string;
    className?: string;
}

export const InfiniteScrollCount: FC<InfiniteScrollCountProps> = ({
    currentCount,
    totalCount,
    label = "results",
    className = "",
}) => {
    if (currentCount === 0) return null;

    return (
        <div
            className={cn(
                "bg-card flex items-center justify-between rounded-lg border p-4 shadow-sm",
                className
            )}>
            <div className="text-muted-foreground text-sm">
                Showing{" "}
                <span className="text-foreground font-semibold">
                    {currentCount}
                </span>{" "}
                of{" "}
                <span className="text-foreground font-semibold">
                    {totalCount}
                </span>{" "}
                {label}
            </div>
            <Badge className="font-semibold">Total: {totalCount}</Badge>
        </div>
    );
};
