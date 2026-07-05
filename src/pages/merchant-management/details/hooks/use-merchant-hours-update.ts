import { useCallback, useMemo } from "react";
import { updateDealerAction } from "@/services/api/dealer-ep";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { UpdateDealerRequest } from "@/types/request/dealer-request";
import { DealerDetails } from "@/types/response/dealer-response";
import { TIMEZONES } from "@/constants/default-constants";
import QueryConst from "@/constants/query-constants";

// ── Zod Schema ───────────────────────────────────────────────────────────────

const businessHoursSchema = z.object({
    deptName: z.string().min(1, "Department name is required"),
    monFrom: z.string().nullable(),
    monTo: z.string().nullable(),
    tueFrom: z.string().nullable(),
    tueTo: z.string().nullable(),
    wedFrom: z.string().nullable(),
    wedTo: z.string().nullable(),
    thuFrom: z.string().nullable(),
    thuTo: z.string().nullable(),
    friFrom: z.string().nullable(),
    friTo: z.string().nullable(),
    satFrom: z.string().nullable(),
    satTo: z.string().nullable(),
    sunFrom: z.string().nullable(),
    sunTo: z.string().nullable(),
    timeZone: z.string().nullable(),
});

export const dealerHoursSchema = z.object({
    departmentBusinessHours: z.array(businessHoursSchema),
});

export type DealerHoursFormValues = z.infer<typeof dealerHoursSchema>;

type DayPrefix = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useMerchantHoursUpdate = (
    dealer: DealerDetails,
    onClose: () => void
) => {
    const queryClient = useQueryClient();

    // ── 1. Form ───────────────────────────────────────────────────────────

    const form = useForm<DealerHoursFormValues>({
        resolver: zodResolver(dealerHoursSchema),
        values: {
            departmentBusinessHours: dealer.departmentBusinessHours.map(
                ({ dealerId: _, ...dept }) => dept
            ),
        },
    });

    const { control } = form;

    const {
        fields: hoursFields,
        append: appendHours,
        remove: removeHours,
    } = useFieldArray({ control, name: "departmentBusinessHours" });

    // ── 2. Mutation ───────────────────────────────────────────────────────

    const { mutateAsync: updateDealerAsync, isPending } = useMutation({
        mutationKey: [QueryConst.dealers.update, dealer.dealerId],
        mutationFn: updateDealerAction,
    });

    // ── 3. Handlers ───────────────────────────────────────────────────────

    const handleAddDepartment = useCallback(() => {
        appendHours({
            deptName: "",
            monFrom: null,
            monTo: null,
            tueFrom: null,
            tueTo: null,
            wedFrom: null,
            wedTo: null,
            thuFrom: null,
            thuTo: null,
            friFrom: null,
            friTo: null,
            satFrom: null,
            satTo: null,
            sunFrom: null,
            sunTo: null,
            timeZone: "America/New_York",
        });
    }, [appendHours]);

    const handleDayToggle = useCallback(
        (deptIndex: number, prefix: DayPrefix, checked: boolean) => {
            form.setValue(
                `departmentBusinessHours.${deptIndex}.${prefix}From`,
                checked ? "09:00" : null,
                { shouldDirty: true, shouldValidate: true }
            );
            form.setValue(
                `departmentBusinessHours.${deptIndex}.${prefix}To`,
                checked ? "18:00" : null,
                { shouldDirty: true, shouldValidate: true }
            );
        },
        [form]
    );

    const onSubmit = form.handleSubmit((values) => {
        const payload: UpdateDealerRequest = {
            ...dealer,
            departmentBusinessHours: values.departmentBusinessHours,
            dealerCode: dealer.dealerCode ?? undefined,
        } as unknown as UpdateDealerRequest;

        updateDealerAsync(payload)
            .then(() => {
                toast.success("Business hours updated successfully");
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
                    error?.message ?? "Failed to update business hours"
                );
            });
    });

    const timezoneOptions = useMemo(
        () => TIMEZONES.map((tz) => ({ label: tz, value: tz })),
        []
    );

    return {
        form,
        onSubmit,
        isPending,
        businessHours: {
            fields: hoursFields,
            onAdd: handleAddDepartment,
            onRemove: removeHours,
            onDayToggle: handleDayToggle,
        },
        timezoneOptions,
    };
};
