import { FC, PropsWithChildren } from "react";
import { getRoleHome } from "@/lib/route-utils";
import { Navigate, useLocation } from "react-router";

import { GuardRouteProps } from "@/types/guard-route-props";
import useAuth from "@/hooks/use-auth";
import AppLoading from "@/components/app-loading";

/**
 * Returns state.from only if it belongs to the user's own portal.
 * Prevents Dealer users from being bounced into /admin/* and vice versa.
 */
function getSafeFrom(
    from: string | undefined,
    role: Parameters<typeof getRoleHome>[0]
): string {
    if (!from) return getRoleHome(role);
    const isAdminPath = from.startsWith("/admin");
    if (isAdminPath && role !== "Platform Admin") return getRoleHome(role);
    if (!isAdminPath && role === "Platform Admin") return getRoleHome(role);
    return from;
}

const NonAuthRoute: FC<PropsWithChildren<GuardRouteProps>> = ({ children }) => {
    const { isLoading, isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <AppLoading />;
    }

    if (isAuthenticated && user) {
        return (
            <Navigate
                to={getSafeFrom(location.state?.from, user.role)}
                replace
            />
        );
    }

    return children;
};

export default NonAuthRoute;
