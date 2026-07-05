import { UserDetails, UserStatus, UserType } from "@/types/response/user-response";
import { useUserAdd } from "../hooks/use-user-add";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEnumEntries } from "@/lib/object-utils";
import { AppPhoneNumberInput } from "@/components/form/input-elements/app-phone-number-input";

interface UserAddDialogProps {
    user?: UserDetails;
    isOpen: boolean;
    onClose: () => void;
}

export const UserAddDialog = (props: UserAddDialogProps) => {
    const { 
        form, 
        roleSuggestions, 
        isLoadingRoles, 
        isPending, 
        onSubmit, 
        handleClose 
    } = useUserAdd(props);

    const isEdit = !!props.user;

    return (
        <Dialog open={props.isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit User" : "Create New User"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Update user profile and access levels." : "Add a new user to the system."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="John" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <AppPhoneNumberInput
                                name="phone"
                                label="Phone"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>

                        {!isEdit && (
                            <div className="grid grid-cols-1 gap-4">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="••••••••" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="roleId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role <span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingRoles}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={isLoadingRoles ? "Loading roles..." : "Select role"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {roleSuggestions.map((role) => (
                                                    <SelectItem key={role.roleId} value={role.roleId}>
                                                        {role.roleName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Saving..." : "Save User"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
