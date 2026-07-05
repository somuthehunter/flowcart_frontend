import React, { forwardRef } from "react";
import {
    useFormContext,
    type Control,
    type FieldPath,
    type FieldValues,
} from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface AppSelectProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
    control?: Control<TFieldValues>;
    label?: string;
    name: TName;
    placeholder?: string;
    options: SelectOption[];
    disabled?: boolean;
    onValueChange?: (value: string) => void;
}

export const AppSelect = forwardRef<HTMLButtonElement, AppSelectProps>(
    (
        {
            control,
            label,
            name,
            placeholder,
            options,
            disabled,
            onValueChange,
            ...props
        },
        ref
    ) => {
        const formContext = useFormContext();
        const formControl = control || formContext?.control;

        if (!formControl) {
            throw new Error(
                "AppInput must be used within a Form provider or have control prop passed"
            );
        }

        return (
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <Select
                            onValueChange={(value) => {
                                field.onChange(value);
                                onValueChange?.(value);
                            }}
                            defaultValue={field.value}
                            disabled={disabled}>
                            <FormControl>
                                <SelectTrigger ref={ref} {...props}>
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {options.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                        disabled={option.disabled}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    }
);

AppSelect.displayName = "AppSelect";
