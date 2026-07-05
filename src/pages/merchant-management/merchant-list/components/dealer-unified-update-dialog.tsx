import { FC } from "react";

import { DealerDetails } from "@/types/response/dealer-response";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DealerAddressesForm } from "../../details/components/dealer-addresses-update-dialog";
import { DealerContactsForm } from "../../details/components/dealer-contacts-update-dialog";
import { DealerHoursForm } from "../../details/components/dealer-hours-update-dialog";
import { DealerBasicInfoForm } from "../../details/components/dealer-update-dialog";
import { useMerchantAddressesUpdate } from "../../details/hooks/use-merchant-addresses-update";
import { useMerchantContactsUpdate } from "../../details/hooks/use-merchant-contacts-update";
import { useMerchantHoursUpdate } from "../../details/hooks/use-merchant-hours-update";
import { useMerchantUpdate } from "../../details/hooks/use-merchant-update";

type DealerUnifiedUpdateDialogProps = {
    dealer: DealerDetails | null;
    open: boolean;
    onClose: () => void;
};

const BasicInfoTab: FC<{ dealer: DealerDetails; onClose: () => void }> = ({
    dealer,
    onClose,
}) => {
    const { form, onSubmit, isPending, dealershipTypeOptions, brandOptions } =
        useMerchantUpdate(dealer, onClose);
    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6 pt-4">
                <DealerBasicInfoForm
                    dealershipTypeOptions={dealershipTypeOptions}
                    brandOptions={brandOptions}
                />
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isPending}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
};

const AddressesTab: FC<{ dealer: DealerDetails; onClose: () => void }> = ({
    dealer,
    onClose,
}) => {
    const { form, onSubmit, isPending, addresses, addressTypeOptions } =
        useMerchantAddressesUpdate(dealer, onClose);
    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6 pt-4">
                <DealerAddressesForm
                    fields={addresses.fields}
                    onAdd={addresses.onAdd}
                    onRemove={addresses.onRemove}
                    onSetPrimary={addresses.onSetPrimary}
                    onCopyToAll={addresses.onCopyToAll}
                    addressTypeOptions={addressTypeOptions}
                />
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isPending}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
};

const ContactsTab: FC<{ dealer: DealerDetails; onClose: () => void }> = ({
    dealer,
    onClose,
}) => {
    const { form, onSubmit, isPending, contacts } = useMerchantContactsUpdate(
        dealer,
        onClose
    );
    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6 pt-4">
                <DealerContactsForm
                    fields={contacts.fields}
                    onAdd={contacts.onAdd}
                    onRemove={contacts.onRemove}
                    onSetUser={contacts.onSetUser}
                />
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isPending}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
};

const HoursTab: FC<{ dealer: DealerDetails; onClose: () => void }> = ({
    dealer,
    onClose,
}) => {
    const { form, onSubmit, isPending, businessHours, timezoneOptions } =
        useMerchantHoursUpdate(dealer, onClose);
    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6 pt-4">
                <DealerHoursForm
                    fields={businessHours.fields}
                    onAdd={businessHours.onAdd}
                    onRemove={businessHours.onRemove}
                    onDayToggle={businessHours.onDayToggle}
                    timezoneOptions={timezoneOptions}
                />
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isPending}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
};

export const DealerUnifiedUpdateDialog: FC<DealerUnifiedUpdateDialogProps> = ({
    dealer,
    open,
    onClose,
}) => {
    if (!dealer) return null;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Edit Dealer: {dealer.companyName}</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="addresses">Addresses</TabsTrigger>
                        <TabsTrigger value="contacts">Contacts</TabsTrigger>
                        <TabsTrigger value="hours">Business Hours</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic">
                        <BasicInfoTab dealer={dealer} onClose={onClose} />
                    </TabsContent>
                    <TabsContent value="addresses">
                        <AddressesTab dealer={dealer} onClose={onClose} />
                    </TabsContent>
                    <TabsContent value="contacts">
                        <ContactsTab dealer={dealer} onClose={onClose} />
                    </TabsContent>
                    <TabsContent value="hours">
                        <HoursTab dealer={dealer} onClose={onClose} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
