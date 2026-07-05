import React from "react";

import useAuth from "@/hooks/use-auth";
import AppLoading from "@/components/app-loading";

const UnprotectedRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { isLoading } = useAuth();

    return <>{!isLoading ? children : <AppLoading />}</>;
};

export default UnprotectedRoute;
