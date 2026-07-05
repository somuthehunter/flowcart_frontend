import { useCallback, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { UpdateDealerRequest } from "@/types/request/dealer-request";
import { AddressType, DealerDetails } from "@/types/response/dealer-response";
import QueryConst from "@/constants/query-constants";
import { updateDealerAction } from "@/services/api/dealer-ep";

// ── Zod Schema ───────────────────────────────────────────────────────────────

const addressSchema = z.object({
    addressId: z.string().optional(),
    addressType: z.nativeEnum(AddressType),
    addressLine: z.string().min(1, "Address line is required"),
    state: z.string().min(1, "State is required"),
    zipcode: z.string().min(1, "Zip code is required"),
    country: z.string().min(1, "Country is required"),
    radius: z.number(),
    isPrimary: z.boolean(),
});

export const dealerAddressesSchema = z
    .object({ addresses: z.array(addressSchema).min(1, "At least one address is required") })
    .superRefine((data, ctx) => {
        if (!data.addresses.some((a) => a.isPrimary)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["addresses"],
                message: "At least one address must be marked as primary",
            });
        }
        if (!data.addresses.some((a) => a.addressType === AddressType.Legal)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["addresses"],
                message: "A Legal address is required",
            });
        }
        if (!data.addresses.some((a) => a.addressType === AddressType.Billing)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["addresses"],
                message: "A Billing address is required",
            });
        }
    });

export type DealerAddressesFormValues = z.infer<typeof dealerAddressesSchema>;

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useMerchantAddressesUpdate = (
    dealer: DealerDetails,
    onClose: () => void
) => {
    const queryClient = useQueryClient();

    // ── 1. Form ───────────────────────────────────────────────────────────

    const form = useForm<DealerAddressesFormValues>({
        resolver: zodResolver(dealerAddressesSchema),
        values: {
            addresses: dealer.addresses.map(
                ({ dealerId: _d, latitude: _lat, longitude: _lng, ...addr }) => ({
                    ...addr,
                    addressId: addr.addressId,
                    addressLine: addr.addressLine ?? "",
                    state: addr.state ?? "",
                    zipcode: addr.zipcode ?? "",
                    country: addr.country ?? "",
                    radius: Number(addr.radius),
                })
            ),
        },
    });

    const { control } = form;

    const {
        fields: addressFields,
        append: appendAddress,
        remove: removeAddress,
    } = useFieldArray({ control, name: "addresses" });

    // ── 2. Mutation ───────────────────────────────────────────────────────

    const { mutateAsync: updateDealerAsync, isPending } = useMutation({
        mutationKey: [QueryConst.dealers.update, dealer.dealerId],
        mutationFn: updateDealerAction,
    });

    // ── 3. Handlers ───────────────────────────────────────────────────────

    const handleAddAddress = useCallback(() => {
        appendAddress({
            addressType: AddressType.Shipping,
            addressLine: "",
            state: "",
            zipcode: "",
            country: "United States",
            radius: 10,
            isPrimary: false,
        });
    }, [appendAddress]);

    const handleSetPrimary = useCallback(
        (index: number) => {
            const currentAddresses = form.getValues("addresses");
            const updated = currentAddresses.map((addr, i) => ({
                ...addr,
                isPrimary: i === index,
            }));
            form.setValue("addresses", updated, {
                shouldDirty: true,
                shouldValidate: true,
            });
        },
        [form]
    );

    const handleCopyToAll = useCallback(
        (sourceIndex: number) => {
            const currentAddresses = form.getValues("addresses");
            const source = currentAddresses[sourceIndex];
            
            if (currentAddresses.length <= 1) {
                toast.error("No other addresses to copy to");
                return;
            }

            const updated = currentAddresses.map((addr, i) => {
                if (i === sourceIndex) return addr;
                return {
                    ...addr,
                    addressLine: source.addressLine ?? "",
                    state: source.state ?? "",
                    zipcode: source.zipcode ?? "",
                    country: source.country ?? "",
                };
            });
            
            form.setValue("addresses", updated, {
                shouldDirty: true,
                shouldValidate: true,
            });
            
            toast.success("Address copied to all other addresses");
        },
        [form]
    );

    // handleCopyToBilling removed

    const onSubmit = form.handleSubmit((values) => {
        const payload: UpdateDealerRequest = {
            ...dealer,
            addresses: values.addresses,
            dealerCode: dealer.dealerCode ?? undefined,
        } as unknown as UpdateDealerRequest;

        updateDealerAsync(payload)
            .then(() => {
                toast.success("Addresses updated successfully");
                queryClient.invalidateQueries({
                    queryKey: [QueryConst.dealers.details, dealer.dealerId],
                });
                queryClient.invalidateQueries({ queryKey: [QueryConst.dealers.list] });
                onClose();
            })
            .catch((error) => {
                toast.error(error?.message ?? "Failed to update addresses");
            });
    });

    // ── Options ───────────────────────────────────────────────────────────

    const addressTypeOptions = useMemo(
        () => [
            { label: "Legal", value: AddressType.Legal },
            { label: "Billing", value: AddressType.Billing },
            { label: "Shipping", value: AddressType.Shipping },
            { label: "Factory", value: AddressType.Factory },
            { label: "Branch", value: AddressType.Branch },
        ],
        []
    );

    return {
        form,
        onSubmit,
        isPending,
        addresses: {
            fields: addressFields,
            onAdd: handleAddAddress,
            onRemove: removeAddress,
            onSetPrimary: handleSetPrimary,
            onCopyToAll: handleCopyToAll,
        },
        addressTypeOptions,
    };
};
