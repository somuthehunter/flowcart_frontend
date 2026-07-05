import { FC, PropsWithChildren } from "react";
import {
    getRoleHome,
    isUserRoleAllowed,
    isUserScopeAllowed,
} from "@/lib/route-utils";
import { Navigate, useLocation } from "react-router";

import { GuardRouteProps } from "@/types/guard-route-props";
import { NonAuthedRoutes } from "@/constants/route-constants";
import useAuth from "@/hooks/use-auth";
import AppLoading from "@/components/app-loading";

const AuthRoute: FC<PropsWithChildren<GuardRouteProps>> = ({
    children,
    route,
}) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <AppLoading />;
    }

    // Not logged in → go to login, preserve intended destination
    if (!isAuthenticated) {
        return (
            <Navigate
                replace
                to={{ pathname: NonAuthedRoutes.login }}
                state={{ from: location.pathname + location.search }}
            />
        );
    }

    // Logged in but wrong role/scope → send to their own portal home
    if (
        route.guard &&
        user &&
        !(
            isUserRoleAllowed(route.guard, user.role) &&
            isUserScopeAllowed(route.guard, user.scopes)
        )
    ) {
        return <Navigate replace to={getRoleHome(user.role)} />;
    }

    return children;
};

export default AuthRoute;
