import { lazy } from "react";
import {
    defineInvisibleRoute,
    defineNonAuthedRoute,
    suspendedComponent,
} from "@/lib/route-utils";

import { RouteConfig } from "@/types/route-config";
import { NonAuthedRoutes } from "@/constants/route-constants";

const LoginPage = suspendedComponent(lazy(() => import("@/pages/login")));
const ForgotPasswordPage = suspendedComponent(
    lazy(() => import("@/pages/forgot-password"))
);
const ResetPasswordPage = suspendedComponent(
    lazy(() => import("@/pages/reset-password"))
);
export const publicRoutes: RouteConfig[] = [
    defineInvisibleRoute(
        defineNonAuthedRoute({
            name: "Login",
            path: NonAuthedRoutes.login,
            Component: LoginPage,
        })
    ),

    defineInvisibleRoute(
        defineNonAuthedRoute({
            name: "Forgot Password",
            path: NonAuthedRoutes.forgotPassword,
            Component: ForgotPasswordPage,
        })
    ),
    defineInvisibleRoute(
        defineNonAuthedRoute({
            name: "Reset Password",
            path: NonAuthedRoutes.resetPassword,
            Component: ResetPasswordPage,
        })
    ),
];
