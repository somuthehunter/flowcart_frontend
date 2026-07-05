import * as React from "react";
import { cn } from "@/lib/utils";

import { Spinner, SpinnerProps } from "../ui/spinner";
import SpinnerWithLabel from "./spinner-with-label";

export interface LoadingProps {
    grow?: boolean;
    className?: string;
    size?: number | string;
    title?: string;
    subTitle?: string;
    value?: number;
    variant?: "indeterminate" | "determinate";
}

const Loading: React.FC<LoadingProps & SpinnerProps> = ({
    className,
    grow = false,
    title,
    subTitle,
    value,
    variant = "indeterminate",
    ...props
}) => {
    return grow ? (
        <div className={cn("flex h-full w-full grow flex-row", className)}>
            <div className="flex grow flex-col items-center justify-center">
                {variant === "determinate" && value ? (
                    <SpinnerWithLabel value={value} {...props} />
                ) : (
                    <Spinner {...props} />
                )}
                {!!title && (
                    <span className="mt-2 text-lg font-bold">{title}</span>
                )}
                {!!subTitle && <span className="mt-1 text-sm">{subTitle}</span>}
            </div>
        </div>
    ) : variant === "determinate" && value ? (
        <SpinnerWithLabel className={className} value={value} {...props} />
    ) : (
        <Spinner className={className} {...props} />
    );
};

export default Loading;
