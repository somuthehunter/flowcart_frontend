import { useCallback, useMemo, useState } from "react";
import { getEnumEntries, separateWords } from "@/lib/object-utils";
import { createDealer } from "@/services/api/dealer-ep";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

import { CreateDealerRequest } from "@/types/request/dealer-request";
import {
    AddressType,
    Brand,
    DealershipType,
    DealerStatus,
} from "@/types/response/dealer-response";
import { TIMEZONES } from "@/constants/default-constants";
import QueryConst from "@/constants/query-constants";
import { AdminRoutes } from "@/constants/route-constants";

// Helper for handling empty strings as null in request payloads
const nullableString = z
    .string()
    .nullable()
    .transform((val) => (val === "" ? null : val));

const addressSchema = z.object({
    addressType: z.nativeEnum(AddressType),
    addressLine: z.string().min(1, "Address line is required"),
    state: z.string().min(1, "State is required"),
    zipcode: z.string().min(1, "Zip code is required"),
    country: z.string().min(1, "Country is required"),
    radius: z.string(),
    isPrimary: z.boolean(),
});

const contactPersonSchema = z.object({
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

// ── Step 4: Business Hours Schema ──
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

// ── Composed Dealer Onboarding Schema ──
export const dealerOnboardingSchema = z
    .object({
        companyName: z.string().min(1, "Company name is required"),
        resellerId: nullableString,
        primaryEmail: z
            .string()
            .min(1, "Primary email is required")
            .email("Invalid email format"),
        phone: z
            .string()
            .regex(/^\d{1,10}$/, "Phone number must be up to 10 digits")
            .max(10, "Maximum 10 digits allowed"),
        website: nullableString,
        dealershipType: z
            .array(z.number())
            .min(1, "Select at least one dealership type"),
        brand: z.array(z.number()).min(1, "Select at least one brand"),
        dealerLogoUrl: nullableString,

        addresses: z
            .array(addressSchema)
            .min(1, "At least one address is required"),
        contactPersons: z.array(contactPersonSchema),
        departmentBusinessHours: z.array(businessHoursSchema),
    })
    .superRefine((data, ctx) => {
        if (
            data.addresses.length > 0 &&
            !data.addresses.some((addr) => addr.isPrimary)
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["addresses"],
                message: "At least one address must be marked as primary",
            });
        }

        const hasLegal = data.addresses.some(
            (addr) => addr.addressType === AddressType.Legal
        );
        const hasBilling = data.addresses.some(
            (addr) => addr.addressType === AddressType.Billing
        );

        if (!hasLegal || !hasBilling) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["addresses"],
                message: "Both Legal and Billing addresses must be provided",
            });
        }
    });

export type DealerOnboardingFormValues = z.infer<typeof dealerOnboardingSchema>;

// Constants for default values
//TODO:: Make these configurable
const DEFAULT_COUNTRY = "United States";
const DEFAULT_RADIUS = "10";
const DEFAULT_TIMEZONE = "Asia/Kolkata";

// Types derived from schema for factory functions
type AddressValues = z.infer<typeof addressSchema>;
type ContactValues = z.infer<typeof contactPersonSchema>;
type BusinessHoursValues = z.infer<typeof businessHoursSchema>;

const createDefaultAddress = (
    isPrimary = false,
    addressType = AddressType.Legal
): AddressValues => ({
    addressType,
    addressLine: "",
    state: "",
    zipcode: "",
    country: DEFAULT_COUNTRY,
    radius: DEFAULT_RADIUS,
    isPrimary,
});

const createDefaultContact = (isUser = false): ContactValues => ({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    isUser,
    designation: "",
});

const createDefaultBusinessHours = (
    deptName = "",
    isDefaultDepts = false
): BusinessHoursValues => ({
    deptName,
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
    timeZone: DEFAULT_TIMEZONE,
});

