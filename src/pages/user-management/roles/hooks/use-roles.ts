import { useCallback, useState } from "react";
import { deleteRole, getRoles } from "@/services/api/role-ep";
import { getScopeSuggestions } from "@/services/api/scope-ep";
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { Role } from "@/types/response/role-response";
import QueryConst from "@/constants/query-constants";
import { useInfiniteScrollObserver } from "@/hooks/use-infinite-scroll-observer";
import useConfirm from "@/hooks/useConfirm";

import { RoleFilterProps } from "./use-role-filter";

export type RoleActionType = "edit" | "delete";

export const useRoles = (filter: RoleFilterProps) => {
    const queryClient = useQueryClient();
    const confirm = useConfirm();

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | undefined>(
        undefined
    );

    const { data: scopes, isPending: isScopesLoading } = useQuery({
        queryKey: [QueryConst.scope.suggestions],
        queryFn: getScopeSuggestions,
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: [
            QueryConst.role.list,
            filter.debouncedSearchKeyword,
            filter.status,
            // filter.sortBy,
            // filter.sortOrder,
            filter.rowsPerPage,
        ],

        queryFn: ({ pageParam = 1 }) =>
            getRoles({
                pageNumber: pageParam,
                rowsPerPage: filter.rowsPerPage,
                searchKeyword: filter.debouncedSearchKeyword,
                // sortBy: filter.sortBy ?? undefined,
                // sortOrder: filter.sortOrder ?? undefined,
                status: filter.status ?? undefined,
            }),

        initialPageParam: 1,

        getNextPageParam: (lastPage) =>
            lastPage?.hasNextPage ? (lastPage.pageNumber ?? 0) + 1 : undefined,
    });

    const roles = data?.pages.flatMap((page) => page?.data ?? []) ?? [];

    const loadState = isLoading
        ? "loading"
        : isError
          ? "error"
          : roles.length === 0
            ? "empty"
            : "success";

    const { mutateAsync: deleteRoleAsync, isPending: isDeleting } = useMutation(
        {
            mutationKey: [QueryConst.role.delete],
            mutationFn: deleteRole,
        }
    );

    const handleDeleteRole = useCallback(
        (role: Role) => {
            confirm({
                title: "Are you sure you want to delete this role?",
                description: `This action will permanently delete the role "${role.roleName}".`,
            })
                .then(() => deleteRoleAsync(role.roleId))
                .then(() => {
                    toast.success("Role deleted", {
                        description: `"${role.roleName}" has been deleted successfully.`,
                    });

                    queryClient.invalidateQueries({
                        queryKey: [QueryConst.role.list],
                    });
                })
                .catch((error) => {
                    if (error) {
                        console.error(error);

                        toast.error("Error deleting role", {
                            description:
                                error?.message || "Failed to delete the role.",
                        });
                    }
                });
        },
        [confirm, deleteRoleAsync, queryClient]
    );

    const handleRoleAction = useCallback(
        (type: RoleActionType, role: Role) => {
            setSelectedRole(role);

            switch (type) {
                case "edit":
                    setIsAddDialogOpen(true);
                    break;

                case "delete":
                    handleDeleteRole(role);
                    break;

                default:
                    break;
            }
        },
        [handleDeleteRole]
    );

    const { ref: loaderRef } = useInfiniteScrollObserver({
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    });

    const handleCloseDialog = () => {
        setSelectedRole(undefined);
        setIsAddDialogOpen(false);
    };

    const handleOpenAddDialog = () => {
        setSelectedRole(undefined);
        setIsAddDialogOpen(true);
    };

    return {
        data,
        roles,
        loadState,

        isLoading,
        isError,

        selectedRole,
        setSelectedRole,

        isAddDialogOpen,
        setIsAddDialogOpen,

        handleRoleAction,
        handleDeleteRole,
        handleCloseDialog,
        handleOpenAddDialog,

        filter,

        scopes,
        isScopesLoading,

        isDeleting,

        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        loaderRef,
    };
};
