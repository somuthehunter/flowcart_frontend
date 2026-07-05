"use client";

import { getRole } from "@/lib/object-utils";
import { Laptop, LogOut, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { NavLink } from "react-router";

import { AuthedRoutes } from "@/constants/route-constants";
import useAuth from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";

export function TopBarUser() {
    const { user } = useAuth();
    const { signOut } = useAuth();
    const getName = () =>
        user?.lastName
            ? `${user?.firstName} ${user?.lastName}`
            : user?.firstName;
    const avatar =
        user?.firstName && user?.lastName
            ? `${user.firstName.trim()[0]?.toUpperCase() ?? ""}${
                  user.lastName.trim()[0]?.toUpperCase() ?? ""
              }`
            : (user?.firstName
                  ?.trim()
                  ?.split(/\s+/)
                  ?.map((n: string) => n[0]?.toUpperCase())
                  ?.join("") ?? "");

    const { isMobile } = useSidebar();
    const { setTheme, theme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant={"ghost"}
                    // className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <Avatar className="h-8 w-8 rounded-lg">
                        {/* <AvatarImage src={avatar} alt={user?.name ?? ""} /> */}
                        <AvatarFallback className="rounded-lg">
                            {avatar ?? "O"}
                        </AvatarFallback>
                    </Avatar>
                    {/* <ChevronsUpDown className="ml-auto size-4" /> */}
                </Button>
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
                            <AvatarFallback className="rounded-lg">
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
                        className={theme === "light" ? "bg-muted" : ""}
                        onClick={() => setTheme("light")}>
                        <Sun /> Light
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className={theme === "dark" ? "bg-muted" : ""}
                        onClick={() => setTheme("dark")}>
                        <Moon /> Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className={theme === "system" ? "bg-muted" : ""}
                        onClick={() => setTheme("system")}>
                        <Laptop /> System
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                    <LogOut />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
