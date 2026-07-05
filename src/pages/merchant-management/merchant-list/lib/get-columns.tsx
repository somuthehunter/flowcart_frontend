import { formatDate } from "@/lib/format";
import { separateWords } from "@/lib/object-utils";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import {
    Building2,
    Car,
    Mail,
    Pencil,
    Phone,
    Tag,
    User,
    View,
} from "lucide-react";

import {
    Brand,
    DealerDetails,
    DealershipType,
    DealerStatus,
} from "@/types/response/dealer-response";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export type ActionType = "view" | "edit";

type GetColumnsParams = {
    onAction: (type: ActionType, row: DealerDetails) => void;
};

const DEALER_STATUS_COLORS: Record<DealerStatus, { bg: string; text: string }> =
    {
        [DealerStatus.PendingActivation]: {
            bg: "bg-muted",
            text: "text-muted-foreground",
        },
        [DealerStatus.Active]: {
            bg: "bg-green-500/10",
            text: "text-green-600",
        },
        [DealerStatus.Disable]: {
            bg: "bg-destructive/10",
            text: "text-destructive",
        },
    };

export const getColumns = ({
    onAction,
}: GetColumnsParams): ColumnDef<DealerDetails>[] => [
    {
        accessorKey: "companyName",
        header: "Dealer",
        cell: ({ row }) => {
            const { companyName, dealerCode } = row.original;

            return (
                <div className="flex flex-col">
                    <span className="font-medium whitespace-nowrap">
                        {companyName}
                    </span>

                    <span className="text-muted-foreground flex items-center gap-1 font-mono text-xs">
                        <Tag className="text-primary h-3 w-3" />
                        {dealerCode ?? "—"}
                    </span>
                </div>
            );
        },
        enableSorting: false,
    },

    {
        accessorKey: "ownerName",
        header: "Owner",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <User className="text-primary h-4 w-4" />
                <span>{row.original.ownerName ?? "N/A"}</span>
            </div>
        ),
        enableSorting: false,
    },

    {
        accessorKey: "contact",
        header: "Contact",
        cell: ({ row }) => {
            const { primaryEmail, phone } = row.original;

            return (
                <div className="flex max-w-64 flex-col gap-2 text-sm">
                    {primaryEmail ? (
                        <a
                            href={`mailto:${primaryEmail}`}
                            className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors">
                            <Mail className="text-primary h-4 w-4 shrink-0" />
                            <span className="truncate">{primaryEmail}</span>
                        </a>
                    ) : (
                        <span>—</span>
                    )}

                    {phone ? (
                        <a
                            href={`tel:${phone}`}
                            className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors">
                            <Phone className="text-primary h-4 w-4 shrink-0" />
                            <span>{phone}</span>
                        </a>
                    ) : null}
                </div>
            );
        },
        enableSorting: false,
    },

    {
        accessorKey: "dealershipType",
        header: "Dealership",
        cell: ({ row }) => {
            const types = row.original.dealershipType;

            return (
                <div className="flex flex-col gap-1">
                    {types.length ? (
                        types.map((type) => (
                            <span
                                key={type}
                                className="flex items-center gap-2 text-sm">
                                <Building2 className="text-primary h-3.5 w-3.5" />
                                {separateWords(DealershipType[type])}
                            </span>
                        ))
                    ) : (
                        <span>—</span>
                    )}
                </div>
            );
        },
        enableSorting: false,
    },

    {
        accessorKey: "brand",
        header: "Brands",
        cell: ({ row }) => {
            const brands = row.original.brand;

            if (!brands.length) return "—";

            const visibleBrands = brands.slice(0, 1);
            const remainingBrands = brands.slice(1);

            return (
                <div className="flex flex-col gap-1">
                    {visibleBrands.map((brand) => (
                        <span
                            key={brand}
                            className="flex items-center gap-2 text-sm">
                            <Car className="text-primary h-3.5 w-3.5" />
                            {separateWords(Brand[brand])}
                        </span>
                    ))}

                    {remainingBrands.length > 0 && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    className="text-primary hover:text-primary/80 w-fit text-xs font-medium underline underline-offset-2">
                                    +{remainingBrands.length} more
                                </button>
                            </TooltipTrigger>

                            <TooltipContent
                                side="top"
                                className="bg-primary text-primary-foreground scrollbar-hide max-h-52 w-36 overflow-y-auto p-3">
                                <div className="flex flex-col gap-2">
                                    {remainingBrands.map((brand) => (
                                        <div
                                            key={brand}
                                            className="flex items-center gap-2">
                                            <Car className="h-3.5 w-3.5 shrink-0" />
                                            <span>
                                                {separateWords(Brand[brand])}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
            );
        },
        enableSorting: false,
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;

            return (
                <Badge
                    size="sm"
                    className={cn(
                        DEALER_STATUS_COLORS[status]?.bg,
                        DEALER_STATUS_COLORS[status]?.text
                    )}>
                    {separateWords(DealerStatus[status])}
                </Badge>
            );
        },
        enableSorting: false,
    },

    {
        accessorKey: "createdAt",
        header: "Created On",
        cell: ({ row }) =>
            row.original.createdAt ? (
                <span className="text-muted-foreground text-sm">
                    {formatDate(row.original.createdAt)}
                </span>
            ) : (
                "—"
            ),
        enableSorting: false,
    },

    {
        id: "actions",
        header: () => <div className="flex justify-end">Action</div>,
        cell: ({ row }) => (
            <div className="flex items-center justify-end gap-3">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onAction("view", row.original)}
                            className="text-primary h-8 w-8">
                            <View className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>

                    <TooltipContent>View Dealer</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onAction("edit", row.original)}
                            className="text-primary h-8 w-8">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>

                    <TooltipContent>Edit Dealer</TooltipContent>
                </Tooltip>
            </div>
        ),
        enableSorting: false,
    },
];
