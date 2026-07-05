import React from "react";
import { NavLink } from "react-router";

import { AppButton } from "./app-button";

export function AppLink({
    to,
    children,
    ...props
}: { to: string; children: React.ReactNode } & React.ComponentProps<
    typeof AppButton
>) {
    return (
        <NavLink to={to}>
            <AppButton {...props}>{children}</AppButton>
        </NavLink>
    );
}
