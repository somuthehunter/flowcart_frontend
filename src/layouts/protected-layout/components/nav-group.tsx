import {
    PropsWithChildren,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { constructPath } from "@/lib/route-utils";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { NavLink } from "react-router";

import { RouteConfig } from "@/types/route-config";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
} from "@/components/ui/sidebar";

import useNavGroup from "../hooks/useNavGroup";

export interface NavGroupProps extends PropsWithChildren {
    item: RouteConfig;
    className?: string;
    basePath?: string;
    isParentL1?: boolean;
}

export const NavGroup = ({
    children,
    className,
    item,
    basePath,
    isParentL1,
}: NavGroupProps) => {
    const groupPath = constructPath(item.path, basePath);
    const {
        isExpanded,
        isCollapsed,
        handlePopOpen,
        isActive,
        changeExpansion,
    } = useNavGroup(item, groupPath);
    // Filter child routes that should be displayed
    // const filterRoutes = (routes: RouteConfig[]) =>
    //     routes?.filter((route) => !route.bypassDisplay) || [];

    // const childRoutes = filterRoutes(item.routes || []);

    // If sidebar is collapsed, show dropdown on hover
    if (isCollapsed) {
        return (
            <SidebarMenuItem className="mb-2 flex justify-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            tooltip={item.name}
                            className={cn(
                                "justify-center",
                                isActive &&
                                    "bg-sidebar-accent text-sidebar-accent-foreground",
                                className
                            )}>
                            {item.icon}
                            <span className="sr-only">{item.name}</span>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="right"
                        align="start"
                        className="min-w-50 cursor-pointer"
                        sideOffset={8}>
                        <div className="text-sidebar-foreground border-sidebar-border mb-1 border-b px-2 py-1.5 text-sm font-medium">
                            {item.name}
                        </div>
                        <div
                            className="space-y-1 p-1"
                            style={{ direction: "ltr" }}>
                            {children}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        );
    }
    // Normal expanded sidebar behavior for setting
    return (
        <SidebarMenuItem className="mb-2">
            <Collapsible
                className="group/collapsible cursor-pointer [&[data-state=open]>button>svg:last-child]:rotate-90"
                open={isExpanded}
                onOpenChange={changeExpansion}>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        className={cn(
                            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-3 cursor-pointer justify-between",
                            isActive &&
                                "bg-sidebar-accent text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                        )}>
                        <span className="flex items-center gap-2">
                            {item.icon}
                            {item.name}
                        </span>
                        <ChevronRight className="transition-transform" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1 pl-2">
                    <SidebarMenuSub className="space-y-1 pl-2">
                        {children}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    );
};
