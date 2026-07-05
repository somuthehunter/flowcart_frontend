import { getRoleHome } from "@/lib/route-utils";
import { Navigate } from "react-router";

import { NonAuthedRoutes } from "@/constants/route-constants";
import useAuth from "@/hooks/use-auth";

const RootRedirect = () => {
    const { isAuthenticated, user } = useAuth();
    if (isAuthenticated && user) {
        return <Navigate to={getRoleHome(user.role)} replace />;
    }
    return <Navigate to={NonAuthedRoutes.login} replace />;
};
export default RootRedirect;
