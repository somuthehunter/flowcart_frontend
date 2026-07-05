import { useMemo, useState } from "react";
import { createRole, updateRole } from "@/services/api/role-ep";
import { getScopeSuggestions } from "@/services/api/scope-ep";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
    CreateRoleRequest,
    UpdateRoleRequest,
} from "@/types/request/role-request";
import { ScopeSuggestion } from "@/types/response/scope-response";
import QueryConst from "@/constants/query-constants";
import useAuth from "@/hooks/use-auth";

import { RoleAddDialogProps } from "../components/role-add-dialog";

export const roleSchema = z.object({
    roleName: z.string().min(1, "Role name is required"),
    description: z.string().optional(),
    scopes: z.array(z.string()).min(1, "At least one permission is required"),
});

export type RoleFormValues = z.infer<typeof roleSchema>;

type UseRoleAddParams = Partial<RoleAddDialogProps>;

export const useRoleAdd = ({ role, onClose }: UseRoleAddParams) => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const { data: scopes, isLoading: isLoadingScopes } = useQuery({
        queryKey: [QueryConst.scope.suggestions],
        queryFn: getScopeSuggestions,
    });

    // Form
    const form = useForm<RoleFormValues>({
        resolver: zodResolver(roleSchema),
        values: {
            roleName: role?.roleName ?? "",
            description: role?.description ?? "",
            scopes: role?.scopes?.map((s) => s.scopeName) ?? [],
        },
        mode: "onChange",
    });

    const onReset = () => {
        form.reset({
            roleName: "",
            description: "",
            scopes: [],
        });
    };

    // Mutations
    const { mutateAsync: createRoleAsync, isPending: isCreatingRole } =
        useMutation({
            mutationKey: [QueryConst.role.create],
            mutationFn: createRole,
        });

    const { mutateAsync: updateRoleAsync, isPending: isUpdatingRole } =
        useMutation({
            mutationKey: [QueryConst.role.update],
            mutationFn: updateRole,
        });

    const onSubmit = form.handleSubmit((data) => {
        // Map scope names to scope IDs
        const scopeIds = data.scopes
            .map(
                (scopeName) =>
                    scopes?.find((s) => s.scopeName === scopeName)?.scopeId
            )
            .filter((id): id is string => Boolean(id));

        if (role) {
            const payload: UpdateRoleRequest = {
                roleId: role.roleId || "",
                roleName: data.roleName,
                description: data.description,
                entityId: user?.entityId || "",
                isPrimary: role.isPrimary,
                scopeIds,
            };
            updateRoleAsync(payload)
                .then(() => {
                    toast.success("Role updated successfully");
                    onReset();
                    onClose?.();
                    queryClient.refetchQueries({
                        queryKey: [QueryConst.role.list],
                    });
                })
                .catch((error) => {
                    toast.error(error?.message || "Failed to update role");
                });
        } else {
            const payload: CreateRoleRequest = {
                roleName: data.roleName,
                description: data.description,
                entityId: user?.entityId || "",

                isPrimary: false,
                scopeIds,
            };
            createRoleAsync(payload)
                .then(() => {
                    toast.success("Role created successfully");
                    onReset();
                    onClose?.();
                    queryClient.refetchQueries({
                        queryKey: [QueryConst.role.list],
                    });
                })
                .catch((error) => {
                    toast.error(error?.message || "Failed to create role");
                });
        }
    });

    const handleOpenChange = (open: boolean) => {
        if (!open) onClose?.();
    };

    //Scope grouping logic

    // Group scopes by groupName, sorted internally by scopeSortOrder
    const groupedScopes = useMemo(() => {
        if (!scopes) return {} as Record<string, ScopeSuggestion[]>;
        const groups: Record<string, ScopeSuggestion[]> = {};
        scopes.forEach((scope) => {
            if (!groups[scope.groupName]) groups[scope.groupName] = [];
            groups[scope.groupName].push(scope);
        });
        Object.values(groups).forEach((g) =>
            g.sort((a, b) => a.scopeSortOrder - b.scopeSortOrder)
        );
        return groups;
    }, [scopes]);

    // Group names sorted by groupSortOrder
    const sortedGroupNames = useMemo(() => {
        if (!scopes) return [];
        const groupMap = new Map<string, number>();
        scopes.forEach((scope) => {
            if (!groupMap.has(scope.groupName))
                groupMap.set(scope.groupName, scope.groupSortOrder);
        });
        return Array.from(groupMap.entries())
            .sort((a, b) => a[1] - b[1])
            .map(([name]) => name);
    }, [scopes]);

    // Count selected vs total for a group
    const getGroupCount = (groupName: string, selectedScopes: string[]) => {
        const groupScopes = groupedScopes[groupName] || [];
        const selected = groupScopes.filter((s) =>
            selectedScopes.includes(s.scopeName)
        ).length;
        return { selected, total: groupScopes.length };
    };

    // Whether every scope is currently selected
    const areAllSelected = (selectedScopes: string[]) =>
        Boolean(scopes?.every((s) => selectedScopes.includes(s.scopeName)));

    // Toggle all scopes on/off
    const toggleAllScopes = (
        currentScopes: string[],
        onChange: (scopes: string[]) => void
    ) => {
        if (areAllSelected(currentScopes)) {
            onChange([]);
        } else {
            onChange(scopes?.map((s) => s.scopeName) ?? []);
        }
    };

    // Toggle a group's scopes on/off
    const toggleGroupScopes = (
        groupName: string,
        checked: boolean,
        currentScopes: string[],
        onChange: (scopes: string[]) => void
    ) => {
        const groupScopeNames =
            groupedScopes[groupName]?.map((s) => s.scopeName) ?? [];
        if (checked) {
            const merged = [
                ...currentScopes,
                ...groupScopeNames.filter((n) => !currentScopes.includes(n)),
            ];
            onChange(merged);
        } else {
            onChange(currentScopes.filter((n) => !groupScopeNames.includes(n)));
        }
    };

    // Toggle a single scope on/off
    const toggleScope = (
        scopeName: string,
        checked: boolean,
        currentScopes: string[],
        onChange: (scopes: string[]) => void
    ) => {
        if (checked) {
            onChange([...currentScopes, scopeName]);
        } else {
            onChange(currentScopes.filter((s) => s !== scopeName));
        }
    };

    //Collapsible group open state
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    const toggleGroup = (groupName: string) =>
        setOpenGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));

    return {
        // form
        form,
        onSubmit,
        onReset,
        handleOpenChange,
        isCreatingRole,
        isUpdatingRole,
        // scope helpers
        groupedScopes,
        sortedGroupNames,
        getGroupCount,
        areAllSelected,
        toggleAllScopes,
        toggleGroupScopes,
        toggleScope,
        // UI state
        openGroups,
        toggleGroup,
        isLoadingScopes,
    };
};
