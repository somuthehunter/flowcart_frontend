import { Plus, Trash2, User, UserCheck } from "lucide-react";
import { UseFieldArrayReturn, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { DealerOnboardingFormValues } from "../hooks/use-merchant-onboarding";

type StepContactsProps = {
    fields: UseFieldArrayReturn<
        DealerOnboardingFormValues,
        "contactPersons"
    >["fields"];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onSetUser: (index: number) => void;
};

export default function StepContacts({
    fields,
    onAdd,
    onRemove,
    onSetUser,
}: StepContactsProps) {
    const { control, getValues } = useFormContext<DealerOnboardingFormValues>();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                    Step 3 of 5:{" "}
                    <span className="text-foreground font-medium">
                        Contact Persons
                    </span>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={onAdd}>
                    <Plus className="h-4 w-4" />
                    Add Contact
                </Button>
            </div>

            {/* Error Message for Contacts Validation */}
            <FormField
                control={control}
                name="contactPersons"
                render={() => (
                    <FormItem>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="space-y-6">
                {fields.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/10">
                        <p className="text-muted-foreground mb-4">No contact persons added yet.</p>
                        <Button type="button" onClick={onAdd} variant="outline" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Contact
                        </Button>
                    </div>
                )}
                {fields.map((item, index) => (
                    <Card
                        key={item.id}
                        className="relative overflow-hidden shadow-sm">
                        {/* Header Banner */}
                        <div className="bg-muted/50 flex items-center justify-between border-b px-6 py-3">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <User className="text-primary h-4 w-4" />
                                Contact Person #{index + 1}
                                {getValues(
                                    `contactPersons.${index}.isUser`
                                ) && (
                                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                        <UserCheck className="h-3 w-3" />
                                        Primary User
                                    </span>
                                )}
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
                                {/* First Name */}
                                <FormField
                                    control={control}
                                    name={`contactPersons.${index}.firstName`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <label className="text-sm font-semibold">
                                                First Name{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </label>
                                            <FormControl>
                                                <Input
                                                    placeholder="John"
                                                    value={field.value ?? ""}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Last Name */}
                                <FormField
                                    control={control}
                                    name={`contactPersons.${index}.lastName`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <label className="text-sm font-semibold">
                                                Last Name{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </label>
                                            <FormControl>
                                                <Input
                                                    placeholder="Doe"
                                                    value={field.value ?? ""}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Email */}
                                <FormField
                                    control={control}
                                    name={`contactPersons.${index}.email`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <label className="text-sm font-semibold">
                                                Email{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </label>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="john.doe@example.com"
                                                    value={field.value ?? ""}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Phone */}
                                <FormField
                                    control={control}
                                    name={`contactPersons.${index}.phone`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <label className="text-sm font-semibold">
                                                Phone{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </label>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. 1234567890"
                                                    value={field.value ?? ""}
                                                    maxLength={10}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, "");
                                                        field.onChange(val);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Designation */}
                                <FormField
                                    control={control}
                                    name={`contactPersons.${index}.designation`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5 md:col-span-2">
                                            <label className="text-sm font-semibold">
                                                Designation
                                            </label>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. Sales Manager, General Manager"
                                                    value={field.value ?? ""}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Set Login User Toggle */}
                            <FormField
                                control={control}
                                name={`contactPersons.${index}.isUser`}
                                render={({ field }) => (
                                    <FormItem className="bg-muted/20 flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                        <div className="space-y-0.5">
                                            <label className="text-sm font-semibold">
                                                Primary Login User
                                            </label>
                                            <p className="text-muted-foreground text-xs">
                                                Grant portal login access to
                                                this contact person
                                            </p>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        onSetUser(index);
                                                    } else {
                                                        field.onChange(false);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
