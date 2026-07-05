import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { RouteObject } from "react-router";
import { RouteConfig } from "@/types/route-config";
import { AccountUser } from "@/types/account-user";
import { getRouteConfigs, getRouteObjects } from "@/lib/route-computations";
import { useAuthStore } from "@/stores/auth-store";
import { config } from "@/lib/config";

const STORE = "route";

const Actions = {
    computeRoutes: `${STORE}/computeRoutes`,
    unknown: `${STORE}/unknown`,
} as const;

interface RouteState {
    routes: RouteObject[];
    routeConfigs: RouteConfig[];
    computeRoutes: (user?: AccountUser) => void;
}

export const useRouteStore = create<RouteState>()(
    devtools(
        (set) => ({
            routes: getRouteObjects(),
            routeConfigs: getRouteConfigs(),
            computeRoutes: (user) => {
                set(
                    {
                        routes: getRouteObjects(user),
                        routeConfigs: getRouteConfigs(user),
                    },
                    false,
                    Actions.computeRoutes
                );
            },
        }),
        {
            name: STORE,
            anonymousActionType: Actions.unknown,
            enabled: config.env.MODE !== "production",
        }
    )
);

useAuthStore.subscribe(
    (state) => state.user,
    (user) => {
        useRouteStore.getState().computeRoutes(user);
    }
);
