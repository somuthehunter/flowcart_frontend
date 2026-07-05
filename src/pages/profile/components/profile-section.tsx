import { ReactNode } from "react";
import { getNameInitials, getRole } from "@/lib/object-utils";
import { Edit2, LucideIcon, Mail, Phone, Save, User, X } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { useProfileSection } from "../hooks/use-profile-section";

const ProfileSection = () => {
    const {
        user,
        form,
        isEditing,
        startEdit,
        cancelEdit,
        submitProfile,
        isSaving,
    } = useProfileSection();

    if (!user) return null;

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-20 w-20 text-2xl">
                        <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                            {getNameInitials(
                                `${user.firstName ?? ""} ${user.lastName ?? ""}`,
                                true
                            )}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <CardTitle className="text-2xl">
                            {user.firstName} {user.lastName}
                        </CardTitle>
                        <CardDescription className="mt-1">
                            {user.role && <Badge>{getRole(user.role)}</Badge>}
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader className="flex items-center justify-between">
                    <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                            Update your personal details
                        </CardDescription>
                    </div>

                    {!isEditing && (
                        <Button size="sm" variant="outline" onClick={startEdit}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    )}
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(submitProfile)}
                            className="space-y-6">
                            {!isEditing ? (
                                <div className="space-y-4">
                                    <InfoRow icon={User} label="Full Name">
                                        {user.firstName} {user.lastName}
                                    </InfoRow>

                                    <Separator />

                                    <InfoRow icon={Mail} label="Email">
                                        {user.email}
                                    </InfoRow>

                                    <Separator />

                                    <InfoRow icon={Phone} label="Phone Number">
                                        {user.phoneNumber || "Not provided"}
                                    </InfoRow>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        First Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
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
                                                    <FormLabel>
                                                        Last Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Phone Number
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            type="submit"
                                            disabled={isSaving}>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={cancelEdit}
                                            type="button">
                                            <X className="mr-2 h-4 w-4" />
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfileSection;
type InfoRowProps = {
    icon: LucideIcon;
    label: string;
    children: ReactNode;
};
const InfoRow = ({ icon: Icon, label, children }: InfoRowProps) => (
    <div className="flex gap-3">
        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
            <Icon className="text-muted-foreground h-5 w-5" />
        </div>
        <div>
            <p className="text-muted-foreground text-sm">{label}</p>
            <p className="font-medium">{children}</p>
        </div>
    </div>
);
