import React from "react";
import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";

interface ScrollableProps {
    children: React.ReactNode;
    className?: string;
    direction?: {
        parent?: "ltr" | "rtl";
        child?: "ltr" | "rtl";
    };
}

const Scrollable: React.FC<ScrollableProps> = ({
    children,
    className,
    direction,
}) => {
    return (
        <ScrollArea
            className={cn("h-full", className)}
            style={{
                direction: direction?.parent || "ltr",
            }}>
            <div style={{ direction: direction?.child || "ltr" }}>
                {children}
            </div>
        </ScrollArea>
    );
};

export default Scrollable;
