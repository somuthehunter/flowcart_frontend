import React, { FC } from "react";
import { config } from "@/lib/config";
import { Outlet } from "react-router";

import { AdminRoutes } from "@/constants/route-constants";
import SideNavBar from "@/layouts/protected-layout/components/side-navbar";
import TopBar from "@/layouts/protected-layout/components/top-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { useAdminLayout } from "./hooks/use-admin-layout";

const adminSidebarVars = {
    "--sidebar": "#0f172a",
    "--sidebar-foreground": "#f8fafc",
    "--sidebar-primary": "#ea4e0a",
    "--sidebar-primary-foreground": "#ffffff",
    "--sidebar-accent": "#1e293b",
    "--sidebar-accent-foreground": "#f8fafc",
    "--sidebar-border": "#334155",
    "--sidebar-ring": "#ea4e0a",
} as React.CSSProperties;

const AdminLayout: FC = () => {
    const { routeConfigs, setMobileNavOpen, isMobileNavOpen, currentLocation } =
        useAdminLayout();

    return (
        <>
            <title>{`Admin | ${config.env.APP_TITLE}`}</title>
            <SidebarProvider style={adminSidebarVars}>
                <SideNavBar
                    onMobileClose={() => setMobileNavOpen(false)}
                    openMobileNav={isMobileNavOpen}
                    routes={routeConfigs}
                    basePath={currentLocation}
                    logoHref={AdminRoutes.dashboard}
                    portalBadge="Admin"
                />
                <SidebarInset className="flex min-w-0 flex-col">
                    <TopBar />
                    <Outlet />
                </SidebarInset>
            </SidebarProvider>
        </>
    );
};

export default AdminLayout;
