import { FC } from "react";
import { Home, MapPin, Plus, Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { AddressType, DealerDetails } from "@/types/response/dealer-response";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import {
    DealerAddressesFormValues,
    useMerchantAddressesUpdate,
} from "../hooks/use-merchant-addresses-update";

// ── Inner form component (uses useFormContext) ────────────────────────────────

type AddressesFormProps = {
    fields: ReturnType<typeof useMerchantAddressesUpdate>["addresses"]["fields"];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onSetPrimary: (index: number) => void;
    onCopyToAll: (index: number) => void;
    addressTypeOptions: { label: string; value: AddressType }[];
};

export const DealerAddressesForm: FC<AddressesFormProps> = ({
    fields,
    onAdd,
    onRemove,
    onSetPrimary,
    onCopyToAll,
    addressTypeOptions,
}) => {
    const { control, watch } = useFormContext<DealerAddressesFormValues>();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">
                    {fields.length} address{fields.length !== 1 ? "es" : ""}{" "}
                    registered
                </p>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={onAdd}>
                    <Plus className="h-4 w-4" />
                    Add Address
                </Button>
            </div>

            {/* Array-level validation message */}
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
                        <div className="bg-muted/50 flex items-center justify-between border-b px-6 py-3">
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
                                        onClick={() => onCopyToAll(index)}>
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
                                        onClick={() => onRemove(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        <CardContent className="space-y-6 p-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {/* Address Type */}
                                <FormField
                                    control={control}
                                    name={`addresses.${index}.addressType`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <label className="text-sm font-semibold">
                                                Address Type
                                            </label>
                                            <Select
                                                value={field.value.toString()}
                                                disabled={
                                                    field.value === AddressType.Legal ||
                                                    field.value === AddressType.Billing
                                                }
                                                onValueChange={(val) =>
                                                    field.onChange(Number(val))
                                                }>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {addressTypeOptions.map(
                                                        (opt) => (
                                                            <SelectItem
                                                                key={opt.value}
                                                                value={opt.value.toString()}>
                                                                {opt.label}
                                                            </SelectItem>
                                                        )
                                                    )}
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
                                                Address Line{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
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
                                                State{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </label>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. California"
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
                                                Zip/Postal Code{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </label>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. 90001"
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
                                                Country{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </label>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. United States"
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
                                            <label className="text-sm font-semibold">
                                                Radius (km)
                                            </label>
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

                            {/* Primary toggle */}
                            <FormField
                                control={control}
                                name={`addresses.${index}.isPrimary`}
                                render={({ field }) => (
                                    <FormItem className="bg-muted/20 flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                        <div className="space-y-0.5">
                                            <label className="text-sm font-semibold">
                                                Primary Address
                                            </label>
                                            <p className="text-muted-foreground text-xs">
                                                Mark as the main contact address
                                            </p>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    if (checked)
                                                        onSetPrimary(index);
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
};

// ── Dialog ────────────────────────────────────────────────────────────────────

type DealerAddressesUpdateDialogProps = {
    dealer: DealerDetails;
    open: boolean;
    onClose: () => void;
};

const DealerAddressesUpdateDialog: FC<DealerAddressesUpdateDialogProps> = ({
    dealer,
    open,
    onClose,
}) => {
    const { form, onSubmit, isPending, addresses, addressTypeOptions } =
        useMerchantAddressesUpdate(dealer, onClose);

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit Addresses</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <DealerAddressesForm
                            fields={addresses.fields}
                            onAdd={addresses.onAdd}
                            onRemove={addresses.onRemove}
                            onSetPrimary={addresses.onSetPrimary}
                            onCopyToAll={addresses.onCopyToAll}
                            addressTypeOptions={addressTypeOptions}
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

export default DealerAddressesUpdateDialog;
