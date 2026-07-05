import { useMemo } from "react";
import { getEnumEntries, separateWords } from "@/lib/object-utils";
import { updateDealerAction } from "@/services/api/dealer-ep";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { UpdateDealerRequest } from "@/types/request/dealer-request";
import {
    Brand,
    DealerDetails,
    DealershipType,
} from "@/types/response/dealer-response";
import QueryConst from "@/constants/query-constants";

// ── Zod Schema ──────────────────────────────────────────────────────────────

const nullableString = z
    .string()
    .nullable()
    .transform((val) => (val === "" ? null : val));

export const dealerInfoSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    phone: z
        .string()
        .regex(/^\d{1,10}$/, "Phone number must be up to 10 digits")
        .max(10, "Maximum 10 digits allowed"),
    website: nullableString,
    dealerLogoUrl: nullableString,
    dealershipType: z
        .array(z.nativeEnum(DealershipType))
        .min(1, "Select at least one dealership type"),
    brand: z.array(z.nativeEnum(Brand)).min(1, "Select at least one brand"),
});

export type DealerInfoFormValues = z.infer<typeof dealerInfoSchema>;

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useMerchantUpdate = (dealer: DealerDetails, onClose: () => void) => {
    const queryClient = useQueryClient();

    // ── Form ──────────────────────────────────────────────────────────────

    const form = useForm<DealerInfoFormValues>({
        resolver: zodResolver(dealerInfoSchema),
        values: {
            companyName: dealer.companyName,
            phone: dealer.phone,
            website: dealer.website ?? "",
            dealerLogoUrl: dealer.dealerLogoUrl ?? "",
            dealershipType: dealer.dealershipType,
            brand: dealer.brand,
        },
    });

    // ── Mutation ──────────────────────────────────────────────────────────

    const { mutateAsync: updateDealerAsync, isPending } = useMutation({
        mutationKey: [QueryConst.dealers.update, dealer.dealerId],
        mutationFn: updateDealerAction,
    });

    const mapUpdatePayload = (
        formValues: DealerInfoFormValues
    ): UpdateDealerRequest =>
        ({
            ...dealer,
            ...formValues,
            website: formValues.website,
            dealerLogoUrl: formValues.dealerLogoUrl,
            dealerCode: dealer.dealerCode ?? undefined,
        }) as unknown as UpdateDealerRequest;

    // ── Submit ────────────────────────────────────────────────────────────

    const onSubmit = form.handleSubmit((values) => {
        const payload = mapUpdatePayload(values);

        updateDealerAsync(payload)
            .then(() => {
                toast.success("Dealer updated successfully");
                queryClient.invalidateQueries({
                    queryKey: [QueryConst.dealers.details, dealer.dealerId],
                });
                queryClient.invalidateQueries({
                    queryKey: [QueryConst.dealers.list],
                });
                onClose();
            })
            .catch((error) => {
                toast.error(
                    error?.message ?? "Failed to update dealer information"
                );
            });
    });

    // ── Options ───────────────────────────────────────────────────────────

    const dealershipTypeOptions = useMemo(
        () =>
            getEnumEntries(DealershipType).map(([label, value]) => ({
                label: separateWords(label),
                value,
            })),
        []
    );

    const brandOptions = useMemo(
        () =>
            getEnumEntries(Brand).map(([label, value]) => ({
                label: separateWords(label),
                value: value,
            })),
        []
    );

    return {
        form,
        onSubmit,
        isPending,
        dealershipTypeOptions,
        brandOptions,
    };
};
