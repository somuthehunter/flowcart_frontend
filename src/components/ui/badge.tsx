import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

const badgeVariants = cva(
    "inline-flex items-center justify-center gap-1 whitespace-nowrap shrink-0 w-fit min-w-fit rounded-md border px-2 py-0.5 text-xs font-medium transition-[color,box-shadow] [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",

    {
        variants: {
            variant: {
                solid: "border-transparent",
                flat: "border-transparent",
                bordered: "",
                light: "border-transparent bg-transparent",
            },

            color: {
                default: "",
                primary: "",
                secondary: "",
                success: "",
                warning: "",
                destructive: "",
            },

            size: {
                sm: "text-xs px-2 py-0.5",
                md: "text-sm px-2.5 py-0.5",
                lg: "text-sm px-3 py-1",
            },

            radius: {
                sm: "rounded-sm",
                md: "rounded-md",
                lg: "rounded-lg",
                full: "rounded-full",
            },
        },

        compoundVariants: [
            /* ---------- SOLID ---------- */
            {
                variant: "solid",
                color: "default",
                className: "bg-primary text-primary-foreground",
            },
            {
                variant: "solid",
                color: "secondary",
                className: "bg-secondary text-secondary-foreground",
            },
            {
                variant: "solid",
                color: "success",
                className: "bg-emerald-600 text-white",
            },
            {
                variant: "solid",
                color: "warning",
                className: "bg-amber-500 text-white",
            },
            {
                variant: "solid",
                color: "destructive",
                className: "bg-destructive text-white",
            },

            /* ---------- FLAT ---------- */
            {
                variant: "flat",
                color: "default",
                className: "bg-muted text-muted-foreground",
            },
            {
                variant: "flat",
                color: "primary",
                className: "bg-primary/15 text-primary",
            },
            {
                variant: "flat",
                color: "secondary",
                className: "bg-secondary/15 text-secondary",
            },
            {
                variant: "flat",
                color: "success",
                className: "bg-emerald-500/15 text-emerald-600",
            },
            {
                variant: "flat",
                color: "warning",
                className: "bg-amber-500/15 text-amber-600",
            },
            {
                variant: "flat",
                color: "destructive",
                className: "bg-destructive/15 text-destructive",
            },

            /* ---------- BORDERED ---------- */
            {
                variant: "bordered",
                color: "default",
                className: "border-muted text-muted-foreground",
            },
            {
                variant: "bordered",
                color: "primary",
                className: "border-primary text-primary",
            },
            {
                variant: "bordered",
                color: "secondary",
                className: "border-secondary text-secondary",
            },
            {
                variant: "bordered",
                color: "success",
                className: "border-emerald-500 text-emerald-600",
            },
            {
                variant: "bordered",
                color: "warning",
                className: "border-amber-500 text-amber-600",
            },
            {
                variant: "bordered",
                color: "destructive",
                className: "border-destructive text-destructive",
            },

            /* ---------- LIGHT ---------- */
            {
                variant: "light",
                color: "default",
                className: "text-muted-foreground",
            },
            {
                variant: "light",
                color: "primary",
                className: "text-primary",
            },
            {
                variant: "light",
                color: "secondary",
                className: "text-secondary",
            },
            {
                variant: "light",
                color: "success",
                className: "text-emerald-600",
            },
            {
                variant: "light",
                color: "warning",
                className: "text-amber-600",
            },
            {
                variant: "light",
                color: "destructive",
                className: "text-destructive",
            },
        ],

        defaultVariants: {
            variant: "solid",
            color: "default",
            size: "md",
            radius: "md",
        },
    }
);

function Badge({
    className,
    variant,
    color,
    size,
    radius,
    asChild = false,
    startContent,
    endContent,
    onClose,
    children,
    ...props
}: React.ComponentProps<"span"> &
    VariantProps<typeof badgeVariants> & {
        asChild?: boolean;
        startContent?: React.ReactNode;
        endContent?: React.ReactNode;
        onClose?: () => void;
    }) {
    const Comp = asChild ? Slot : "span";

    return (
        <Comp
            data-slot="badge"
            className={cn(
                badgeVariants({ variant, color, size, radius }),
                onClose && "pr-1",
                className
            )}
            {...props}>
            {startContent && (
                <span className="flex items-center">{startContent}</span>
            )}

            <span>{children}</span>

            {endContent && !onClose && (
                <span className="flex items-center">{endContent}</span>
            )}

            {onClose && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="focus:ring-ring ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10 focus:ring-2 focus:outline-none">
                    <X className="h-3 w-3" />
                </button>
            )}
        </Comp>
    );
}

export { Badge };
