import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import {
    Autocomplete,
    type AutocompleteOption,
    type AutocompleteProps,
} from "@/components/ui/autocomplete";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

// ---------------------------------------------------------------------------
// Single-select form wrapper
// ---------------------------------------------------------------------------

interface AppAutocompleteSingleProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<
    Extract<AutocompleteProps, { multiple?: false }>,
    "value" | "onChange" | "multiple"
> {
    control?: Control<TFieldValues>;
    label?: string;
    name: TName;
    multiple?: false;
    className?: string;
}

// ---------------------------------------------------------------------------
// Multiple-select form wrapper
// ---------------------------------------------------------------------------

interface AppAutocompleteMultipleProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<
    Extract<AutocompleteProps, { multiple: true }>,
    "value" | "onChange" | "multiple"
> {
    control?: Control<TFieldValues>;
    label?: string;
    name: TName;
    multiple: true;
    className?: string;
}

type AppAutocompleteProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> =
    | AppAutocompleteSingleProps<TFieldValues, TName>
    | AppAutocompleteMultipleProps<TFieldValues, TName>;

export const AppAutocomplete = forwardRef<
    HTMLInputElement,
    AppAutocompleteProps
>(({ control, label, name, className, multiple, ...rest }) => {
    const formContext = useFormContext();
    const formControl = control || formContext?.control;

    if (!formControl) {
        throw new Error(
            "AppAutocomplete must be used within a Form provider or have control prop passed"
        );
    }

    return (
        <FormField
            control={formControl}
            name={name}
            render={({ field }) => (
                <FormItem className={cn("w-full", className)}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        {multiple ? (
                            <Autocomplete
                                multiple
                                value={
                                    (field.value as AutocompleteOption[]) ?? []
                                }
                                onChange={(val) => field.onChange(val)}
                                {...(rest as Omit<
                                    Extract<
                                        AutocompleteProps,
                                        { multiple: true }
                                    >,
                                    "value" | "onChange" | "multiple"
                                >)}
                            />
                        ) : (
                            <Autocomplete
                                value={
                                    (field.value as AutocompleteOption | null) ??
                                    null
                                }
                                onChange={(val) => field.onChange(val)}
                                {...(rest as Omit<
                                    Extract<
                                        AutocompleteProps,
                                        { multiple?: false }
                                    >,
                                    "value" | "onChange" | "multiple"
                                >)}
                            />
                        )}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}) as <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
    props: AppAutocompleteProps<TFieldValues, TName> &
        React.RefAttributes<HTMLInputElement>
) => React.ReactElement;

(AppAutocomplete as React.FC).displayName = "AppAutocomplete";
