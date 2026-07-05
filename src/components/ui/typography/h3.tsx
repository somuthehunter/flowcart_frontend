import { cn } from "@/lib/utils";

import { TypographyProps } from "./typography";

export function TypographyH3({ children, className }: TypographyProps) {
    return (
        <h3
            className={cn(
                "scroll-m-20 text-2xl font-semibold tracking-tight",
                className
            )}>
            {children}
        </h3>
    );
}
