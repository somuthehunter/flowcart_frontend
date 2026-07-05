import { FC } from "react";
import { useFormContext } from "react-hook-form";

import {
    Brand,
    DealerDetails,
    DealershipType,
} from "@/types/response/dealer-response";
import { Autocomplete } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";

import {
    DealerInfoFormValues,
    useMerchantUpdate,
} from "../hooks/use-merchant-update";

// ── Inner Form Component ──────────────────────────────────────────────────────

type DealerBasicInfoFormProps = {
    dealershipTypeOptions: { label: string; value: DealershipType }[];
    brandOptions: { label: string; value: string }[];
};

export const DealerBasicInfoForm: FC<DealerBasicInfoFormProps> = ({
    dealershipTypeOptions,
    brandOptions,
}) => {
    const { control } = useFormContext<DealerInfoFormValues>();

    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Company Name */}
                <FormField
                    control={control}
                    name="companyName"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <Label>
                                Company Name{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <FormControl>
                                <Input
                                    placeholder="e.g. Apex Auto Group"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Phone */}
                <FormField
                    control={control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <Label>
                                Phone Number{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <FormControl>
                                <Input
                                    placeholder="e.g. 1234567890"
                                    maxLength={10}
                                    {...field}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(
                                            /\D/g,
                                            ""
                                        );
                                        field.onChange(val);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Website */}
                <FormField
                    control={control}
                    name="website"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <Label>Website</Label>
                            <FormControl>
                                <Input
                                    placeholder="https://www.example.com"
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                        field.onChange(e.target.value || null)
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Logo URL */}
                <FormField
                    control={control}
                    name="dealerLogoUrl"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <Label>Logo URL</Label>
                            <FormControl>
                                <Input
                                    placeholder="https://example.com/logo.png"
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                        field.onChange(e.target.value || null)
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
                {/* Left Column */}
                <FormField
                    control={control}
                    name="dealershipType"
                    render={({ field }) => (
                        <FormItem className="space-y-3 self-start">
                            <div>
                                <Label>
                                    Dealership Types{" "}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <p className="text-muted-foreground text-xs">
                                    Select all types that apply
                                </p>
                            </div>

                            <div className="space-y-3 rounded-md border p-4">
                                {dealershipTypeOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        className="flex items-center gap-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(
                                                    option.value as DealershipType
                                                )}
                                                onCheckedChange={(checked) => {
                                                    const current =
                                                        field.value || [];

                                                    if (checked) {
                                                        field.onChange([
                                                            ...current,
                                                            option.value,
                                                        ]);
                                                    } else {
                                                        field.onChange(
                                                            current.filter(
                                                                (v) =>
                                                                    v !==
                                                                    option.value
                                                            )
                                                        );
                                                    }
                                                }}
                                            />
                                        </FormControl>

                                        <Label className="cursor-pointer font-normal">
                                            {option.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Right Column */}
                <FormField
                    control={control}
                    name="brand"
                    render={({ field }) => (
                        <FormItem className="space-y-2 self-start">
                            <Label>
                                Supported Brands{" "}
                                <span className="text-destructive">*</span>
                            </Label>

                            <FormControl>
                                <Autocomplete
                                    multiple
                                    options={brandOptions}
                                    value={(field.value ?? []).map((value) => {
                                        const option = brandOptions.find(
                                            (o) =>
                                                String(o.value) ===
                                                String(value)
                                        );

                                        return (
                                            option ?? {
                                                label: String(value),
                                                value: String(value),
                                            }
                                        );
                                    })}
                                    onChange={(options) => {
                                        field.onChange(
                                            options.map(
                                                (o) => Number(o.value) as Brand
                                            )
                                        );
                                    }}
                                    placeholder="Search and select brands..."
                                    limitTags={8}
                                    getLimitTagsText={(more) => `+${more}`}
                                    noOptionsText="No brands found."
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </>
    );
};

// ── Dialog ────────────────────────────────────────────────────────────────────

type DealerUpdateDialogProps = {
    dealer: DealerDetails;
    open: boolean;
    onClose: () => void;
};

const DealerUpdateDialog: FC<DealerUpdateDialogProps> = ({
    dealer,
    open,
    onClose,
}) => {
    const { form, onSubmit, isPending, dealershipTypeOptions, brandOptions } =
        useMerchantUpdate(dealer, onClose);

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Basic Info</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <DealerBasicInfoForm
                            dealershipTypeOptions={dealershipTypeOptions}
                            brandOptions={brandOptions}
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

export default DealerUpdateDialog;
