import { FC } from "react";
import { Plus, Trash2, User, UserCheck } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { DealerDetails } from "@/types/response/dealer-response";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import {
    DealerContactsFormValues,
    useMerchantContactsUpdate,
} from "../hooks/use-merchant-contacts-update";

// ── Inner form component ──────────────────────────────────────────────────────

export const DealerContactsForm: FC<{
    fields: Record<"id", string>[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onSetUser: (index: number) => void;
}> = ({ fields, onAdd, onRemove, onSetUser }) => {
    const { control, getValues } = useFormContext<DealerContactsFormValues>();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">
                    {fields.length} contact{fields.length !== 1 ? "s" : ""}
                </p>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={onAdd}>
                    <Plus className="h-4 w-4" />
                    Add Contact
                </Button>
            </div>

            <FormField
                control={control}
                name="contactPersons"
                render={() => (
                    <FormItem>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="space-y-6">
                {fields.length === 0 && (
                    <div className="border-2 border-dashed rounded-xl bg-muted/10 flex flex-col items-center justify-center p-12">
                        <p className="text-muted-foreground mb-4">
                            No contact persons added yet.
                        </p>
                        <Button
                            type="button"
                            onClick={onAdd}
                            variant="outline"
                            className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Contact
                        </Button>
                    </div>
                )}

                {fields.map((item, index) => (
                    <Card key={item.id} className="relative overflow-hidden shadow-sm">
                        <div className="bg-muted/50 flex items-center justify-between border-b px-6 py-3">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <User className="text-primary h-4 w-4" />
                                Contact Person #{index + 1}
                                {getValues(`contactPersons.${index}.isUser`) && (
                                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                        <UserCheck className="h-3 w-3" />
                                        Primary User
                                    </span>
                                )}
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive h-8 w-8"
                                onClick={() => onRemove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <CardContent className="space-y-6 p-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* First Name */}
                                <FormField
                                    control={control}
                                    name={`contactPersons.${index}.firstName`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <label className="text-sm font-semibold">
                                                First Name{" "}
                                                <span className="text-destructive">*</span>
                                            </label>
                                            <FormControl>
                                                <Input
                                                    placeholder="John"
                                                    value={field.value ?? ""}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Last Name */}
                                <FormField
                                    control={control}
                                    name={`contactPersons.${index}.lastName`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <label className="text-sm font-semibold">
                                                Last Name{" "}
                                                <span className="text-destructive">*</span>
                                            </label>
                                            <FormControl>
                                                <Input
                                                    placeholder="Doe"
                                                    value={field.value ?? ""}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Email */}
                                <FormField
                                    control={control}
                                    name={`contactPersons.${index}.email`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <label className="text-sm font-semibold">
                                                Email{" "}
                                                <span className="text-destructive">*</span>
                                            </label>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="john.doe@example.com"
                                                    value={field.value ?? ""}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Phone */}
                                <FormField
                                    control={control}
                                    name={`contactPersons.${index}.phone`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <label className="text-sm font-semibold">
                                                Phone{" "}
                                                <span className="text-destructive">*</span>
                                            </label>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. 1234567890"
                                                    maxLength={10}
                                                    value={field.value ?? ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, "");
                                                        field.onChange(val);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Designation */}
                                <FormField
                                    control={control}
                                    name={`contactPersons.${index}.designation`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5 md:col-span-2">
                                            <label className="text-sm font-semibold">
                                                Designation
                                            </label>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. Sales Manager"
                                                    value={field.value ?? ""}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Primary login user toggle */}
                            <FormField
                                control={control}
                                name={`contactPersons.${index}.isUser`}
                                render={({ field }) => (
                                    <FormItem className="bg-muted/20 flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                        <div className="space-y-0.5">
                                            <label className="text-sm font-semibold">
                                                Primary Login User
                                            </label>
                                            <p className="text-muted-foreground text-xs">
                                                Grant portal login access to this contact
                                            </p>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        onSetUser(index);
                                                    } else {
                                                        field.onChange(false);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

// ── Dialog ────────────────────────────────────────────────────────────────────

type DealerContactsUpdateDialogProps = {
    dealer: DealerDetails;
    open: boolean;
    onClose: () => void;
};

const DealerContactsUpdateDialog: FC<DealerContactsUpdateDialogProps> = ({
    dealer,
    open,
    onClose,
}) => {
    const { form, onSubmit, isPending, contacts } = useMerchantContactsUpdate(
        dealer,
        onClose
    );

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit Contact Persons</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={onSubmit} className="space-y-6">
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
            </DialogContent>
        </Dialog>
    );
};

export default DealerContactsUpdateDialog;
