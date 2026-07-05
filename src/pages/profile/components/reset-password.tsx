import { FC } from "react";
import ChangePasswordForm from "@/pages/profile/components/change-password-form";
import { KeyRound } from "lucide-react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordian";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export const ResetPassword: FC = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                    Manage your password and security preferences
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="change-password">
                        <AccordionTrigger className="flex items-center gap-2">
                            <div className="flex items-center gap-3">
                                <div className="bg-card-foreground/5 flex h-10 w-10 items-center justify-center rounded-full">
                                    <KeyRound className="text-muted-foreground h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium">
                                        Change Password
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        Update your account password
                                    </p>
                                </div>
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className="pt-4">
                            <ChangePasswordForm />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
};
