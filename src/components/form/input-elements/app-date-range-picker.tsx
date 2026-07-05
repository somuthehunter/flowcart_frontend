import React, { forwardRef } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import {
    DateRangePicker,
    type DateRange,
    type DateRangePickerProps,
} from "@/components/ui/date-range-picker";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

interface AppDateRangePickerProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<DateRangePickerProps, "onUpdate" | "initialDateRange"> {
    control: Control<TFieldValues>;
    label?: string;
    name: TName;
    onUpdate?: (range: DateRange) => void;
}

export const AppDateRangePicker = forwardRef<
    HTMLButtonElement,
    AppDateRangePickerProps
>(({ control, label, name, onUpdate, ...props }, ref) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <DateRangePicker
                            initialDateRange={field.value}
                            onUpdate={({ range }) => {
                                field.onChange(range);
                                onUpdate?.(range);
                            }}
                            {...props}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
});

AppDateRangePicker.displayName = "AppDateRangePicker";
