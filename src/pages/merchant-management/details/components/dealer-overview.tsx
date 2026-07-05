import { FC } from "react";
import { separateWords } from "@/lib/object-utils";
import { Globe, Mail, Pencil, Phone } from "lucide-react";

import {
    Brand,
    DealerDetails,
    DealershipType,
    DealerStatus,
} from "@/types/response/dealer-response";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type DealerOverviewProps = {
    dealer: DealerDetails;
    onEdit?: () => void;
};

export const DealerOverview: FC<DealerOverviewProps> = ({ dealer, onEdit }) => {
    const statusColor =
        dealer.status === DealerStatus.Active
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : dealer.status === DealerStatus.PendingActivation
              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

    const initials = dealer.companyName.substring(0, 2).toUpperCase();

    const brands = dealer.brand || [];
    const visibleBrands = brands.slice(0, 10);
    const hiddenBrands = brands.slice(10);

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border">
                        <AvatarImage
                            src={dealer.dealerLogoUrl || undefined}
                            alt={dealer.companyName}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">
                                {dealer.companyName}
                            </CardTitle>
                            <Badge variant="flat" className={statusColor}>
                                {DealerStatus[dealer.status]}
                            </Badge>
                        </div>
                        {dealer.dealerCode && (
                            <p className="text-muted-foreground text-sm">
                                Dealer code: {dealer.dealerCode}
                            </p>
                        )}
                        {dealer.ownerName && (
                            <p className="text-muted-foreground text-sm">
                                Owner: {dealer.ownerName}
                            </p>
                        )}
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onEdit}
                    className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit Basic Info
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                            <Mail className="text-primary h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-muted-foreground text-xs font-medium uppercase">
                                Email
                            </p>
                            <p className="truncate text-sm font-medium">
                                {dealer.primaryEmail}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                            <Phone className="text-primary h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-muted-foreground text-xs font-medium uppercase">
                                Phone
                            </p>
                            <p className="truncate text-sm font-medium">
                                {dealer.phone}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                            <Globe className="text-primary h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-muted-foreground text-xs font-medium uppercase">
                                Website
                            </p>
                            <p className="truncate text-sm font-medium">
                                {dealer.website ? (
                                    <a
                                        href={dealer.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:underline">
                                        {dealer.website}
                                    </a>
                                ) : (
                                    "N/A"
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-6 border-t pt-6 md:flex-row">
                    {/* Dealership Type */}
                    <div className="flex-1 md:basis-1/2">
                        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                            Dealership Type
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {dealer.dealershipType?.map((type) => (
                                <Badge
                                    key={type}
                                    variant="flat"
                                    className="rounded-full">
                                    {/* {getEnumLabel(DealershipType, type)} */}
                                    {separateWords(DealershipType[type])}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Brands */}
                    <div className="flex-1 md:basis-1/2">
                        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                            Brands
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {visibleBrands.map((brand) => (
                                <Badge
                                    key={brand}
                                    size="sm"
                                    variant="flat"
                                    className="bg-primary/20 inline-flex h-8 items-center gap-1.5 rounded-full px-3 whitespace-nowrap">
                                    <span>{Brand[brand]}</span>
                                </Badge>
                            ))}

                            {hiddenBrands.length > 0 && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge
                                            variant="flat"
                                            className="h-8 cursor-pointer rounded-full px-3">
                                            +{hiddenBrands.length}
                                        </Badge>
                                    </TooltipTrigger>

                                    <TooltipContent
                                        side="bottom"
                                        className="bg-primary max-w-sm rounded-xl p-3">
                                        <div className="scrollbar-hide flex h-80 max-w-50 flex-wrap gap-2 overflow-y-scroll">
                                            {hiddenBrands.map((brand) => (
                                                <Badge
                                                    key={brand}
                                                    variant="flat"
                                                    size="sm"
                                                    className="bg-primary-foreground/20 inline-flex h-8 items-center gap-1.5 rounded-full px-3 whitespace-nowrap">
                                                    <span className="text-primary-foreground">
                                                        {/* {getEnumLabel(
                                                            Brand,
                                                            brand
                                                        )} */}
                                                        {Brand[brand]}
                                                    </span>
                                                </Badge>
                                            ))}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
