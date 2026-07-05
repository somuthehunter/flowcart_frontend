import { cn } from "@/lib/utils";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

import {
    PhoneNumberInput,
    PhoneNumberInputProps,
} from "@/components/ui/phone-number-input";

export interface AppPhoneNumberInputProps<T extends FieldValues> extends Omit<
    PhoneNumberInputProps,
    "value" | "onChange" | "onBlur" | "error" | "errorMessage"
> {
    name: Path<T>;
    label?: string;
    description?: string;
    required?: boolean;
    className?: string;
    labelClassName?: string;
}

export function AppPhoneNumberInput<T extends FieldValues>({
    name,
    label,
    description,
    required = false,
    className,
    labelClassName,
    ...props
}: AppPhoneNumberInputProps<T>) {
    const { getFieldState, formState, control } = useFormContext<T>();
    const { error } = getFieldState(name, formState);

    const hasError = !!error;
    const errorMessage = error?.message;

    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <label
                    htmlFor={name}
                    className={cn(
                        "text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        labelClassName
                    )}>
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            {description && (
                <p className="text-muted-foreground text-sm">{description}</p>
            )}

            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <PhoneNumberInput
                        {...props}
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={hasError}
                        errorMessage={errorMessage}
                    />
                )}
            />
        </div>
    );
}
