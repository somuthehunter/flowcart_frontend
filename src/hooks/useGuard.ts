import { useCallback, useMemo } from "react";
import { UnionExp } from "@/lib/bool-utils";
import { isUserRoleAllowed, isUserScopeAllowed } from "@/lib/route-utils";

import { AccountUser } from "@/types/account-user";
import { RouteGuard } from "@/types/route-guard";
import { UserRoles } from "@/types/types";
import { UserScopes } from "@/types/user-scopes";

import useAuth from "./use-auth";

export type GuardContext = {
    user?: AccountUser;
    isAuthenticated: boolean;
    isLoading: boolean;
};
export type UseGuardOptions = RouteGuard & {
    custom?: (context: GuardContext) => boolean;
};

/**
 * Custom hook for managing route and component access control based on user roles and scopes.
 *
 * This hook evaluates whether the current authenticated user has permission to access
 * a resource based on role-based access control (RBAC) and scope-based permissions.
 * It supports three guard patterns:
 * - Allowlist: Only specified roles are permitted
 * - Blocklist: All roles except specified ones are permitted
 * - Scope-only: Any role with matching scopes is permitted
 *
 * @param options - Guard configuration options
 * @param options.allowedRoles - Roles that are explicitly allowed (allowlist pattern).
 * Cannot be used together with `exceptRoles`.
 * @param options.exceptRoles - Roles that are explicitly blocked (blocklist pattern).
 * Cannot be used together with `allowedRoles`.
 * @param options.allowedScopes - Required scopes for access.
 * Can be an array of scopes (implicitly OR logic) or a UnionExp generated using the `or()`, `and()`, and `not()` utilities.
 * @param options.custom - Custom validation function with access
 * to the full guard context (user, authentication state, loading state). Must return `true` to grant access.
 *
 * @returns Guard utilities and access state
 * @returns return.isChecking - Whether authentication state is still loading
 * @returns return.hasAccess - Whether user meets all guard criteria (role + scope + custom)
 * @returns return.shouldShow - Alias for `hasAccess`, useful for conditional rendering
 * @returns return.disabled - Inverse of `hasAccess`, useful for disabling UI elements
 * @returns return.hasRole - Check if user has a specific role
 * @returns return.hasScopes - Check if user has required scopes with support for boolean expressions
 *
 * @example
 * // Allowlist: Only admins can access
 * const { hasAccess } = useGuard({
 * allowedRoles: ['admin']
 * });
 *
 * @example
 * // Blocklist: Everyone except guests
 * const { hasAccess } = useGuard({
 * exceptRoles: ['guest']
 * });
 *
 * @example
 * // Scope-based access using boolean expression utils
 * import { or } from "@/lib/bool-utils";
 * const { hasAccess } = useGuard({
 * allowedScopes: or('user:read', 'user:write')
 * });
 *
 * @example
 * // Combined role and scope check
 * const { hasAccess } = useGuard({
 * allowedRoles: ['admin', 'moderator'],
 * allowedScopes: ['content:delete']
 * });
 *
 * @example
 * // Custom validation with user context
 * const { hasAccess } = useGuard({
 * allowedRoles: ['user'],
 * custom: ({ user }) => user?.emailVerified === true
 * });
 *
 * @example
 * // Advanced custom validation with full context
 * const { hasAccess } = useGuard({
 * custom: ({ user, isAuthenticated, isLoading }) => {
 * if (isLoading) return false;
 * return isAuthenticated && user?.subscription?.isPaid === true;
 * }
 * });
 *
 * @example
 * // Conditional rendering
 * const { shouldShow } = useGuard({ allowedRoles: ['admin'] });
 * return shouldShow && <AdminPanel />;
 *
 * @example
 * // Disable button for unauthorized users
 * const { disabled } = useGuard({ allowedScopes: ['post:create'] });
 * return <Button disabled={disabled}>Create Post</Button>;
 *
 * @example
 * // Check specific role programmatically
 * const { hasRole, hasScopes } = useGuard();
 * if (hasRole('admin') && hasScopes(['system:config'])) {
 * // Show advanced settings
 * }
 *
 * @example
 * // Check multiple scopes with simple OR logic (array)
 * const { hasScopes } = useGuard();
 * const canModerate = hasScopes(['content:edit', 'content:delete']);
 *
 * @example
 * // Check scopes with complex boolean logic using and/or/not utilities
 * import { and, or, not } from "@/lib/bool-utils";
 * const { hasScopes } = useGuard();
 * * const canPublish = hasScopes(
 * and('content:write', or('content:publish', 'admin:override'))
 * );
 * * const canViewRestricted = hasScopes(
 * and('content:read', not('user:restricted'))
 * );
 *
 * @remarks
 * - Returns `false` for all checks while authentication is loading (`isChecking === true`)
 * - Returns `false` if user is not authenticated or user object is missing
 * - All guard conditions must pass (AND logic between role, scope, and custom checks)
 * - Role check defaults to `true` if neither `allowedRoles` nor `exceptRoles` is specified
 * - Scope check defaults to `true` if `allowedScopes` is not specified
 * - Custom check defaults to `true` if `custom` function is not provided
 * - The `custom` function receives a `GuardContext` object with `user`, `isAuthenticated`, and `isLoading`
 * - The hook re-evaluates access whenever authentication state or user data changes
 * - Use `hasRole` and `hasScopes` helpers for programmatic checks outside the main guard logic
 *
 * @see GuardContext for the context object structure passed to custom functions
 * @see UseGuardOptions for all available configuration options
 * @see UnionExp for the boolean expression syntax powering scope evaluations
 */
const useGuard = (options: UseGuardOptions = {}) => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const { custom } = options;
    const allowedScopes = options.allowedScopes;
    const allowedRoles =
        "allowedRoles" in options ? options.allowedRoles : undefined;
    const exceptRoles =
        "exceptRoles" in options ? options.exceptRoles : undefined;

    const hasAccess = useMemo(() => {
        if (isLoading) return false;
        if (!isAuthenticated || !user) return false;

        // Role check
        const roleCheck = isUserRoleAllowed(
            allowedRoles
                ? { allowedRoles, allowedScopes }
                : exceptRoles
                  ? { exceptRoles, allowedScopes }
                  : { allowedScopes },
            user.role
        );
        if (!roleCheck) return false;

        // Scope check
        const scopeCheck = isUserScopeAllowed(
            { allowedScopes },
            user.scopes || []
        );
        if (!scopeCheck) return false;

        // Custom guard check
        const customCheck = custom
            ? custom({ user, isLoading, isAuthenticated })
            : true;
        if (!customCheck) return false;

        return true;
    }, [
        isLoading,
        isAuthenticated,
        user,
        allowedRoles,
        exceptRoles,
        allowedScopes,
        custom,
    ]);

    const hasRole = useCallback(
        (role: UserRoles | string) => {
            return user?.role === role;
        },
        [user?.role]
    );

    const hasScopes = useCallback(
        (scopesToCheck: UnionExp<UserScopes> | UserScopes[]) => {
            return isUserScopeAllowed(
                { allowedScopes: scopesToCheck },
                user?.scopes || []
            );
        },
        [user?.scopes]
    );

    return {
        isChecking: isLoading,
        hasAccess,
        shouldShow: hasAccess,
        disabled: !hasAccess,
        hasRole,
        hasScopes,
    };
};

export default useGuard;
