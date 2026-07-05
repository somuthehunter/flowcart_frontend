import React, { forwardRef } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";

interface AppButtonProps extends ButtonProps {
    loading?: boolean;
    loadingText?: string;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
}

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
    (
        {
            loading = false,
            loadingText = "Loading...",
            icon,
            iconPosition = "left",
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || loading;

        const renderContent = () => {
            if (loading) {
                return (
                    <>
                        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
                        {loadingText}
                    </>
                );
            }

            if (icon && iconPosition === "left") {
                return (
                    <>
                        {icon}
                        {children}
                    </>
                );
            }

            if (icon && iconPosition === "right") {
                return (
                    <>
                        {children}
                        {icon}
                    </>
                );
            }

            return children;
        };

        return (
            <Button ref={ref} disabled={isDisabled} {...props}>
                {renderContent()}
            </Button>
        );
    }
);

AppButton.displayName = "AppButton";
