import {
    defineAuthedRoute,
    defineInvisibleRoute,
    defineLayoutRoute,
    definePublicRoute,
} from "@/lib/route-utils";

import { RouteConfig } from "@/types/route-config";
import ProtectedLayout from "@/layouts/protected-layout";
import PublicLayout from "@/layouts/public-layout";
import RootLayout from "@/layouts/root";
import RootRedirect from "@/components/root-redirect";

import { protectedRoutes } from "./protected-routes";
import { publicRoutes } from "./public-routes";

const getInternalRoutes = (internalRoutes?: RouteConfig[]): RouteConfig[] => [
    defineLayoutRoute({
        Component: RootLayout,
        routes: [
            defineInvisibleRoute(
                defineAuthedRoute({
                    name: "redirect",
                    path: "/",
                    element: <RootRedirect />,
                })
            ),

            defineLayoutRoute({
                Component: PublicLayout,
                routes: publicRoutes,
            }),

            defineLayoutRoute({
                Component: ProtectedLayout,
                routes: internalRoutes || [],
            }),

            definePublicRoute(
                defineInvisibleRoute({
                    name: "Page Not Found",
                    path: "*",
                    element: <RootRedirect />,
                })
            ),
        ],
    }),
];

export const guardlessRoutesConfig: RouteConfig[] = getInternalRoutes();

export const routesConfig: RouteConfig[] = getInternalRoutes(protectedRoutes);
