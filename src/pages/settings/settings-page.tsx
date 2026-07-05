import { FC } from "react";
import PageWithHeaderFooter from "@/layouts/page-with-header-footer";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SettingsPage: FC = () => {
    return (
        <PageWithHeaderFooter>
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground text-sm">
                        Manage your application settings and configurations.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>General</CardTitle>
                            <CardDescription>
                                Basic application settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium">Application Name</h4>
                                    <p className="text-sm text-muted-foreground">Admin Portal</p>
                                </div>
                                <Separator />
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium">Timezone</h4>
                                    <p className="text-sm text-muted-foreground">UTC</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>
                                Security configurations
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium">Session Timeout</h4>
                                    <p className="text-sm text-muted-foreground">30 minutes</p>
                                </div>
                                <Separator />
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium">Require 2FA</h4>
                                    <p className="text-sm text-muted-foreground">Disabled</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageWithHeaderFooter>
    );
};

export default SettingsPage;
