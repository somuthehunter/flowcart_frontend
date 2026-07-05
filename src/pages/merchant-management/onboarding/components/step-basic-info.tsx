import { useFormContext } from "react-hook-form";

import { Brand } from "@/types/response/dealer-response";
import { Autocomplete } from "@/components/ui/autocomplete";
import { Checkbox } from "@/components/ui/checkbox";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { DealerOnboardingFormValues } from "../hooks/use-merchant-onboarding";

type StepBasicInfoProps = {
    dealershipTypeOptions: { label: string; value: number }[];
    brandOptions: { label: string; value: string }[];
};

export default function StepBasicInfo({
    dealershipTypeOptions,
    brandOptions,
}: StepBasicInfoProps) {
    const { control } = useFormContext<DealerOnboardingFormValues>();

    return (
        <div className="space-y-6">
            <div className="text-muted-foreground text-sm">
                Step 1 of 5:{" "}
                <span className="text-foreground font-medium">
                    Basic Information
                </span>
            </div>

            <div className="bg-card space-y-6 rounded-xl border p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Company Name */}
                    <FormField
                        control={control}
                        name="companyName"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <label className="text-sm font-semibold">
                                    Company Name{" "}
                                    <span className="text-destructive">*</span>
                                </label>
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

                    {/* Primary Email */}
                    <FormField
                        control={control}
                        name="primaryEmail"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <label className="text-sm font-semibold">
                                    Primary Email{" "}
                                    <span className="text-destructive">*</span>
                                </label>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="info@apexauto.com"
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
                                <label className="text-sm font-semibold">
                                    Phone Number{" "}
                                    <span className="text-destructive">*</span>
                                </label>
                                <FormControl>
                                    <Input
                                        placeholder="e.g. 1234567890"
                                        {...field}
                                        maxLength={10}
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
                                <label className="text-sm font-semibold">
                                    Website
                                </label>
                                <FormControl>
                                    <Input
                                        placeholder="https://www.apexauto.com"
                                        value={field.value ?? ""}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value || null
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Reseller ID */}
                    {/*
                    <FormField
                        control={control}
                        name="resellerId"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <label className="text-sm font-semibold">Reseller ID</label>
                                <FormControl>
                                    <Input
                                        placeholder="UUID of Reseller"
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(e.target.value || null)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    */}

                    {/* Dealer Logo URL */}
                    <FormField
                        control={control}
                        name="dealerLogoUrl"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <label className="text-sm font-semibold">
                                    Logo URL
                                </label>
                                <FormControl>
                                    <Input
                                        placeholder="https://example.com/logo.png"
                                        value={field.value ?? ""}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value || null
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2">
                    {/* Dealership Type Checklist */}
                    <FormField
                        control={control}
                        name="dealershipType"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <div>
                                    <label className="text-sm font-semibold">
                                        Dealership Types{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </label>
                                    <p className="text-muted-foreground text-xs">
                                        Select all types that apply to this
                                        dealer
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {dealershipTypeOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            className="flex flex-row items-start space-y-0 space-x-3">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(
                                                        option.value
                                                    )}
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
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
                                            <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Brands Selection */}
                    <FormField
                        control={control}
                        name="brand"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <label className="text-sm font-semibold">
                                    Supported Brands{" "}
                                    <span className="text-destructive">*</span>
                                </label>

                                <FormControl>
                                    <Autocomplete
                                        multiple
                                        options={brandOptions}
                                        value={(field.value ?? []).map(
                                            (value) => {
                                                const option =
                                                    brandOptions.find(
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
                                            }
                                        )}
                                        onChange={(options) => {
                                            field.onChange(
                                                options.map(
                                                    (o) =>
                                                        Number(o.value) as Brand
                                                )
                                            );
                                        }}
                                        placeholder="Search and select brands..."
                                        limitTags={8}
                                        getLimitTagsText={(more) => `+${more}`}
                                        noOptionsText="No brands found."
                                        popoverClassName="max-h-35 [&_[cmdk-list]]:max-h-35"
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
