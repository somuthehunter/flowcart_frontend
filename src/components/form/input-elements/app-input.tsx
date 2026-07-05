import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AppInputProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.ComponentProps<typeof Input>, "name"> {
    control?: Control<TFieldValues>;
    label?: string;
    name: TName;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(
    (
        { control, label, name, leftIcon, rightIcon, className, ...props },
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
                control={formControl}
                name={name}
                render={({ field }) => (
                    <FormItem 
                        className={cn(
                            "w-full [&_input::-ms-reveal]:hidden [&_input::-webkit-reveal]:hidden", 
                            className
                        )}
                    >
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            {leftIcon || rightIcon ? (
                                <div className="relative">
                                    {leftIcon && (
                                        <div className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
                                            {leftIcon}
                                        </div>
                                    )}
                                    <Input
                                        {...props}
                                        {...field}
                                        ref={ref}
                                        className={cn(
                                            leftIcon && "pl-10",
                                            rightIcon && "pr-10"
                                        )}
                                    />
                                    {rightIcon && (
                                        <div className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2">
                                            {rightIcon}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Input
                                    {...props}
                                    {...field}
                                    ref={ref}
                                    // className={className}
                                />
                            )}
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    }
);

AppInput.displayName = "AppInput";
