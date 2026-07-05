import * as React from "react";
import { useMemo } from "react";
import { getRoleHome } from "@/lib/route-utils";
import { cn } from "@/lib/utils";
import { Bell, ChevronRight, Search } from "lucide-react";
import { NavLink, useMatches } from "react-router";

import useAuth from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const mockNotifications = [
    {
        id: 1,
        title: "New lead captured",
        message: "James Wilson via Voice",
        time: "5 min ago",
        unread: true,
    },
    {
        id: 2,
        title: "AI escalation",
        message: "Customer requested human agent",
        time: "12 min ago",
        unread: true,
    },
    {
        id: 3,
        title: "Appointment booked",
        message: "Test drive scheduled for tomorrow",
        time: "1 hour ago",
        unread: false,
    },
    {
        id: 4,
        title: "Integration sync complete",
        message: "CDK inventory updated",
        time: "2 hours ago",
        unread: false,
    },
];

export interface TopBarProps {
    className?: string;
}

const TopBar: React.FC<TopBarProps> = ({ className }) => {
    const matches = useMatches();
    const { user } = useAuth();
    const homeHref = user ? getRoleHome(user.role) : "/";
    const crumbs = useMemo(
        () =>
            matches
                .filter((m) => (m.handle as { crumb?: string })?.crumb)
                .map((m) => ({
                    label: (m.handle as { crumb: string }).crumb,
                    pathname: m.pathname,
                })),
        [matches]
    );
    const unreadCount = mockNotifications.filter((n) => n.unread).length;

    return (
        <header
            className={cn(
                "bg-background sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b px-6",
                className
            )}>
            {/* Left: sidebar trigger + breadcrumbs */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 md:hidden" />
                <Separator
                    orientation="vertical"
                    className="mr-2 h-4 md:hidden"
                />
                <nav className="flex items-center gap-1 text-sm">
                    <NavLink
                        to={homeHref}
                        className="text-muted-foreground hover:text-foreground">
                        Home
                    </NavLink>
                    {crumbs.map((crumb, index) => (
                        <span
                            key={crumb.pathname}
                            className="flex items-center gap-1">
                            <ChevronRight className="text-muted-foreground h-4 w-4" />
                            {index === crumbs.length - 1 ? (
                                <span className="text-foreground font-medium">
                                    {crumb.label}
                                </span>
                            ) : (
                                <NavLink
                                    to={crumb.pathname}
                                    className="text-muted-foreground hover:text-foreground">
                                    {crumb.label}
                                </NavLink>
                            )}
                        </span>
                    ))}
                </nav>
            </div>

            {/* Right: search + notifications */}
            <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input placeholder="Search..." className="w-64 pl-9" />
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative">
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <Badge className="bg-accent text-accent-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
                                    {unreadCount}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel className="flex items-center justify-between">
                            Notifications
                            {unreadCount > 0 && (
                                <Badge variant="bordered" className="text-xs">
                                    {unreadCount} new
                                </Badge>
                            )}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {mockNotifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className="flex flex-col items-start gap-1 p-3">
                                <div className="flex w-full items-start justify-between">
                                    <span className="font-medium">
                                        {notification.title}
                                    </span>
                                    {notification.unread && (
                                        <span className="bg-primary h-2 w-2 rounded-full" />
                                    )}
                                </div>
                                <span className="text-muted-foreground text-sm">
                                    {notification.message}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                    {notification.time}
                                </span>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-primary justify-center">
                            View all notifications
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default TopBar;
