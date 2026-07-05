import { useCallback, useEffect, useRef, useState } from "react";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface DataTableCellContentProps {
    children: React.ReactNode;
    maxLines?: number;
}

export function DataTableCellContent({
    children,
    maxLines = 1,
}: DataTableCellContentProps) {
    const textRef = useRef<HTMLDivElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    const checkTruncation = useCallback(() => {
        const el = textRef.current;
        if (el) {
            const lineHeight =
                parseFloat(getComputedStyle(el).lineHeight) || 20;
            const maxHeight = lineHeight * maxLines;
            setIsTruncated(el.scrollHeight > maxHeight + lineHeight * 0.5);
        }
    }, [maxLines]);

    useEffect(() => {
        checkTruncation();
    }, [children, checkTruncation]);

    const lineClampClass =
        {
            1: "line-clamp-1",
            2: "line-clamp-2",
            3: "line-clamp-3",
        }[maxLines] || "line-clamp-2";

    const content = (
        <div ref={textRef} className={lineClampClass}>
            {children}
        </div>
    );

    if (!isTruncated) return content;

    return (
        <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent
                side="bottom"
                align="start"
                className="bg-popover text-popover-foreground max-w-sm border p-3 text-sm wrap-break-word shadow-md">
                {children}
            </TooltipContent>
        </Tooltip>
    );
}
