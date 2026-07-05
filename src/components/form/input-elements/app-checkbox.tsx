import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

interface AppCheckboxProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<
    React.ComponentProps<typeof Checkbox>,
    "name" | "checked" | "onCheckedChange"
> {
    control?: Control<TFieldValues>;
    label?: string;
    name: TName;
    description?: string;
    onCheckedChange?: (checked: boolean) => void;
}

export const AppCheckbox = forwardRef<
    React.ElementRef<typeof Checkbox>,
    AppCheckboxProps
>(
    (
        {
            control,
            label,
            name,
            description,
            onCheckedChange,
            className,
            ...props
        },
        ref
    ) => {
        const formContext = useFormContext();
        const formControl = control || formContext?.control;

        if (!formControl) {
            throw new Error(
                "AppCheckbox must be used within a Form provider or have control prop passed"
            );
        }

        return (
            <FormField
                control={formControl}
                name={name}
                render={({ field }) => (
                    <FormItem
                        className={cn(
                            "flex flex-row items-start space-y-0 space-x-1",
                            className
                        )}>
                        <FormControl>
                            <Checkbox
                                ref={ref}
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                    field.onChange(checked);
                                    onCheckedChange?.(checked as boolean);
                                }}
                                {...props}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                                {label}
                            </FormLabel>
                            {description && (
                                <p className="text-muted-foreground text-sm">
                                    {description}
                                </p>
                            )}
                            <FormMessage />
                        </div>
                    </FormItem>
                )}
            />
        );
    }
);

AppCheckbox.displayName = "AppCheckbox";
