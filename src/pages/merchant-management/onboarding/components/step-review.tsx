import { separateWords } from "@/lib/object-utils";
import {
    Building2,
    Clock,
    Globe,
    Mail,
    MapPin,
    Phone,
    User,
} from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import {
    AddressType,
    Brand,
    DealerAddress,
    DealerContactPerson,
    DepartmentBusinessHours,
} from "@/types/response/dealer-response";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { DealerOnboardingFormValues } from "../hooks/use-merchant-onboarding";

type StepReviewProps = {
    dealershipTypeOptions: { label: string; value: number }[];
    brandOptions: { label: string; value: string }[];
};

export default function StepReview({ dealershipTypeOptions }: StepReviewProps) {
    const { control } = useFormContext<DealerOnboardingFormValues>();
    const watched = useWatch({ control });

    const {
        companyName = "",
        primaryEmail = "",
        phone = "",
        website = "",
        dealershipType = [],
        brand = [],
        dealerLogoUrl = "",
        addresses = [],
        contactPersons = [],
        departmentBusinessHours = [],
    } = watched;

    const getAddressTypeLabel = (type?: number) => {
        if (type === undefined) return "Other";
        return AddressType[type] || "Other";
    };

    return (
        <div className="space-y-6">
            <div className="text-muted-foreground text-sm">
                Step 5 of 5:{" "}
                <span className="text-foreground font-medium">
                    Review & Submit
                </span>
            </div>

            <div className="space-y-6">
                {/* 1. General Info Card */}
                <Card className="shadow-sm">
                    <CardContent className="space-y-6 p-6">
                        <div className="flex items-center gap-3 border-b pb-4">
                            <Building2 className="text-primary h-5 w-5" />
                            <h3 className="text-foreground text-lg font-bold">
                                General Information
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
                            {dealerLogoUrl && (
                                <div className="bg-muted/30 flex w-fit items-center gap-4 rounded-lg border p-3 md:col-span-2">
                                    <img
                                        src={dealerLogoUrl}
                                        alt="Dealer Logo Preview"
                                        className="h-12 w-12 rounded border bg-white object-contain"
                                        onError={(e) => {
                                            (
                                                e.target as HTMLElement
                                            ).style.display = "none";
                                        }}
                                    />
                                    <div>
                                        <p className="text-muted-foreground text-xs font-medium">
                                            Logo URL
                                        </p>
                                        <p className="font-mono text-xs break-all">
                                            {dealerLogoUrl}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <p className="text-muted-foreground">
                                    Company Name
                                </p>
                                <p className="text-base font-semibold">
                                    {companyName || "—"}
                                </p>
                            </div>

                            {/*
                            <div>
                                <p className="text-muted-foreground">Reseller ID</p>
                                <p className="font-mono text-xs break-all">{resellerId || "—"}</p>
                            </div>
                            */}

                            <div>
                                <p className="text-muted-foreground flex items-center gap-1.5">
                                    <Mail className="h-3.5 w-3.5" /> Primary
                                    Email
                                </p>
                                <p className="font-medium">
                                    {primaryEmail || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground flex items-center gap-1.5">
                                    <Phone className="h-3.5 w-3.5" /> Phone
                                    Number
                                </p>
                                <p className="font-medium">{phone || "—"}</p>
                            </div>

                            <div className="md:col-span-2">
                                <p className="text-muted-foreground flex items-center gap-1.5">
                                    <Globe className="h-3.5 w-3.5" /> Website
                                </p>
                                <p className="text-primary font-medium hover:underline">
                                    {website ? (
                                        <a
                                            href={website}
                                            target="_blank"
                                            rel="noopener noreferrer">
                                            {website}
                                        </a>
                                    ) : (
                                        "—"
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground mb-1.5">
                                    Dealership Types
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {dealershipType.length > 0 ? (
                                        dealershipType.map((type: number) => (
                                            <Badge key={type} color="secondary">
                                                {dealershipTypeOptions.find(
                                                    (o) => o.value === type
                                                )?.label || type}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-destructive text-xs font-medium">
                                            No type selected
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-muted-foreground mb-1.5">
                                    Supported Brands
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {brand.length > 0 ? (
                                        brand.map((b) => (
                                            <Badge key={b} color="secondary">
                                                {separateWords(Brand[b])}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-destructive text-xs font-medium">
                                            No brands selected
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Addresses Card */}
                <Card className="shadow-sm">
                    <CardContent className="space-y-4 p-6">
                        <div className="flex items-center gap-3 border-b pb-4">
                            <MapPin className="text-primary h-5 w-5" />
                            <h3 className="text-foreground text-lg font-bold">
                                Addresses
                            </h3>
                        </div>

                        {!addresses ? (
                            <div className="text-muted-foreground flex h-32 items-center justify-center rounded-xl border border-dashed text-sm">
                                No addresses added.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {addresses.map(
                                    (
                                        addr: Partial<DealerAddress>,
                                        index: number
                                    ) => (
                                        <div
                                            key={index}
                                            className={`relative space-y-2 rounded-xl border p-4 text-sm ${
                                                addr?.isPrimary
                                                    ? "border-primary bg-primary/5"
                                                    : "border-muted-foreground/20"
                                            }`}>
                                            <div className="flex items-start justify-between">
                                                <span className="text-foreground font-semibold">
                                                    {getAddressTypeLabel(
                                                        addr?.addressType
                                                    )}
                                                </span>

                                                {addr?.isPrimary && (
                                                    <Badge className="bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase">
                                                        Primary
                                                    </Badge>
                                                )}
                                            </div>

                                            <p className="text-foreground leading-relaxed">
                                                {addr?.addressLine || "—"},{" "}
                                                {addr?.state || "—"}
                                            </p>

                                            <p className="text-muted-foreground">
                                                Zip: {addr?.zipcode || "—"} |{" "}
                                                {addr?.country || "—"}
                                            </p>

                                            {addr?.radius && (
                                                <p className="text-muted-foreground font-mono text-xs">
                                                    Service Radius:{" "}
                                                    {addr.radius} km
                                                </p>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 3. Contact Persons Card */}
                <Card className="shadow-sm">
                    <CardContent className="space-y-4 p-6">
                        <div className="flex items-center gap-3 border-b pb-4">
                            <User className="text-primary h-5 w-5" />
                            <h3 className="text-foreground text-lg font-bold">
                                Contact Persons
                            </h3>
                        </div>

                        {!contactPersons || contactPersons.length === 0 ? (
                            <div className="text-muted-foreground flex h-32 items-center justify-center rounded-xl border border-dashed text-sm">
                                No contact persons added.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {contactPersons.map(
                                    (
                                        contact: Partial<DealerContactPerson>,
                                        index: number
                                    ) => (
                                        <div
                                            key={index}
                                            className={`relative space-y-2 rounded-xl border p-4 text-sm ${
                                                contact?.isUser
                                                    ? "border-emerald-500/50 bg-emerald-500/5"
                                                    : "border-muted-foreground/20"
                                            }`}>
                                            <div className="flex items-start justify-between">
                                                <span className="text-foreground text-base font-semibold">
                                                    {contact?.firstName || ""}{" "}
                                                    {contact?.lastName || ""}
                                                </span>

                                                {contact?.isUser && (
                                                    <Badge className="border-none bg-emerald-600 text-[10px] font-bold text-white uppercase dark:bg-emerald-500/20 dark:text-emerald-400">
                                                        Primary Login
                                                    </Badge>
                                                )}
                                            </div>

                                            {contact?.designation && (
                                                <p className="text-muted-foreground text-xs font-medium">
                                                    {contact.designation}
                                                </p>
                                            )}

                                            <p className="text-muted-foreground">
                                                Email:{" "}
                                                <span className="text-foreground">
                                                    {contact?.email || "—"}
                                                </span>
                                            </p>

                                            <p className="text-muted-foreground">
                                                Phone:{" "}
                                                <span className="text-foreground">
                                                    {contact?.phone || "—"}
                                                </span>
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 4. Timings Card */}
                <Card className="shadow-sm">
                    <CardContent className="space-y-4 p-6">
                        <div className="flex items-center gap-3 border-b pb-4">
                            <Clock className="text-primary h-5 w-5" />
                            <h3 className="text-foreground text-lg font-bold">
                                Department Timings
                            </h3>
                        </div>

                        {!departmentBusinessHours ||
                        departmentBusinessHours.length === 0 ? (
                            <div className="text-muted-foreground flex h-32 items-center justify-center rounded-xl border border-dashed text-sm">
                                No department timings added.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {departmentBusinessHours.map(
                                    (
                                        dept: Partial<DepartmentBusinessHours>,
                                        index: number
                                    ) => {
                                        const days = [
                                            {
                                                label: "Mon",
                                                from: dept.monFrom,
                                                to: dept.monTo,
                                            },
                                            {
                                                label: "Tue",
                                                from: dept.tueFrom,
                                                to: dept.tueTo,
                                            },
                                            {
                                                label: "Wed",
                                                from: dept.wedFrom,
                                                to: dept.wedTo,
                                            },
                                            {
                                                label: "Thu",
                                                from: dept.thuFrom,
                                                to: dept.thuTo,
                                            },
                                            {
                                                label: "Fri",
                                                from: dept.friFrom,
                                                to: dept.friTo,
                                            },
                                            {
                                                label: "Sat",
                                                from: dept.satFrom,
                                                to: dept.satTo,
                                            },
                                            {
                                                label: "Sun",
                                                from: dept.sunFrom,
                                                to: dept.sunTo,
                                            },
                                        ];

                                        return (
                                            <div
                                                key={index}
                                                className="bg-muted/10 space-y-3 rounded-xl border p-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-foreground text-base font-semibold">
                                                        {dept.deptName ??
                                                            `Department #${index + 1}`}
                                                    </span>

                                                    {dept.timeZone && (
                                                        <Badge
                                                            variant="bordered"
                                                            className="font-mono text-xs">
                                                            TZ: {dept.timeZone}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
                                                    {days.map((day) => (
                                                        <div
                                                            key={day.label}
                                                            className="bg-card flex flex-col justify-center gap-1 rounded border p-2.5 text-center text-xs shadow-sm">
                                                            <span className="text-muted-foreground font-semibold">
                                                                {day.label}
                                                            </span>

                                                            {day.from ||
                                                            day.to ? (
                                                                <span className="text-foreground font-medium">
                                                                    {day.from} -{" "}
                                                                    {day.to}
                                                                </span>
                                                            ) : (
                                                                <span className="text-destructive font-medium italic">
                                                                    Closed
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
