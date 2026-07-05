import { ComponentType, PropsWithChildren } from "react";
import { isUserRoleAllowed, isUserScopeAllowed } from "@/lib/route-utils";
import { AuthRoute, NonAuthRoute } from "@/router/guards";
import { guardlessRoutesConfig, routesConfig } from "@/router/routes";
import { cloneDeep } from "lodash";
import { RouteObject } from "react-router";

import { AccountUser } from "@/types/account-user";
import { GuardRouteProps } from "@/types/guard-route-props";
import { PageRenderData } from "@/types/page-render-data";
import { RouteConfig, RouteConfigWithChildren } from "@/types/route-config";
import { PageRenderProvider } from "@/contexts/page-render-context";
import { RouteErrorBoundary } from "@/components/error-boundary";

export type RouteTransformer = (route: RouteConfig) => RouteObject;

export function getRouteConfigs(user?: AccountUser): RouteConfigWithChildren[] {
    return filterRoutes(
        cloneDeep(user ? routesConfig : guardlessRoutesConfig),
        user
    );
}

export function getRouteObjects(user?: AccountUser): RouteObject[] {
    return filterRoutes(cloneDeep(routesConfig), user, transformRoute).map(
        (route) => transformRoute(route)
    );
}

export const transformRoute: RouteTransformer = (route) => {
    const {
        title,
        pageHeader,
        bypassSearch,
        keywords,
        authRequired,
        nonAuthRequired,
        bypassDisplay,
        guard,
        externalLink,
        icon,
        ...restObj
    } = route;

    const props: PageRenderData = {
        title,
        pageHeader,
        name: route.name,
        bypassSearch,
        keywords,
        bypassDisplay,
        guard,
        externalLink,
        icon,
    };
    let WrapperComponent: ComponentType<
        PropsWithChildren<GuardRouteProps>
    > | null = null;
    if (authRequired) {
        WrapperComponent = AuthRoute;
    }
    if (nonAuthRequired) {
        WrapperComponent = NonAuthRoute;
    }
    if (restObj.element) {
        restObj.element = (
            <PageRenderProvider pageRenderData={props}>
                {WrapperComponent ? (
                    <WrapperComponent route={route}>
                        {restObj.element}
                    </WrapperComponent>
                ) : (
                    restObj.element
                )}
            </PageRenderProvider>
        );
    }
    if (restObj.Component) {
        restObj.element = (
            <PageRenderProvider pageRenderData={props}>
                {WrapperComponent ? (
                    <WrapperComponent route={route}>
                        <restObj.Component />
                    </WrapperComponent>
                ) : (
                    <restObj.Component />
                )}
            </PageRenderProvider>
        );
        restObj.Component = undefined;
    }
    restObj.ErrorBoundary = RouteErrorBoundary;

    return {
        ...restObj,
        handle: route.handle || {
            crumb:
                route.isLayout || route.index
                    ? undefined
                    : pageHeader || title || route.name,
        },
    };
};

export function filterRoutes(
    routes: RouteConfig[],
    user?: AccountUser,
    tR?: RouteTransformer
): RouteConfigWithChildren[] {
    return routes
        .filter(({ guard }) => {
            if (!user) return true;
            return guard
                ? isUserRoleAllowed(guard, user.role) &&
                      isUserScopeAllowed(guard, user.scopes)
                : true;
        })
        .map((item) => {
            const itemT: RouteConfigWithChildren = item;
            if (item.routes) {
                item.routes = filterRoutes(item.routes, user, tR);
                if (item.routes.length && tR) {
                    itemT.children = item.routes.map((route) => tR(route));
                }
            }
            return itemT;
        });
}
