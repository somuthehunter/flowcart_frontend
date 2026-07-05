"use client";

import { getRole } from "@/lib/object-utils";
import {
    //   BadgeCheck,
    //   Bell,
    Check,
    ChevronsUpDown,
    //   CreditCard,
    Laptop,
    LogOut,
    Moon,
    //   Sparkles,
    Sun,
    User,
    Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { NavLink } from "react-router";

import { AuthedRoutes } from "@/constants/route-constants";
import useAuth from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

export function NavUser() {
    const { user, signOut } = useAuth();

    const handleLogout = () => {
        signOut();
    };

    const getName = () =>
        user?.firstName && user?.lastName
            ? `${user?.firstName} ${user?.lastName}`
            : user?.firstName
              ? user?.firstName
              : "unknown";

    const avatar =
        user?.firstName && user?.lastName
            ? `${user.firstName.trim()[0]?.toUpperCase() ?? ""}${
                  user.lastName.trim()[0]?.toUpperCase() ?? ""
              }`
            : (user?.firstName
                  ?.trim()
                  ?.split(/\s+/)
                  ?.map((n) => n[0]?.toUpperCase())
                  ?.join("") ?? "");

    const { isMobile } = useSidebar();
    const { setTheme, theme } = useTheme();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer">
                            <Avatar className="h-8 w-8 rounded-lg">
                                {/* <AvatarImage src={avatar} alt={user?.name ?? ""} /> */}
                                <AvatarFallback className="bg-primary text-primary-foreground rounded-lg font-semibold">
                                    {avatar ?? "O"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-bold">
                                    {getName()}
                                </span>
                                <span className="truncate text-xs">
                                    {user?.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}>
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    {/* <AvatarImage src={avatar} alt={user?.name ?? ""} /> */}
                                    <AvatarFallback className="bg-primary text-primary-foreground rounded-lg font-semibold">
                                        {avatar ?? "O"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-bold">
                                        {getName()}
                                    </span>
                                    <span className="truncate text-xs font-medium">
                                        Role: {getRole(user?.role)}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user?.email ?? ""}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <NavLink to={AuthedRoutes.account}>
                                    <User />
                                    Account
                                </NavLink>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup className="space-y-1">
                            <DropdownMenuItem
                                className={
                                    theme === "light"
                                        ? "bg-accent text-accent-foreground"
                                        : ""
                                }
                                onClick={() => setTheme("light")}>
                                <Sun />
                                Light
                                {theme === "light" && (
                                    <Check className="ml-auto size-4" />
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className={
                                    theme === "dark"
                                        ? "bg-accent text-accent-foreground"
                                        : ""
                                }
                                onClick={() => setTheme("dark")}>
                                <Moon />
                                Dark
                                {theme === "dark" && (
                                    <Check className="ml-auto size-4" />
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className={
                                    theme === "system"
                                        ? "bg-accent text-accent-foreground"
                                        : ""
                                }
                                onClick={() => setTheme("system")}>
                                <Laptop />
                                System
                                {theme === "system" && (
                                    <Check className="ml-auto size-4" />
                                )}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
