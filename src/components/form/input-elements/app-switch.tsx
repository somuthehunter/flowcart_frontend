import React, { forwardRef } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

interface AppSwitchProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<
    React.ComponentProps<typeof Switch>,
    "name" | "checked" | "onCheckedChange"
> {
    control: Control<TFieldValues>;
    label?: string;
    name: TName;
    description?: string;
    onCheckedChange?: (checked: boolean) => void;
}

export const AppSwitch = forwardRef<
    React.ElementRef<typeof Switch>,
    AppSwitchProps
>(({ control, label, name, description, onCheckedChange, ...props }, ref) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel className="text-base">{label}</FormLabel>
                        {description && (
                            <p className="text-muted-foreground text-sm">
                                {description}
                            </p>
                        )}
                        <FormMessage />
                    </div>
                    <FormControl>
                        <Switch
                            ref={ref}
                            checked={field.value}
                            onCheckedChange={(checked) => {
                                field.onChange(checked);
                                onCheckedChange?.(checked);
                            }}
                            {...props}
                        />
                    </FormControl>
                </FormItem>
            )}
        />
    );
});

AppSwitch.displayName = "AppSwitch";
