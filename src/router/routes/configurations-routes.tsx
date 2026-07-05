import { lazy } from "react";
import { defineAuthedRoute, suspendedComponent } from "@/lib/route-utils";
import {
    Bot,
    MessageCircleCode,
    MessageSquare,
    Plug,
    Radio,
    Settings,
    ToyBrick,
} from "lucide-react";

import { RouteConfig } from "@/types/route-config";
import { AuthedRoutes } from "@/constants/route-constants";

const SettingsPage = suspendedComponent(
    lazy(() => import("@/pages/settings"))
);
const WidgetPage = suspendedComponent(
    lazy(() => import("@/pages/wip"))
);
const AIAgentsPage = suspendedComponent(
    lazy(() => import("@/pages/wip"))
);
const ChannelsPage = suspendedComponent(
    lazy(() => import("@/pages/wip"))
);
const IntegrationsPage = suspendedComponent(
    lazy(() => import("@/pages/wip"))
);

export const configurationRoutes: RouteConfig[] = [
    defineAuthedRoute({
        name: "AI Agents",
        path: AuthedRoutes.configuration.aiAgents,
        icon: <Bot className="h-4 w-4" />,
        Component: AIAgentsPage,
        guard: { allowedRoles: ["Merchant Owner", "Platform Admin"] },
    }),
    defineAuthedRoute({
        name: "Channels",
        path: AuthedRoutes.configuration.channels,
        icon: <Radio className="h-4 w-4" />,
        Component: ChannelsPage,
        guard: { allowedRoles: ["Merchant Owner", "Platform Admin"] },
    }),
    defineAuthedRoute({
        name: "Widget & Forms",
        path: AuthedRoutes.configuration.widget,
        icon: <MessageCircleCode className="h-4 w-4" />,
        Component: WidgetPage,
        guard: { allowedRoles: ["Merchant Owner", "Platform Admin"] },
    }),
    defineAuthedRoute({
        name: "Integrations",
        path: AuthedRoutes.configuration.integrations,
        icon: <Plug className="h-4 w-4" />,
        Component: IntegrationsPage,
        guard: { allowedRoles: ["Merchant Owner", "Platform Admin"] },
    }),

    defineAuthedRoute({
        name: "Settings",
        path: AuthedRoutes.configuration.settings,
        icon: <Settings className="h-4 w-4" />,
        Component: SettingsPage,
        guard: { allowedRoles: ["Merchant Owner", "Platform Admin"] },
    }),
];
