import { MouseEvent, useCallback, useEffect, useState } from "react";
import { Breakpoints } from "@/lib/breakpoints";
import { constructPath } from "@/lib/route-utils";
import { useLocation, useMatches } from "react-router";

import { RouteConfig } from "@/types/route-config";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useSidebar } from "@/components/ui/sidebar";

// Utility function to check if any child route is active
const isAnyChildRouteActive = (
    route: RouteConfig,
    basePath: string,
    matches: any[]
): boolean => {
    if (!route.routes || route.routes.length === 0) {
        return false;
    }

    for (const childRoute of route.routes) {
        if (childRoute.bypassDisplay) continue;

        const childPath = constructPath(childRoute.path, basePath);
        const match = matches.find((r) => r.pathname === childPath);

        if (match) {
            return true;
        }

        // Recursively check nested routes
        if (isAnyChildRouteActive(childRoute, childPath, matches)) {
            return true;
        }
    }

    return false;
};

export default function useNavItem(route: RouteConfig, basePath?: string) {
    const path = basePath;
    const matches = useMatches();
    const { pathname } = useLocation();
    const [isExpanded, changeExpansion] = useState(false);
    const [isActive, changeActive] = useState(false);
    // const { isSideBarCollapsed } = useSelector(selectCollapseSideBar);
    const { open: isSideBarCollapsed, state } = useSidebar();
    const isTab = useMediaQuery(Breakpoints.down("md"));
    const isCollapsed = state === "collapsed";
    const shouldBeCollapsed = !isTab && isCollapsed;

    useEffect(() => {
        // Use location.pathname for direct match to avoid parent routes being
        // marked active when a child route is the actual current page
        const isExactMatch = pathname === path;
        const hasActiveChild = isAnyChildRouteActive(
            route,
            path || "",
            matches
        );

        // For items, we only care about direct matches for active state
        // But for expansion (when collapsed), we consider child routes too
        changeExpansion((isExactMatch || hasActiveChild) && shouldBeCollapsed);
        changeActive(isExactMatch);
    }, [matches, pathname, path, shouldBeCollapsed, route]);

    const extractChildNRoutes = useCallback(() => {
        return (route.routes || []).filter((item) => !item.bypassDisplay);
    }, [route]);

    // useEffect(() => {
    //     if (!(shouldBeCollapsed)) {
    //         changeExpansion(false);
    //         anchorEl.current = null;
    //     }
    // }, [isTab, isSideBarCollapsed]);

    // useEffect(() => {
    //     if (isSideBarCollapsed) {
    //         changeExpansion(false);
    //     }
    // }, [isSideBarCollapsed]);

    const handlePopOpen = (event: MouseEvent<HTMLButtonElement>) => {
        // setAnchorEl(event.currentTarget);
        changeExpansion(!isExpanded);
    };
    const handlePopClose = (event: MouseEvent<HTMLDivElement>) => {
        changeExpansion(!isExpanded);
    };

    const handlePopoverClose = () => {};

    return {
        extractChildNRoutes,
        isExpanded,
        isActive,
        changeExpansion,
        isSideBarCollapsed,
        isTab,
        handlePopOpen,
        handlePopClose,
        handlePopoverClose,
        shouldBeCollapsed,
        isCollapsed,
        path,
    };
}
