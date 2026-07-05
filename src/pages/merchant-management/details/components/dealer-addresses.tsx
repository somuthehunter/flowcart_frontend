import { FC } from "react";
import { MapPin, Pencil } from "lucide-react";

import { AddressType, DealerAddress } from "@/types/response/dealer-response";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DealerAddressesProps = {
    addresses: DealerAddress[];
    onEdit?: () => void;
};

export const DealerAddresses: FC<DealerAddressesProps> = ({
    addresses,
    onEdit,
}) => {
    if (!addresses || addresses.length === 0) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Addresses</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onEdit}
                        className="gap-2">
                        <Pencil className="h-4 w-4" />
                        Edit Addresses
                    </Button>
                </CardHeader>
                <CardContent className="text-muted-foreground flex items-center justify-center py-8 text-sm">
                    No addresses registered for this dealer.
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Registered Addresses</h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onEdit}
                    className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit Addresses
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {addresses.map((address) => (
                    <Card
                        key={address.addressId}
                        className="relative overflow-hidden">
                        {address.isPrimary && (
                            <div className="bg-primary absolute top-0 left-0 h-full w-1.5" />
                        )}
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <MapPin className="text-primary h-5 w-5" />
                                    <CardTitle className="text-base">
                                        {AddressType[address.addressType]}
                                    </CardTitle>
                                </div>
                                {address.isPrimary && (
                                    <Badge
                                        variant="flat"
                                        color="primary"
                                        size="sm"
                                        className="text-[12px]">
                                        Primary
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-muted-foreground flex flex-col gap-1 text-sm">
                                <p className="text-foreground font-medium">
                                    {address.addressLine || "No Address Line"}
                                </p>
                                <p>
                                    {address.state && `${address.state}, `}
                                    {address.zipcode && `${address.zipcode}`}
                                </p>
                                <p>{address.country}</p>

                                {(address.latitude || address.longitude) && (
                                    <p className="mt-2 text-xs opacity-70">
                                        GPS: {address.latitude},{" "}
                                        {address.longitude}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
