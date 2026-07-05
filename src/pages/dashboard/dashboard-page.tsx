import { FC, useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    Activity,
    ArrowUpRight,
    BookOpen,
    Github,
    LucideIcon,
    Settings,
    Users,
} from "lucide-react";
import { useNavigate } from "react-router";

import { UserRoles } from "@/types/types";
import { AuthedRoutes } from "@/constants/route-constants";
import PageWithHeaderFooter from "@/layouts/page-with-header-footer";
import useAuth from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.07 },
    },
};

const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

type QuickAction = {
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    path: string;
    allowedRoles?: UserRoles[];
    external?: boolean;
};

const allQuickActions: QuickAction[] = [
    {
        title: "User Management",
        description: "Manage users & roles",
        icon: Users,
        color: "text-blue-500",
        path: AuthedRoutes.users.index,
        allowedRoles: ["Platform Admin", "Merchant Owner"],
    },
    {
        title: "Settings",
        description: "Application configuration",
        icon: Settings,
        color: "text-emerald-500",
        path: "/settings",
        allowedRoles: ["Platform Admin"],
    },
];

const usefulLinks: QuickAction[] = [
    {
        title: "GitHub Repository",
        description: "View source code",
        icon: Github,
        color: "text-muted-foreground",
        path: "#",
        external: true,
    },
    {
        title: "React Router Docs",
        description: "v7 Data API",
        icon: BookOpen,
        color: "text-red-500",
        path: "https://reactrouter.com/",
        external: true,
    },
    {
        title: "TanStack Query",
        description: "Data fetching v5",
        icon: BookOpen,
        color: "text-orange-500",
        path: "https://tanstack.com/query",
        external: true,
    },
    {
        title: "Zustand",
        description: "State management v5",
        icon: BookOpen,
        color: "text-amber-600",
        path: "https://zustand-demo.pmnd.rs/",
        external: true,
    },
    {
        title: "MSW",
        description: "Mock Service Worker v2",
        icon: BookOpen,
        color: "text-orange-600",
        path: "https://mswjs.io/",
        external: true,
    },
    {
        title: "shadcn/ui",
        description: "UI Components",
        icon: BookOpen,
        color: "text-zinc-800 dark:text-zinc-200",
        path: "https://ui.shadcn.com/",
        external: true,
    },
    {
        title: "Tailwind CSS v4",
        description: "Utility-first CSS framework",
        icon: BookOpen,
        color: "text-cyan-500",
        path: "https://tailwindcss.com/",
        external: true,
    },
];

const upcomingFeatures = [
    { label: "Real-time analytics dashboard", icon: Activity },
];

const DashboardPage: FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const greeting = getGreeting();
    const firstName = user?.firstName ?? "there";

    const quickActions = useMemo(
        () =>
            allQuickActions.filter(
                (a) =>
                    !a.allowedRoles ||
                    (user?.role && a.allowedRoles.includes(user.role))
            ),
        [user?.role]
    );

    return (
        <PageWithHeaderFooter>
            <motion.div
                className="flex flex-col gap-8"
                variants={container}
                initial="hidden"
                animate="show">
                {/* Greeting */}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Test Credentials */}
                    <motion.div variants={item} className="lg:col-span-3">
                        <Card className="border-primary/20 bg-primary/5">
                            <CardHeader>
                                <CardTitle className="text-primary flex items-center gap-2">
                                    Test Credentials
                                    <Badge variant="flat" color="primary">
                                        MSW Store
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    Use these credentials to test different role
                                    accounts. The password for all accounts is{" "}
                                    <code>strong-password</code>.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="bg-background rounded border p-3">
                                        <div className="font-medium">Admin</div>
                                        <code className="text-muted-foreground text-xs">
                                            admin@template.com
                                        </code>
                                    </div>
                                    <div className="bg-background rounded border p-3">
                                        <div className="font-medium">
                                            Manager
                                        </div>
                                        <code className="text-muted-foreground text-xs">
                                            manager@template.com
                                        </code>
                                    </div>
                                    <div className="bg-background rounded border p-3">
                                        <div className="font-medium">
                                            Viewer
                                        </div>
                                        <code className="text-muted-foreground text-xs">
                                            viewer@template.com
                                        </code>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div variants={item} className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>
                                    Jump to frequently used sections
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {quickActions.map((action) => (
                                        <div
                                            key={action.title}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() =>
                                                navigate(action.path)
                                            }
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === "Enter" ||
                                                    e.key === " "
                                                )
                                                    navigate(action.path);
                                            }}
                                            className="bg-muted/50 hover:bg-muted group flex cursor-pointer items-center gap-4 rounded-lg p-4 transition-colors">
                                            <div className="bg-background rounded-lg border p-2.5 shadow-sm">
                                                <action.icon
                                                    className={cn(
                                                        "size-5",
                                                        action.color
                                                    )}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">
                                                    {action.title}
                                                </p>
                                                <p className="text-muted-foreground text-xs">
                                                    {action.description}
                                                </p>
                                            </div>
                                            <ArrowUpRight className="text-muted-foreground size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                                        </div>
                                    ))}
                                    {quickActions.length === 0 && (
                                        <div className="text-muted-foreground col-span-full rounded-lg border border-dashed py-8 text-center text-sm">
                                            No quick actions available for your
                                            role.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Upcoming Features */}
                    <motion.div variants={item}>
                        <Card className="h-full">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <CardTitle>Coming Soon</CardTitle>
                                    <Badge
                                        variant="flat"
                                        color="primary"
                                        size="sm"
                                        radius="full">
                                        Roadmap
                                    </Badge>
                                </div>
                                <CardDescription>
                                    Features we&apos;re building next
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-3">
                                    {upcomingFeatures.map((feature, i) => (
                                        <div key={feature.label}>
                                            <div className="flex items-center gap-3">
                                                <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full">
                                                    <feature.icon className="text-muted-foreground size-4" />
                                                </div>
                                                <span className="text-sm">
                                                    {feature.label}
                                                </span>
                                            </div>
                                            {i <
                                                upcomingFeatures.length - 1 && (
                                                <Separator className="mt-3" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Useful Links */}
                    <motion.div variants={item} className="lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Useful Links</CardTitle>
                                <CardDescription>
                                    Documentation for the tech stack
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {usefulLinks.map((action) => (
                                        <a
                                            key={action.title}
                                            href={action.path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-muted/50 hover:bg-muted group text-foreground flex cursor-pointer items-center gap-3 rounded-lg p-3 no-underline transition-colors">
                                            <div className="bg-background rounded-lg border p-2 shadow-sm">
                                                <action.icon
                                                    className={cn(
                                                        "size-4",
                                                        action.color
                                                    )}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">
                                                    {action.title}
                                                </p>
                                                <p className="text-muted-foreground line-clamp-1 text-xs">
                                                    {action.description}
                                                </p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </PageWithHeaderFooter>
    );
};

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

export default DashboardPage;
