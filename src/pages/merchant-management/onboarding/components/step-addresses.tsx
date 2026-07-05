import { UseFieldArrayReturn, useFormContext } from "react-hook-form";
import { Home, MapPin, Plus, Trash2 } from "lucide-react";

import { AddressType } from "@/types/response/dealer-response";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { DealerOnboardingFormValues } from "../hooks/use-merchant-onboarding";

type StepAddressesProps = {
    fields: UseFieldArrayReturn<DealerOnboardingFormValues, "addresses">["fields"];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onSetPrimary: (index: number) => void;
    onCopyToAll: (index: number) => void;
    addressTypeOptions: { label: string; value: number }[];
};

export default function StepAddresses({
    fields,
    onAdd,
    onRemove,
    onSetPrimary,
    onCopyToAll,
    addressTypeOptions,
}: StepAddressesProps) {
    const { control, watch } = useFormContext<DealerOnboardingFormValues>();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                    Step 2 of 5:{" "}
                    <span className="text-foreground font-medium">Addresses</span>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={onAdd}
                >
                    <Plus className="h-4 w-4" />
                    Add Address
                </Button>
            </div>

            {/* Error Message for Addresses Validation */}
            <FormField
                control={control}
                name="addresses"
                render={() => (
                    <FormItem>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="space-y-6">
                {fields.map((item, index) => (
                    <Card key={item.id} className="relative overflow-hidden shadow-sm">
                        {/* Header banner */}
                        <div className="bg-muted/50 border-b px-6 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <MapPin className="text-primary h-4 w-4" />
                                Address #{index + 1}
                                {watch(`addresses.${index}.isPrimary`) && (
                                    <span className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                                        <Home className="h-3 w-3" />
                                        Primary
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {fields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs"
                                        onClick={() => onCopyToAll(index)}
                                    >
                                        Copy to all
                                    </Button>
                                )}
                                {fields.length > 1 && 
                                    watch(`addresses.${index}.addressType`) !== AddressType.Legal &&
                                    watch(`addresses.${index}.addressType`) !== AddressType.Billing && (
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
                        </div>

                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {/* Address Type */}
                                <FormField
                                    control={control}
                                    name={`addresses.${index}.addressType`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <label className="text-sm font-semibold">Address Type</label>
                                            <Select
                                                value={field.value.toString()}
                                                disabled={
                                                    field.value === AddressType.Legal ||
                                                    field.value === AddressType.Billing
                                                }
                                                onValueChange={(val) => field.onChange(Number(val))}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {addressTypeOptions.map((opt) => (
                                                        <SelectItem
                                                            key={opt.value}
                                                            value={opt.value.toString()}
                                                        >
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Address Line */}
                                <FormField
                                    control={control}
                                    name={`addresses.${index}.addressLine`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5 md:col-span-2">
                                            <label className="text-sm font-semibold">
                                                Address Line <span className="text-destructive">*</span>
                                            </label>
                                            <FormControl>
                                                <Input
                                                    placeholder="Street Name, Suite/Apartment number"
                                                    value={field.value ?? ""}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* State */}
                                <FormField
                                    control={control}
                                    name={`addresses.${index}.state`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <label className="text-sm font-semibold">
                                                State <span className="text-destructive">*</span>
                                            </label>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. Maharashtra"
                                                    value={field.value ?? ""}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Zip Code */}
                                <FormField
                                    control={control}
                                    name={`addresses.${index}.zipcode`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <label className="text-sm font-semibold">
                                                Zip/Postal Code <span className="text-destructive">*</span>
                                            </label>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. 400001"
                                                    value={field.value ?? ""}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Country */}
                                <FormField
                                    control={control}
                                    name={`addresses.${index}.country`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <label className="text-sm font-semibold">
                                                Country <span className="text-destructive">*</span>
                                            </label>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. India"
                                                    value={field.value ?? ""}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />



                                {/* Radius */}
                                <FormField
                                    control={control}
                                    name={`addresses.${index}.radius`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <label className="text-sm font-semibold">Radius (km)</label>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g. 10"
                                                    value={field.value ?? ""}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Set Primary Toggle */}
                            <FormField
                                control={control}
                                name={`addresses.${index}.isPrimary`}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-muted/20">
                                        <div className="space-y-0.5">
                                            <label className="text-sm font-semibold">Primary Address</label>
                                            <p className="text-muted-foreground text-xs">
                                                Mark this as the main contact address for notifications and operations
                                            </p>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        onSetPrimary(index);
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
