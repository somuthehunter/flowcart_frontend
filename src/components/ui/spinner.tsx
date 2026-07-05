import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";

const spinnerVariants = cva("animate-spin bg-transparent", {
    variants: {
        color: {
            default: "fill-primary text-gray-200 dark:text-gray-600",
            secondary: "fill-secondary text-gray-600 dark:text-gray-200",
        },
        size: {
            default: "h-4 w-4",
            xs: "h-3 w-3",
            sm: "h-3.5 w-3.5",
            md: "h-4 w-4",
            lg: "h-5 w-5",
            xl: "h-6 w-6",
            icon: "h-6 w-6",
        },
        strokeSize: {
            default: "origin-center",
            sm: "",
        },
    },
    defaultVariants: {
        size: "default",
        strokeSize: "default",
    },
});

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
    className?: string;
}

export const Spinner = ({
    size,
    className,
    strokeSize = "default",
    color,
}: SpinnerProps) => {
    return (
        <Loader2
            className={cn(
                spinnerVariants({ className, size, strokeSize, color })
            )}
        />
    );
};
