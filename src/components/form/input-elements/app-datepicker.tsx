import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface AppDatePickerProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
    control: Control<TFieldValues>;
    label?: string;
    name: TName;
    placeholder?: string;
    dateFormat?: string;
    disabled?: boolean;
    onSelect?: (date: Date | undefined) => void;
    fromDate?: Date;
    toDate?: Date;
    className?: string;
}

export const AppDatePicker = forwardRef<HTMLButtonElement, AppDatePickerProps>(
    (
        {
            control,
            label,
            name,
            placeholder = "Pick a date",
            dateFormat = "PPP",
            disabled,
            onSelect,
            fromDate,
            toDate,
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
                    <FormItem className="flex flex-col">
                        <FormLabel>{label}</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        ref={ref}
                                        variant="outline"
                                        disabled={disabled}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !field.value &&
                                                "text-muted-foreground",
                                            className
                                        )}
                                        {...props}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? (
                                            format(field.value, dateFormat)
                                        ) : (
                                            <span>{placeholder}</span>
                                        )}
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(date) => {
                                        field.onChange(date);
                                        onSelect?.(date);
                                    }}
                                    disabled={(date) => {
                                        if (disabled) return true;
                                        if (fromDate && date < fromDate)
                                            return true;
                                        if (toDate && date > toDate)
                                            return true;
                                        return false;
                                    }}
                                    autoFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    }
);

AppDatePicker.displayName = "AppDatePicker";
