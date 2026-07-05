import React from "react";
import { Navigate, redirect } from "react-router";

import { RouteConfig } from "@/types/route-config";
import { RouteGuard } from "@/types/route-guard";
import { UserRoles } from "@/types/types";
import { UserScopes } from "@/types/user-scopes";
import { AdminRoutes, AuthedRoutes } from "@/constants/route-constants";
import { SuspendedPage } from "@/components/suspended-page";

import { evaluate } from "./bool-utils";

type UtilAuthRouteConfig = Omit<
    RouteConfig,
    "authRequired" | "nonAuthRequired" | "bypassSearch" | "isLayout"
>;
type UtilRouteConfig = Omit<UtilAuthRouteConfig, "guard">;
type InvisibleRouteConfig = Omit<UtilRouteConfig, "bypassDisplay">;

export const redirectTo = (path: string) => {
    redirect(path);
};

/**
 * Creates route, for any user
 * @param config Route Config object
 */
export const definePublicRoute = (
    config: UtilRouteConfig,
    bypassSearch: boolean = false
): RouteConfig => {
    return {
        ...config,
        authRequired: false,
        nonAuthRequired: false,
        bypassSearch,
    };
};

/**
 * Creates route, for any logged in user
 * @param config Route Config object
 */
export const defineAuthedRoute = (
    config: UtilAuthRouteConfig,
    bypassSearch: boolean = false
): RouteConfig => {
    const { path, ...rest } = config;
    return {
        ...(config.index ? rest : { ...rest, path }),
        authRequired: true,
        nonAuthRequired: false,
        bypassSearch,
    };
};

/**
 * Creates route, for any logged in user
 * @param config Route Config object
 */
export const defineNonAuthedRoute = (
    config: UtilRouteConfig,
    bypassSearch: boolean = false
): RouteConfig => {
    return {
        ...config,
        authRequired: false,
        nonAuthRequired: true,
        bypassSearch,
    };
};

/**
 * Creates route, only for Admin and SuperAdmin
 * @param config Route Config object
 */
export const defineRouteWithCommonAdminRole = (
    config: RouteConfig
): RouteConfig => {
    return {
        ...defineAuthedRoute(config),
        guard: {
            allowedRoles: ["Platform Admin"],
            // exceptSubscriptions: ["Invalid"],
            ...config.guard,
        },
    };
};

/**
 * Creates route, which will not be available in search and any navigation menu
 * @param config Route Config object
 */
export const defineInvisibleRoute = (
    config: InvisibleRouteConfig
): RouteConfig => {
    return {
        ...config,
        bypassSearch: true,
        bypassDisplay: true,
    };
};

/**
 * Creates route, which will redirect to given url, if opened
 * @param config Route Config object
 * @param redirectionTo path to redirect
 */
export const defineRedirectRoute = (
    config: Omit<RouteConfig, "element" | "component">,
    redirectionTo: string
): RouteConfig => {
    return {
        ...config,
        element: <Navigate to={redirectionTo} replace />,
    };
};

/**
 * Creates route, which will set a layout, if opened
 * @param config Route Config object
 * @param redirectionTo path to redirect
 */
export const defineLayoutRoute = (
    config: Omit<RouteConfig, "name" | "path" | "index" | "isLayout">
): RouteConfig => {
    return {
        ...config,
        name: "Layout",
        path: "",
        isLayout: true,
        // index: true,
    };
};
//     return { ...config, component: ChildRouteRender };
// };

/**
 * Creates a named section group — a pathless layout that renders a visible
 * section header in the sidebar nav (e.g. "CRM", "Overview", "Management").
 * Transparent to the router (path: ""), only affects sidebar rendering.
 */
export const defineSectionGroup = (
    sectionName: string,
    config: Omit<RouteConfig, "name" | "path" | "index" | "isLayout">
): RouteConfig => {
    return {
        ...config,
        name: sectionName,
        path: "",
        isLayout: true,
    };
};

export const constructPath = (
    nextPath: string | undefined,
    currentPath: string = ""
): string => {
    // Index routes have no path — they resolve to the parent path
    if (!nextPath) return currentPath;
    const formattedCurrentPath = currentPath.endsWith("/")
        ? currentPath.slice(0, -1)
        : currentPath;
    const formattedNextPath = nextPath.startsWith("/")
        ? nextPath.slice(1)
        : nextPath;
    const path = `${formattedCurrentPath.toLowerCase()}/${formattedNextPath.toLowerCase()}`;
    return path;
};

