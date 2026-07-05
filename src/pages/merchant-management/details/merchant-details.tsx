import { FC } from "react";
import { ArrowLeft } from "lucide-react";

import PageWithHeaderFooter, {
    PWHFHeaderActions,
} from "@/layouts/page-with-header-footer";
import FailedMessage from "@/components/failed-message";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DealerAddresses } from "./components/dealer-addresses";
import DealerAddressesUpdateDialog from "./components/dealer-addresses-update-dialog";
import { DealerContacts } from "./components/dealer-contacts";
import DealerContactsUpdateDialog from "./components/dealer-contacts-update-dialog";
import { DealerHours } from "./components/dealer-hours";
import DealerHoursUpdateDialog from "./components/dealer-hours-update-dialog";
import { DealerOverview } from "./components/dealer-overview";
import DealerDetailsPageSkeleton from "./components/details-page-skeleton";
import DealerUpdateDialog from "./components/dealer-update-dialog";
import { useMerchantDetails } from "./hooks/use-merchant-details";

type DealerDetailsProps = {};

const DealerDetailsPage: FC<DealerDetailsProps> = () => {
    const {
        dealer,
        isLoading,
        error,
        handleGoBack,
        // Basic info dialog
        isDealerInfoDialogOpen,
        handleDealerInfoOpen,
        handleDealerInfoClose,
        // Addresses dialog
        isDealerAddressesDialogOpen,
        handleAddressesOpen,
        handleAddressesClose,
        // Contacts dialog
        isDealerContactsDialogOpen,
        handleContactsOpen,
        handleContactsClose,
        // Business Hours dialog
        isDealerHoursDialogOpen,
        handleHoursOpen,
        handleHoursClose,
    } = useMerchantDetails();

    if (isLoading) return <DealerDetailsPageSkeleton />;

    if (error || !dealer) {
        return (
            <FailedMessage
                type="error"
                text={error?.message || "Failed to load dealer details"}
                grow
            />
        );
    }

    return (
        <PageWithHeaderFooter
            title="Dealer Details"
            description="Manage detailed information and settings for this dealer.">
            <PWHFHeaderActions>
                <Button
                    variant="outline"
                    onClick={handleGoBack}
                    className="gap-2"
                    size="sm">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
            </PWHFHeaderActions>

            <div className="flex flex-col gap-6">
                <DealerOverview dealer={dealer} onEdit={handleDealerInfoOpen} />

                <Tabs defaultValue="addresses" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 sm:w-100">
                        <TabsTrigger value="addresses">Addresses</TabsTrigger>
                        <TabsTrigger value="contacts">Contacts</TabsTrigger>
                        <TabsTrigger value="hours">Business Hours</TabsTrigger>
                    </TabsList>

                    <div className="mt-6">
                        <TabsContent
                            value="addresses"
                            className="m-0 focus-visible:ring-0 focus-visible:outline-none">
                            <DealerAddresses
                                addresses={dealer.addresses}
                                onEdit={handleAddressesOpen}
                            />
                        </TabsContent>
                        <TabsContent
                            value="contacts"
                            className="m-0 focus-visible:ring-0 focus-visible:outline-none">
                            <DealerContacts
                                contacts={dealer.contactPersons}
                                onEdit={handleContactsOpen}
                            />
                        </TabsContent>
                        <TabsContent
                            value="hours"
                            className="m-0 focus-visible:ring-0 focus-visible:outline-none">
                            <DealerHours
                                hours={dealer.departmentBusinessHours}
                                onEdit={handleHoursOpen}
                            />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>

            {/* Dialogs — each guarded by dealer presence + open state */}
            {dealer && isDealerInfoDialogOpen && (
                <DealerUpdateDialog
                    dealer={dealer}
                    open={isDealerInfoDialogOpen}
                    onClose={handleDealerInfoClose}
                />
            )}
            {dealer && isDealerAddressesDialogOpen && (
                <DealerAddressesUpdateDialog
                    dealer={dealer}
                    open={isDealerAddressesDialogOpen}
                    onClose={handleAddressesClose}
                />
            )}
            {dealer && isDealerContactsDialogOpen && (
                <DealerContactsUpdateDialog
                    dealer={dealer}
                    open={isDealerContactsDialogOpen}
                    onClose={handleContactsClose}
                />
            )}
            {dealer && isDealerHoursDialogOpen && (
                <DealerHoursUpdateDialog
                    dealer={dealer}
                    open={isDealerHoursDialogOpen}
                    onClose={handleHoursClose}
                />
            )}
        </PageWithHeaderFooter>
    );
};

export default DealerDetailsPage;
