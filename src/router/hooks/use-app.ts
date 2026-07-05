import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { config } from "@/lib/config";
import { useRouteStore } from "@/stores/route-store";
import { createBrowserRouter } from "react-router";

import useAuth from "@/hooks/use-auth";

export const useApp = () => {
    const {
        isLoading: isAuthLoading,
        isAuthenticated: isAuthed,
        verifyUser,
    } = useAuth();
    const [isAppInitialized, setIsAppInitialized] = useState<boolean>(false);
    const routes = useRouteStore((s) => s.routes);

    const router = useMemo(
        () =>
            createBrowserRouter(routes, {
                basename: config?.env?.BASE_URL || "/",
            }),
        [routes]
    );

    useLayoutEffect(() => {
        verifyUser();
    }, []);

    useEffect(() => {
        return () => {
            if (isAuthed) {
                setIsAppInitialized(false);
            }
        };
    }, [isAuthed]);

    return {
        isAuthLoading,
        isNotificationEnabled: isAppInitialized && isAuthed,
        router,
    };
};