export const getFullUrl = (endpoint: string): string => {
    const path = /^http[s]{0,1}:\/\//.test(endpoint)
        ? endpoint
        : `${window.location.protocol}//${window.location.host}${
              endpoint.startsWith("/") ? endpoint : `/${endpoint}`
          }`;
    return path;
};

/**
 * Auth guard checker
 * @param guard The auth guard for roles
 * @param role User role
 * @returns is the role allowed by the guard
 */
export function isUserRoleAllowed(guard: RouteGuard, role: UserRoles): boolean {
    // Check if guard has allowedRoles
    if ("allowedRoles" in guard) {
        return guard.allowedRoles.indexOf(role) > -1;
    }

    // Check if guard has exceptRoles
    if ("exceptRoles" in guard) {
        return guard.exceptRoles.indexOf(role) < 0;
    }

    // If neither allowedRoles nor exceptRoles, all roles are allowed
    return true;
}

/**
 * Auth guard checker
 * @param guard The auth guard for roles
 * @param scopes User Scopes
 * @returns is the scope allowed by the guard
 */

export function isUserScopeAllowed(
    guard: RouteGuard,
    scopes: UserScopes[]
): boolean {
    if (!guard.allowedScopes) return true;
    if (Array.isArray(guard.allowedScopes)) {
        return guard.allowedScopes.some((s) => scopes.includes(s));
    }
    return evaluate(scopes, guard.allowedScopes);
}

/**
 * Creates a mapped link for the link elements
 * @param link the $\d seperated link
 * @param mapObj mapper object, example: {"$1":"usb"}
 */
export const getPathWithReplacement = (
    link: string,
    mapObj: { [key: string]: string }
): string => {
    return link.replace(/(\$\d+)/g, (v) => mapObj[v]);
};

type SuspendedComponentOptions =
    | { loadingComponent: React.ReactNode; loadingText?: never }
    | { loadingText: string; loadingComponent?: never }
    | { loadingComponent?: never; loadingText?: never };

/**
 * Create suspended component with lazy loading support
 * @param Component the component that needs to be rendered (can be lazy-loaded)
 * @param options optional configuration for loading state (loadingComponent and loadingText are mutually exclusive)
 * @param options.loadingComponent custom loading component to display
 * @param options.loadingText custom loading text to display
 *
 * @example
 * // Basic usage with lazy loading
 * const SetNewPasswordPage = suspendedComponent(
 *     lazy(() => import("@/pages/set-new-password"))
 * );
 *
 * @example
 * // With custom loading text
 * const DashboardPage = suspendedComponent(
 *     lazy(() => import("@/pages/dashboard")),
 *     { loadingText: "Loading dashboard..." }
 * );
 *
 * @example
 * // With custom loading component
 * const ProfilePage = suspendedComponent(
 *     lazy(() => import("@/pages/profile")),
 *     { loadingComponent: <Spinner size="large" /> }
 * );
 *
 * @example
 * // ❌ Error: Cannot use both at once
 * const SettingsPage = suspendedComponent(
 *     lazy(() => import("@/pages/settings")),
 *     {
 *         loadingComponent: <CustomLoader />,
 *         loadingText: "Loading settings..." // TypeScript error!
 *     }
 * );
 *
 * @example
 * // Usage in routes
 * <Route path="/reset-password" element={<SetNewPasswordPage />} />
 */
export const suspendedComponent =
    <P extends object = object>(
        Component: React.ComponentType<P>,
        options?: SuspendedComponentOptions
    ) =>
    (props: P) => (
        <SuspendedPage
            loadingComponent={options?.loadingComponent}
            loadingText={options?.loadingText}>
            <Component {...props} />
        </SuspendedPage>
    );

/**
 * Returns the default home route for a given user role.
 * Used for post-login redirects and cross-role unauthorized redirects.
 */
export function getRoleHome(role: UserRoles): string {
    switch (role) {
        case "Platform Admin":
            return AdminRoutes.dashboard;
        default:
            return AuthedRoutes.home;
    }
}
