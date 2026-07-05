import { FC } from "react";
import { config } from "@/lib/config";
import { Outlet } from "react-router";

import SideNavBar from "@/layouts/protected-layout/components/side-navbar";
import TopBar from "@/layouts/protected-layout/components/top-bar";
import { useMerchantLayout } from "@/layouts/protected-layout/hooks/useMerchantLayout";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const MerchantLayout: FC = () => {
    const { routeConfigs, setMobileNavOpen, isMobileNavOpen, currentLocation } =
        useMerchantLayout();

    return (
        <>
            <title>{`${config.env.APP_TITLE}`}</title>
            <SidebarProvider>
                <SideNavBar
                    onMobileClose={() => setMobileNavOpen(false)}
                    openMobileNav={isMobileNavOpen}
                    routes={routeConfigs}
                    basePath={currentLocation}
                />
                <SidebarInset className="flex min-w-0 flex-col">
                    <TopBar />
                    <Outlet />
                </SidebarInset>
            </SidebarProvider>
        </>
    );
};

export default MerchantLayout;
