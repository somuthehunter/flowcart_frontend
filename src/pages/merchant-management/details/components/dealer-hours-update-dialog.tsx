import { FC } from "react";
import { Clock, Plus, Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { DealerDetails } from "@/types/response/dealer-response";
import { AppAutocomplete } from "@/components/form/input-elements/app-autocomplete";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
    DealerHoursFormValues,
    useMerchantHoursUpdate,
} from "../hooks/use-merchant-hours-update";

// ── Constants ─────────────────────────────────────────────────────────────────

type DayPrefix = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
type DayConfig = { label: string; prefix: DayPrefix };

const DAYS: DayConfig[] = [
    { label: "Monday", prefix: "mon" },
    { label: "Tuesday", prefix: "tue" },
    { label: "Wednesday", prefix: "wed" },
    { label: "Thursday", prefix: "thu" },
    { label: "Friday", prefix: "fri" },
    { label: "Saturday", prefix: "sat" },
    { label: "Sunday", prefix: "sun" },
];

// ── Inner form component ──────────────────────────────────────────────────────

export const DealerHoursForm: FC<{
    fields: ReturnType<typeof useMerchantHoursUpdate>["businessHours"]["fields"];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onDayToggle: (
        deptIndex: number,
        prefix: DayPrefix,
        checked: boolean
    ) => void;
    timezoneOptions: { label: string; value: string }[];
}> = ({ fields, onAdd, onRemove, onDayToggle, timezoneOptions }) => {
    const { control, watch } = useFormContext<DealerHoursFormValues>();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">
                    {fields.length} department{fields.length !== 1 ? "s" : ""}
                </p>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={onAdd}>
                    <Plus className="h-4 w-4" />
                    Add Department
                </Button>
            </div>

            <div className="space-y-6">
                {fields.length === 0 && (
                    <div className="bg-muted/10 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12">
                        <p className="text-muted-foreground mb-4">
                            No business hours added yet.
                        </p>
                        <Button
                            type="button"
                            onClick={onAdd}
                            variant="outline"
                            className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Department
                        </Button>
                    </div>
                )}

                {fields.map((item, index) => (
                    <Card key={item.id} className="shadow-sm">
                        <div className="bg-muted/50 flex items-center justify-between border-b px-6 py-3">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Clock className="text-primary h-4 w-4" />
                                Department timings
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive h-8 w-8"
                                onClick={() => onRemove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <CardContent className="space-y-6 p-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Department Name */}
                                <FormField
                                    control={control}
                                    name={`departmentBusinessHours.${index}.deptName`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <label className="text-sm font-semibold">
                                                Department Name{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
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

                            {/* Weekly Schedule */}
                            <div className="space-y-4 border-t pt-4">
                                <h4 className="text-foreground text-sm font-semibold">
                                    Weekly Schedule
                                </h4>
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
                                                className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Checkbox
                                                        id={`chk-${index}-${day.prefix}`}
                                                        checked={isOpen}
                                                        onCheckedChange={(
                                                            checked
                                                        ) =>
                                                            onDayToggle(
                                                                index,
                                                                day.prefix,
                                                                !!checked
                                                            )
                                                        }
                                                    />
                                                    <label
                                                        htmlFor={`chk-${index}-${day.prefix}`}
                                                        className="w-24 cursor-pointer text-sm font-medium select-none">
                                                        {day.label}
                                                    </label>
                                                </div>

                                                {isOpen ? (
                                                    <div className="flex items-center gap-2">
                                                        <FormField
                                                            control={control}
                                                            name={`departmentBusinessHours.${index}.${day.prefix}From`}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem className="w-32">
                                                                    <FormControl>
                                                                        <Input
                                                                            type="time"
                                                                            value={
                                                                                field.value ??
                                                                                ""
                                                                            }
                                                                            onChange={
                                                                                field.onChange
                                                                            }
                                                                            className="h-9"
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <span className="text-muted-foreground text-sm">
                                                            to
                                                        </span>
                                                        <FormField
                                                            control={control}
                                                            name={`departmentBusinessHours.${index}.${day.prefix}To`}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem className="w-32">
                                                                    <FormControl>
                                                                        <Input
                                                                            type="time"
                                                                            value={
                                                                                field.value ??
                                                                                ""
                                                                            }
                                                                            onChange={
                                                                                field.onChange
                                                                            }
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
                ))}
            </div>
        </div>
    );
};

// ── Dialog ────────────────────────────────────────────────────────────────────

type DealerHoursUpdateDialogProps = {
    dealer: DealerDetails;
    open: boolean;
    onClose: () => void;
};

const DealerHoursUpdateDialog: FC<DealerHoursUpdateDialogProps> = ({
    dealer,
    open,
    onClose,
}) => {
    const { form, onSubmit, isPending, businessHours, timezoneOptions } =
        useMerchantHoursUpdate(dealer, onClose);

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit Business Hours</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <DealerHoursForm
                            fields={businessHours.fields}
                            onAdd={businessHours.onAdd}
                            onRemove={businessHours.onRemove}
                            onDayToggle={businessHours.onDayToggle}
                            timezoneOptions={timezoneOptions}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default DealerHoursUpdateDialog;
