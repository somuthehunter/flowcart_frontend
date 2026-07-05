import { cn } from "@/lib/utils";

import { TypographyProps } from "./typography";

export function TypographyH2({ children, className }: TypographyProps) {
    return (
        <h2
            className={cn(
                "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0",
                className
            )}>
            {children}
        </h2>
    );
}
