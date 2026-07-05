import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router";

import { RouteConfig } from "@/types/route-config";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

import useNavItem from "../hooks/useNavItem";

export interface NavItemProps extends PropsWithChildren {
    item: RouteConfig;
    className?: string;
    basePath?: string;
    isParentL1?: boolean;
}

export const NavItem = ({
    children,
    className,
    item,
    basePath,
    isParentL1,
}: NavItemProps) => {
    const { isActive, isCollapsed } = useNavItem(item, basePath || "");
    const { isMobile, setOpenMobile } = useSidebar();

    const handleClick = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    if (isCollapsed && !isParentL1)
        return (
            <DropdownMenuItem
                asChild
                className={cn(
                    "cursor-pointer p-0",
                    "focus:bg-sidebar-accent focus:text-sidebar-accent-foreground",
                    isActive &&
                        "focus:bg-sidebar-primary focus:text-sidebar-primary-foreground"
                )}>
                <NavLink
                    to={basePath || ""}
                    onClick={handleClick}
                    className={cn(
                        "text-sidebar-foreground [&>svg]:text-sidebar-foreground! flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm",
                        "hover:bg-sidebar-accent hover:-sidebar-accent-foreground hover:[&>svg]:text-sidebar-accent-foreground!",
                        isActive &&
                            "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground [&>svg]:text-sidebar-primary-foreground! hover:[&>svg]:text-sidebar-primary-foreground!"
                    )}>
                    {item.icon}
                    <span>{item.name}</span>
                </NavLink>
            </DropdownMenuItem>
        );

    return (
        <SidebarMenuItem
            className={cn(isParentL1 ? "mb-2" : "nav-sub-item-spacing")}>
            <NavLink
                to={basePath || ""}
                onClick={handleClick}
                className="flex group-data-[collapsible=icon]:justify-center">
                <SidebarMenuButton
                    className={cn(
                        "flex w-full cursor-pointer items-center gap-2",
                        !isParentL1 && "ml-2 h-8 py-1 text-sm",
                        !isActive &&
                            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isActive &&
                            "bg-sidebar-primary text-sidebar-primary-foreground shadow-sidebar-primary/20 data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground shadow-lg",
                        className
                    )}
                    isActive={isActive}
                    tooltip={isCollapsed ? item.name : undefined}>
                    {isCollapsed ? (
                        <>
                            {item.icon}
                            <span className="sr-only">{item.name}</span>
                        </>
                    ) : (
                        children
                    )}
                </SidebarMenuButton>
            </NavLink>
        </SidebarMenuItem>
    );
};
