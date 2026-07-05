import { UseFieldArrayReturn, useFormContext } from "react-hook-form";
import { Clock, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AppAutocomplete } from "@/components/form/input-elements/app-autocomplete";

import { DealerOnboardingFormValues } from "../hooks/use-merchant-onboarding";

type DayConfig = {
    label: string;
    prefix: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
};

const DAYS: DayConfig[] = [
    { label: "Monday", prefix: "mon" },
    { label: "Tuesday", prefix: "tue" },
    { label: "Wednesday", prefix: "wed" },
    { label: "Thursday", prefix: "thu" },
    { label: "Friday", prefix: "fri" },
    { label: "Saturday", prefix: "sat" },
    { label: "Sunday", prefix: "sun" },
];

type StepHoursProps = {
    fields: UseFieldArrayReturn<DealerOnboardingFormValues, "departmentBusinessHours">["fields"];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onDayToggle: (
        deptIndex: number,
        prefix: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun",
        checked: boolean
    ) => void;
    timezoneOptions: { label: string; value: string }[];
};

export default function StepHours({
    fields,
    onAdd,
    onRemove,
    onDayToggle,
    timezoneOptions,
}: StepHoursProps) {
    const { control, watch } =
        useFormContext<DealerOnboardingFormValues>();


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                    Step 4 of 5:{" "}
                    <span className="text-foreground font-medium">Business Hours</span>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={onAdd}
                >
                    <Plus className="h-4 w-4" />
                    Add Department
                </Button>
            </div>

            <div className="space-y-6">
                {fields.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/10">
                        <p className="text-muted-foreground mb-4">No business hours added yet.</p>
                        <Button type="button" onClick={onAdd} variant="outline" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Department
                        </Button>
                    </div>
                )}
                {fields.map((item, index) => {
                    return (
                        <Card key={item.id} className="shadow-sm">
                            <div className="bg-muted/50 border-b px-6 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-semibold">
                                    <Clock className="text-primary h-4 w-4" />
                                    Department timings
                                </div>
                                {fields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive h-8 w-8"
                                        onClick={() => onRemove(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Department Name */}
                                    <FormField
                                        control={control}
                                        name={`departmentBusinessHours.${index}.deptName`}
                                        render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <label className="text-sm font-semibold">
                                                    Department Name <span className="text-destructive">*</span>
                                                </label>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Sales, Service, Parts"
                                                        value={field.value ?? ""}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Timezone */}
                                    <AppAutocomplete
                                        control={control}
                                        name={`departmentBusinessHours.${index}.timeZone`}
                                        label="Time Zone"
                                        options={timezoneOptions}
                                        placeholder="Select timezone..."
                                    />
                                </div>

                                {/* Timings Checklist Grid */}
                                <div className="space-y-4 pt-4 border-t">
                                    <h4 className="text-sm font-semibold text-foreground">Weekly Schedule</h4>
                                    <div className="divide-y rounded-lg border">
                                        {DAYS.map((day) => {
                                            const fromVal = watch(
                                                `departmentBusinessHours.${index}.${day.prefix}From`
                                            );
                                            const toVal = watch(
                                                `departmentBusinessHours.${index}.${day.prefix}To`
                                            );
                                            const isOpen = !!(fromVal || toVal);

                                            return (
                                                <div
                                                    key={day.prefix}
                                                    className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between"
                                                >
                                                    {/* Day label / switch */}
                                                    <div className="flex items-center gap-3">
                                                        <Checkbox
                                                            id={`chk-${index}-${day.prefix}`}
                                                            checked={isOpen}
                                                            onCheckedChange={(checked) =>
                                                                onDayToggle(
                                                                    index,
                                                                    day.prefix,
                                                                    !!checked
                                                                )
                                                            }
                                                        />
                                                        <label
                                                            htmlFor={`chk-${index}-${day.prefix}`}
                                                            className="text-sm font-medium select-none cursor-pointer w-24"
                                                        >
                                                            {day.label}
                                                        </label>
                                                    </div>

                                                    {/* Time fields */}
                                                    {isOpen ? (
                                                        <div className="flex items-center gap-2">
                                                            <FormField
                                                                control={control}
                                                                name={`departmentBusinessHours.${index}.${day.prefix}From`}
                                                                render={({ field }) => (
                                                                    <FormItem className="w-32">
                                                                        <FormControl>
                                                                            <Input
                                                                                type="time"
                                                                                value={field.value ?? ""}
                                                                                onChange={field.onChange}
                                                                                className="h-9"
                                                                            />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <span className="text-muted-foreground text-sm">to</span>
                                                            <FormField
                                                                control={control}
                                                                name={`departmentBusinessHours.${index}.${day.prefix}To`}
                                                                render={({ field }) => (
                                                                    <FormItem className="w-32">
                                                                        <FormControl>
                                                                            <Input
                                                                                type="time"
                                                                                value={field.value ?? ""}
                                                                                onChange={field.onChange}
                                                                                className="h-9"
                                                                            />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm italic">
                                                            Closed
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
