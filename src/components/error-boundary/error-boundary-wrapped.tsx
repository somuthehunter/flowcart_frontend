import {
    cloneElement,
    ErrorInfo,
    FC,
    isValidElement,
    PropsWithChildren,
    ReactElement,
    ReactNode,
} from "react";
import logger from "@/lib/log-utils";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

import { AppButton } from "@/components/form";
import { type ButtonProps } from "@/components/ui/button";

// 1. Configuration for the Default Fallback UI
interface DefaultFallbackConfig {
    title?: string;
    description?: string;
    homeLabel?: string;
    retryLabel?: string;
    hideHomeButton?: boolean;
    showErrorDetails?: boolean; // Control whether to show error message (dev vs prod)
    ButtonComponent?: FC<ButtonComponentProps>;
}

// Button component must support these props at minimum
interface ButtonComponentProps extends ButtonProps {
    icon?: ReactNode;
    onClick?: () => void;
}

// 2. Main Props Interface
interface GenericErrorBoundaryProps {
    // Logic
    resetKeys?: unknown[];
    onReset?: (...args: unknown[]) => void;
    onError?: (error: Error, info: ErrorInfo) => void;

    // Navigation
    onGoHome?: () => void;

    // UI Customization
    fallback?: ReactElement<FallbackProps> | FC<FallbackProps>;
    uiConfig?: DefaultFallbackConfig;
    className?: string;
}

// 3. The Default Fallback Component (Internal)
const DefaultErrorFallback = ({
    error,
    resetErrorBoundary,
    uiConfig = {},
    onGoHome,
}: FallbackProps & {
    uiConfig?: DefaultFallbackConfig;
    onGoHome?: () => void;
}) => {
    const isProduction = process.env.NODE_ENV === "production";

    const {
        title = "Something went wrong",
        description,
        homeLabel = "Back to Main Page",
        retryLabel = "Try Again",
        hideHomeButton = false,
        showErrorDetails = !isProduction,
        ButtonComponent = AppButton,
    } = uiConfig;

    // Safe error message handling
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDescription =
        description ||
        (showErrorDetails
            ? errorMessage
            : "An unexpected error occurred. Please try again.");

    const handleHomeClick = () => {
        if (onGoHome) {
            onGoHome();
        } else {
            window.location.assign("/");
        }
    };

    return (
        <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 rounded-full bg-red-50 p-3 text-red-500 dark:bg-red-950/50">
                <AlertTriangle size={32} />
            </div>

            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-muted-foreground mt-2 mb-6 max-w-sm text-sm">
                {errorDescription}
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
                {!hideHomeButton && (
                    <ButtonComponent
                        variant="outline"
                        onClick={handleHomeClick}
                        icon={<Home size={16} />}>
                        {homeLabel}
                    </ButtonComponent>
                )}

                <ButtonComponent
                    onClick={resetErrorBoundary}
                    icon={<RotateCcw size={16} />}>
                    {retryLabel}
                </ButtonComponent>
            </div>
        </div>
    );
};

// 4. The Main Component
const ErrorBoundaryWrapped: FC<
    PropsWithChildren<GenericErrorBoundaryProps>
> = ({
    children,
    resetKeys,
    onReset,
    onError,
    onGoHome,
    fallback,
    uiConfig,
    className,
}) => {
    const handleOnError = (error: unknown, info: ErrorInfo) => {
        // Convert unknown to Error for logging
        const errorObj =
            error instanceof Error ? error : new Error(String(error));

        // 1. Log to default logger
        logger.error(
            "UI Unhandled Exception: {name} - {message}",
            {
                message: errorObj.message,
                name: errorObj.name,
                stack: info.componentStack,
            },
            errorObj
        );

        // 2. Execute custom onError if provided (e.g., for Sentry)
        if (onError) {
            onError(errorObj, info);
        }
    };

    const renderFallback = (props: FallbackProps) => {
        // Wrap everything in className if provided
        const wrapWithClassName = (content: ReactNode) => {
            if (className) {
                return <div className={className}>{content}</div>;
            }
            return content;
        };

        // If a valid React Element is passed, clone it with props
        if (isValidElement<FallbackProps>(fallback)) {
            return wrapWithClassName(
                cloneElement(fallback, {
                    ...props,
                    ...fallback.props,
                })
            );
        }

        // If a Component function is passed, render it
        if (typeof fallback === "function") {
            const FallbackComponent = fallback as FC<FallbackProps>;
            return wrapWithClassName(<FallbackComponent {...props} />);
        }

        // Otherwise, render our default fallback
        return wrapWithClassName(
            <DefaultErrorFallback
                {...props}
                uiConfig={uiConfig}
                onGoHome={onGoHome}
            />
        );
    };

    return (
        <ErrorBoundary
            FallbackComponent={renderFallback}
            onError={handleOnError}
            resetKeys={resetKeys}
            onReset={onReset}>
            {children}
        </ErrorBoundary>
    );
};

export { ErrorBoundaryWrapped };
