import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RadioOption {
    value: string;
    label: string;
    disabled?: boolean;
    description?: string;
}

interface AppRadioGroupProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<
    React.ComponentProps<typeof RadioGroup>,
    "name" | "value" | "onValueChange"
> {
    control: Control<TFieldValues>;
    label?: string;
    name: TName;
    options: RadioOption[];
    orientation?: "vertical" | "horizontal";
    onValueChange?: (value: string) => void;
}

export const AppRadioGroup = forwardRef<
    React.ElementRef<typeof RadioGroup>,
    AppRadioGroupProps
>(
    (
        {
            control,
            label,
            name,
            options,
            orientation = "vertical",
            onValueChange,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem className={cn("space-y-3", className)}>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <RadioGroup
                                ref={ref}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    onValueChange?.(value);
                                }}
                                defaultValue={field.value}
                                className={
                                    orientation === "horizontal"
                                        ? "flex flex-row gap-6"
                                        : "grid gap-2"
                                }
                                {...props}>
                                {options.map((option) => (
                                    <div
                                        key={option.value}
                                        className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value={option.value}
                                            id={`${name}-${option.value}`}
                                            disabled={option.disabled}
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label
                                                htmlFor={`${name}-${option.value}`}
                                                className="cursor-pointer text-sm font-normal">
                                                {option.label}
                                            </Label>
                                            {option.description && (
                                                <p className="text-muted-foreground text-xs">
                                                    {option.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    }
);

AppRadioGroup.displayName = "AppRadioGroup";
