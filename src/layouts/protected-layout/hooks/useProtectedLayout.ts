import { useState } from "react";
import { useRouteStore } from "@/stores/route-store";
import { useLocation } from "react-router";

import { usePageRenderContext } from "@/contexts/page-render-context";
import useAuth from "@/hooks/use-auth";

export function useProtectedLayout() {
    const { pageRenderData } = usePageRenderContext();
    const routeConfigs = useRouteStore((s) => s.routeConfigs);
    const { pathname } = useLocation();
    const { isAuthenticated: isAuthed, user } = useAuth();

    const [isMobileNavOpen, setMobileNavOpen] = useState(false);

    const currentLocation = "/";

    return {
        isMobileNavOpen,
        setMobileNavOpen,
        routeConfigs,
        currentLocation,
        pathname,
        pageRenderData,
        isAuthed,
        user,
    };
}
