import React from "react";
import { cn } from "@/lib/utils";

import { Spinner, SpinnerProps } from "../ui/spinner";

export default function SpinnerWithLabel({
    size,
    ...rest
}: SpinnerProps & { value: number }) {
    return (
        <div className="relative inline-flex">
            <Spinner size={size} {...rest} />
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    className={cn(
                        "text-sm leading-none font-medium"
                    )}>{`${Math.round(rest.value)}%`}</div>
            </div>
        </div>
    );
}
