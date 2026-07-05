import { FC, useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { cn } from "../../lib/utils";
import { Separator } from "./separator";

interface NoMoreDataProps {
    message?: string;
    className?: string;
    requireScroll?: boolean;
}

export const NoMoreData: FC<NoMoreDataProps> = ({
    message = "You've reached the end",
    className = "",
    requireScroll = true,
}) => {
    const [shouldShow, setShouldShow] = useState(!requireScroll);

    useEffect(() => {
        if (!requireScroll) {
            setShouldShow(true);
            return;
        }

        const checkHeight = () => {
            const contentHeight = document.documentElement.scrollHeight;
            const viewportHeight = window.innerHeight;
            setShouldShow(contentHeight > viewportHeight + 50);
        };

        checkHeight();
        window.addEventListener("resize", checkHeight);
        return () => window.removeEventListener("resize", checkHeight);
    }, [requireScroll]);

    if (!shouldShow) return null;

    return (
        <div className={cn("py-8", className)}>
            <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <div className="flex items-center gap-3 rounded-full bg-muted/50 px-4 py-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground/70" />
                    <span className="text-xs text-muted-foreground">
                        {message}
                    </span>
                </div>
                <Separator className="flex-1" />
            </div>
        </div>
    );
};
