import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { RouteConfig } from "@/types/route-config";
import Scrollable from "@/components/scrollable";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    useSidebar,
} from "@/components/ui/sidebar";

import BrandLogo from "./brand-logo";
import NavTree from "./nav-tree";
import { NavUser } from "./nav-user";

export interface SideNavBarProps {
    onMobileClose: () => void;
    openMobileNav: boolean;
    routes: RouteConfig[];
    basePath: string;
    logoHref?: string;
    portalBadge?: string;
}

const SideNavBar: React.FC<SideNavBarProps> = (props: SideNavBarProps) => {
    const { routes, logoHref, portalBadge } = props;
    const { state, toggleSidebar } = useSidebar();
    const isCollapsed = state === "collapsed";

    const content = (
        <Scrollable
            className="mt-2 overflow-x-hidden"
            direction={{ parent: "rtl", child: "ltr" }}>
            <NavTree routes={routes} basePath={props.basePath} l1Route />
        </Scrollable>
    );
    return (
        <Sidebar
            variant="inset"
            collapsible="icon"
            className="z-50 overflow-visible border-r">
            <SidebarHeader
                className={cn(
                    "group relative flex items-center justify-center overflow-visible transition-all duration-200 ease-out will-change-transform",
                    isCollapsed && "px-2"
                )}>
                <BrandLogo
                    minimal={isCollapsed}
                    href={logoHref}
                    badge={portalBadge}
                />
            </SidebarHeader>

            {/* Floating Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="border-sidebar-primary/50 bg-sidebar text-sidebar-primary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-6 -right-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border shadow-md transition-all">
                {isCollapsed ? (
                    <ChevronRight className="h-5 w-5" />
                ) : (
                    <ChevronLeft className="h-5 w-5" />
                )}
            </button>

            <SidebarContent
                className={cn(
                    "overflow-x-hidden transition-all duration-200 ease-out will-change-scroll"
                )}>
                <SidebarMenu>{content}</SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="transition-all duration-200 ease-out">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
};

export default SideNavBar;
