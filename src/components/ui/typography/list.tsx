import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const listVariants = cva("my-6 ml-6 [&>li]:mt-2", {
    variants: {
        variant: {
            unordered: "list-disc",
            ordered: "list-decimal",
        },
    },
    defaultVariants: {
        variant: "unordered",
    },
});

type ListProps = React.ComponentPropsWithoutRef<"ul"> &
    VariantProps<typeof listVariants>;

export function List({ variant, className, children, ...props }: ListProps) {
    const Tag = variant === "ordered" ? "ol" : "ul";
    return (
        <Tag className={cn(listVariants({ variant }), className)} {...props}>
            {children}
        </Tag>
    );
}

export const ListItem = React.forwardRef<
    HTMLLIElement,
    React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
    <li ref={ref} className={className} {...props} />
));
ListItem.displayName = "ListItem";

// Optional: keep old name as thin wrapper for compatibility
export function TypographyList(props: ListProps) {
    return <List {...props} />;
}
