import { useCallback } from "react";
import { updateDealerAction } from "@/services/api/dealer-ep";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { UpdateDealerRequest } from "@/types/request/dealer-request";
import { DealerDetails } from "@/types/response/dealer-response";
import QueryConst from "@/constants/query-constants";

// ── Zod Schema ───────────────────────────────────────────────────────────────

const nullableString = z
    .string()
    .nullable()
    .transform((val) => (val === "" ? null : val));

const contactPersonSchema = z.object({
    contactId: z.string().optional(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z
        .string()
        .regex(/^\d{1,10}$/, "Phone number must be up to 10 digits")
        .max(10, "Maximum 10 digits allowed"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    isUser: z.boolean(),
    designation: nullableString,
});

export const dealerContactsSchema = z.object({
    contactPersons: z.array(contactPersonSchema),
});

export type DealerContactsFormValues = z.infer<typeof dealerContactsSchema>;

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useMerchantContactsUpdate = (
    dealer: DealerDetails,
    onClose: () => void
) => {
    const queryClient = useQueryClient();

    // ── 1. Form ───────────────────────────────────────────────────────────

    const form = useForm<DealerContactsFormValues>({
        resolver: zodResolver(dealerContactsSchema),
        values: {
            contactPersons: dealer.contactPersons.map(
                ({ dealerId: _d, ...cp }) => ({
                    ...cp,
                    contactId: cp.contactId,
                    firstName: cp.firstName ?? "",
                    lastName: cp.lastName ?? "",
                    phone: cp.phone ?? "",
                })
            ),
        },
    });

    const { control } = form;

    const {
        fields: contactFields,
        append: appendContact,
        remove: removeContact,
    } = useFieldArray({ control, name: "contactPersons" });

    // ── 2. Mutation ───────────────────────────────────────────────────────

    const { mutateAsync: updateDealerAsync, isPending } = useMutation({
        mutationKey: [QueryConst.dealers.update, dealer.dealerId],
        mutationFn: updateDealerAction,
    });

    // ── 3. Handlers ───────────────────────────────────────────────────────

    const handleAddContact = useCallback(() => {
        appendContact({
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            isUser: false,
            designation: "",
        });
    }, [appendContact]);

    const handleSetUserContact = useCallback(
        (index: number) => {
            const currentContacts = form.getValues("contactPersons") || [];
            currentContacts.forEach((_, i) => {
                form.setValue(`contactPersons.${i}.isUser`, i === index, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
            });
        },
        [form]
    );

    const onSubmit = form.handleSubmit((values) => {
        const payload: UpdateDealerRequest = {
            ...dealer,
            contactPersons: values.contactPersons,
            dealerCode: dealer.dealerCode ?? undefined,
        } as unknown as UpdateDealerRequest;

        updateDealerAsync(payload)
            .then(() => {
                toast.success("Contacts updated successfully");
                queryClient.invalidateQueries({
                    queryKey: [QueryConst.dealers.details, dealer.dealerId],
                });
                queryClient.invalidateQueries({
                    queryKey: [QueryConst.dealers.list],
                });
                onClose();
            })
            .catch((error) => {
                toast.error(error?.message ?? "Failed to update contacts");
            });
    });

    return {
        form,
        onSubmit,
        isPending,
        contacts: {
            fields: contactFields,
            onAdd: handleAddContact,
            onRemove: removeContact,
            onSetUser: handleSetUserContact,
        },
    };
};
