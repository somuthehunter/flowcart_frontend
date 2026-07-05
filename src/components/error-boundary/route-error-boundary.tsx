import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { useNavigate, useRouteError } from "react-router";

import { AuthedRoutes } from "@/constants/route-constants";
import { AppButton } from "@/components/form";

/**
 * Error boundary component for React Router routes.
 * Uses useRouteError() to get error from React Router.
 */
export const RouteErrorBoundary = () => {
    const error = useRouteError();
    const navigate = useNavigate();
    const isProduction = process.env.NODE_ENV === "production";

    // Safe error message handling
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDescription = isProduction
        ? "An unexpected error occurred. Please try again."
        : errorMessage;

    const handleHomeClick = () => {
        navigate(AuthedRoutes.home);
    };

    const handleRetry = () => {
        navigate(0); // Refresh the current route
    };

    return (
        <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 rounded-full bg-red-50 p-3 text-red-500 dark:bg-red-950/50">
                <AlertTriangle size={32} />
            </div>

            <h3 className="text-lg font-semibold">Something went wrong</h3>
            <p className="text-muted-foreground mt-2 mb-6 max-w-sm text-sm">
                {errorDescription}
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
                <AppButton
                    variant="outline"
                    onClick={handleHomeClick}
                    icon={<Home size={16} />}>
                    Back to Main Page
                </AppButton>

                <AppButton onClick={handleRetry} icon={<RotateCcw size={16} />}>
                    Try Again
                </AppButton>
            </div>
        </div>
    );
};
