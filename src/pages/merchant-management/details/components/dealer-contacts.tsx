import { FC } from "react";
import { Mail, Phone, UserCircle2, Pencil } from "lucide-react";

import { DealerContactPerson } from "@/types/response/dealer-response";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type DealerContactsProps = {
    contacts: DealerContactPerson[];
    onEdit?: () => void;
};

export const DealerContacts: FC<DealerContactsProps> = ({ contacts, onEdit }) => {
    if (!contacts || contacts.length === 0) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Contact Persons</CardTitle>
                    <Button variant="outline" size="sm" onClick={onEdit} className="gap-2">
                        <Pencil className="h-4 w-4" />
                        Edit Contacts
                    </Button>
                </CardHeader>
                <CardContent className="text-muted-foreground flex items-center justify-center py-8 text-sm">
                    No contact persons registered for this dealer.
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Contact Persons</h3>
                <Button variant="outline" size="sm" onClick={onEdit} className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit Contacts
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {contacts.map((contact) => (
                    <Card key={contact.contactId}>
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        {contact.firstName?.[0] || ""}{contact.lastName?.[0] || ""}
                                        {(!contact.firstName && !contact.lastName) && <UserCircle2 className="h-6 w-6" />}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <CardTitle className="text-base">
                                        {contact.firstName} {contact.lastName}
                                    </CardTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-muted-foreground text-xs font-medium">
                                            {contact.designation || "No Designation"}
                                        </p>
                                        {contact.isUser && (
                                            <Badge variant="flat" className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                System User
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Mail className="text-muted-foreground h-4 w-4" />
                                    <a href={`mailto:${contact.email}`} className="hover:underline">
                                        {contact.email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="text-muted-foreground h-4 w-4" />
                                    {contact.phone ? (
                                        <a href={`tel:${contact.phone}`} className="hover:underline">
                                            {contact.phone}
                                        </a>
                                    ) : (
                                        <span className="text-muted-foreground">N/A</span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