function useMerchantOnboarding() {
    const [currentStep, setCurrentStep] = useState(1);
    const steps = [
        "Basic Info",
        "Addresses",
        "Contacts",
        "Business Hours",
        "Review & Submit",
    ];

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Form setup
    const form = useForm<DealerOnboardingFormValues>({
        resolver: zodResolver(dealerOnboardingSchema),
        mode: "onChange",
        defaultValues: {
            companyName: "",
            resellerId: "",
            primaryEmail: "",
            phone: "",
            website: "",
            dealershipType: [DealershipType.New],
            brand: [],
            dealerLogoUrl: "",
            addresses: [
                createDefaultAddress(true, AddressType.Legal),
                createDefaultAddress(false, AddressType.Billing),
            ],
            contactPersons: [],
            departmentBusinessHours: [],
        },
    });

    const {
        setValue,
        getValues,
        trigger,
        setError,
        reset,
        handleSubmit,
        control,
    } = form;

    // Mutation
    const { mutateAsync: createDealerAsync, isPending: isPendingDealerCreate } =
        useMutation({
            mutationKey: [QueryConst.dealers.create],
            mutationFn: createDealer,
        });

    // ── Field Array for Addresses ──
    const {
        fields: addressFields,
        append: appendAddress,
        remove: removeAddress,
    } = useFieldArray({
        control,
        name: "addresses",
    });

    const handleSetPrimaryAddress = useCallback(
        (index: number) => {
            const currentAddresses = getValues("addresses");
            const updated = currentAddresses.map((addr, i) => ({
                ...addr,
                isPrimary: i === index,
            }));
            setValue("addresses", updated, {
                shouldDirty: true,
                shouldValidate: true,
            });
        },
        [getValues, setValue]
    );

    const handleAddAddress = () => {
        const isFirst = addressFields.length === 0;
        appendAddress(createDefaultAddress(isFirst, AddressType.Shipping));
    };

    const handleCopyToAll = (sourceIndex: number) => {
        const currentAddresses = getValues("addresses");
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

        setValue("addresses", updated, {
            shouldDirty: true,
            shouldValidate: true,
        });

        toast.success("Address copied to all other addresses");
    };

    // ── Field Array for Contact Persons ──
    const {
        fields: contactFields,
        append: appendContact,
        remove: removeContact,
    } = useFieldArray({
        control,
        name: "contactPersons",
    });

    const handleSetUserContact = useCallback(
        (index: number) => {
            const currentContacts = getValues("contactPersons") || [];
            currentContacts.forEach((_, i) => {
                setValue(`contactPersons.${i}.isUser`, i === index, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
            });
        },
        [getValues, setValue]
    );

    const handleAddContact = () => {
        const isFirst = contactFields.length === 0;
        appendContact(createDefaultContact(isFirst));
    };

    // ── Field Array for Business Hours ──
    const {
        fields: hoursFields,
        append: appendHours,
        remove: removeHours,
    } = useFieldArray({
        control,
        name: "departmentBusinessHours",
    });

    const handleAddDepartment = () => {
        appendHours(createDefaultBusinessHours(""));
    };

    const handleDayToggle = (
        deptIndex: number,
        prefix: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun",
        checked: boolean
    ) => {
        if (checked) {
            setValue(
                `departmentBusinessHours.${deptIndex}.${prefix}From`,
                "09:00",
                {
                    shouldDirty: true,
                    shouldValidate: true,
                }
            );
            setValue(
                `departmentBusinessHours.${deptIndex}.${prefix}To`,
                "18:00",
                {
                    shouldDirty: true,
                    shouldValidate: true,
                }
            );
        } else {
            setValue(
                `departmentBusinessHours.${deptIndex}.${prefix}From`,
                null,
                {
                    shouldDirty: true,
                    shouldValidate: true,
                }
            );
            setValue(`departmentBusinessHours.${deptIndex}.${prefix}To`, null, {
                shouldDirty: true,
                shouldValidate: true,
            });
        }
    };

    const isStepValid = async (): Promise<boolean> => {
        if (currentStep === 1) {
            return await trigger([
                "companyName",
                "resellerId",
                "primaryEmail",
                "phone",
                "website",
                "dealershipType",
                "brand",
                "dealerLogoUrl",
            ]);
        }
        if (currentStep === 2) {
            const isValidAddresses = await trigger("addresses");
            if (!isValidAddresses) return false;
            // Double check refinement rules since trigger doesn't always trigger superRefine on parent array
            const addresses = getValues("addresses") || [];
            if (addresses.length === 0 || !addresses.some((a) => a.isPrimary)) {
                setError("addresses", {
                    type: "custom",
                    message: "At least one address must be marked as primary",
                });
                return false;
            }

            const hasLegal = addresses.some(
                (a) => a.addressType === AddressType.Legal
            );
            const hasBilling = addresses.some(
                (a) => a.addressType === AddressType.Billing
            );
            if (!hasLegal || !hasBilling) {
                setError("addresses", {
                    type: "custom",
                    message:
                        "Both Legal and Billing addresses must be provided",
                });
                return false;
            }

            return true;
        }
        if (currentStep === 3) {
            const isValidContacts = await trigger("contactPersons");
            if (!isValidContacts) return false;
            return true;
        }
        if (currentStep === 4) {
            return await trigger("departmentBusinessHours");
        }
        if (currentStep === 5) {
            return true;
        }
        return false;
    };

    const onNext = async () => {
        const valid = await isStepValid();
        if (!valid) return;
        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    };

    const onPrev = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const onReset = () => {
        reset();
        setCurrentStep(1);
    };

    const mapDealerPayload = (
        data: DealerOnboardingFormValues
    ): CreateDealerRequest => ({
        companyName: data.companyName,
        resellerId: data.resellerId,
        primaryEmail: data.primaryEmail,
        phone: data.phone,
        website: data.website,
        dealershipType: data.dealershipType,
        brand: data.brand,
        dealerLogoUrl: data.dealerLogoUrl,
        addresses: data.addresses.map((addr) => ({
            addressType: addr.addressType,
            addressLine: addr.addressLine,
            state: addr.state,
            zipcode: addr.zipcode,
            country: addr.country,
            radius: addr.radius,
            isPrimary: addr.isPrimary,
        })),
        contactPersons: data.contactPersons.map((cp) => ({
            firstName: cp.firstName,
            lastName: cp.lastName,
            phone: cp.phone,
            email: cp.email,
            isUser: cp.isUser,
            designation: cp.designation,
        })),
        departmentBusinessHours: data.departmentBusinessHours.map((dept) => ({
            deptName: dept.deptName,
            monFrom: dept.monFrom,
            monTo: dept.monTo,
            tueFrom: dept.tueFrom,
            tueTo: dept.tueTo,
            wedFrom: dept.wedFrom,
            wedTo: dept.wedTo,
            thuFrom: dept.thuFrom,
            thuTo: dept.thuTo,
            friFrom: dept.friFrom,
            friTo: dept.friTo,
            satFrom: dept.satFrom,
            satTo: dept.satTo,
            sunFrom: dept.sunFrom,
            sunTo: dept.sunTo,
            timeZone: dept.timeZone,
        })),
    });

    const onSubmitFinal = handleSubmit((data) => {
        const payload = mapDealerPayload(data);
        console.log("Form submit payload mapped:", payload);
        createDealerAsync(payload)
            .then(() => {
                toast.success("Dealer onboarding completed successfully");
                queryClient.invalidateQueries({
                    queryKey: [QueryConst.dealers.list],
                });
                navigate(AdminRoutes.merchants.list);
            })
            .catch((error) => {
                toast.error(
                    error?.message ?? "Failed to complete dealer onboarding"
                );
            });
    });

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
    const statusOptions = useMemo(
        () =>
            getEnumEntries(DealerStatus).map(([label, value]) => ({
                label: separateWords(label),
                value: value,
            })),
        []
    );

    const timezoneOptions = useMemo(
        () => TIMEZONES.map((tz) => ({ label: tz, value: tz })),
        []
    );

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

        navigation: {
            steps,
            currentStep,
            setCurrentStep,
            onNext,
            onPrev,
            onReset,
        },

        mutation: {
            onSubmitFinal,
            isPendingDealerCreate,
        },

        options: {
            dealershipTypeOptions,
            brandOptions,
            statusOptions,
            addressTypeOptions,
            timezoneOptions,
        },

        addresses: {
            fields: addressFields,
            onAdd: handleAddAddress,
            onRemove: removeAddress,
            onSetPrimary: handleSetPrimaryAddress,
            onCopyToAll: handleCopyToAll,
        },

        contacts: {
            fields: contactFields,
            onAdd: handleAddContact,
            onRemove: removeContact,
            onSetUser: handleSetUserContact,
        },

        businessHours: {
            fields: hoursFields,
            onAdd: handleAddDepartment,
            onRemove: removeHours,
            onDayToggle: handleDayToggle,
        },
    };
}

export default useMerchantOnboarding;
export { useMerchantOnboarding };
