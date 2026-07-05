import { useCallback, useMemo, useState } from "react";
import { getRoleSuggestions } from "@/services/api/role-ep";
import { getUsers, updateUser } from "@/services/api/user-ep";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { UserDetails, UserStatus } from "@/types/response/user-response";
import QueryConst from "@/constants/query-constants";
import useConfirm from "@/hooks/useConfirm";
import { useDataTable } from "@/hooks/useDataTable";

import { getColumns, UserActionType } from "../lib/get-columns";
import { UserFilterProps } from "./use-user-filter";

export const useUsers = (filters: UserFilterProps) => {
    const [selectedUser, setSelectedUser] = useState<UserDetails>();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const confirm = useConfirm();

    const { data, status: userLoadState } = useQuery({
        queryKey: [
            QueryConst.user.list,
            filters.pageNumber,
            filters.rowsPerPage,
            filters.debouncedSearchKeyword,
            filters.status,
        ],
        queryFn: () =>
            getUsers({
                pageNumber: filters.pageNumber,
                rowsPerPage: filters.rowsPerPage,
                searchKeyword: filters.debouncedSearchKeyword,
                status: filters.status,
            }),
    });

    const { data: roles, isPending: isRolesLoading } = useQuery({
        queryKey: [QueryConst.role.suggestions],
        queryFn: getRoleSuggestions,
    });

    const { mutateAsync: toggleStatusAsync, isPending: isToggling } =
        useMutation({
            mutationFn: updateUser,
        });

    const rows = useMemo(() => {
        return data?.data || [];
    }, [data]);

    const handleToggleStatus = useCallback(
        async (data: UserDetails) => {
            const isCurrentlyActive = data.status === UserStatus.Active;

            try {
                // Wait for confirmation - throws error if cancelled by the user
                await confirm({
                    title: "Are you sure?",
                    description: `Do you want to ${isCurrentlyActive ? "disable" : "enable"} ${data.firstName} ${data.lastName}?`,
                });
            } catch {
                // User cancelled, do nothing
                return;
            }

            try {
                const payload = {
                    ...data,
                    status: isCurrentlyActive
                        ? UserStatus.Disable
                        : UserStatus.Active,
                    userId: data.userId,
                    phone: data.phone ?? undefined,
                };

                await toggleStatusAsync(payload);

                toast.success(
                    `User ${isCurrentlyActive ? "disabled" : "enabled"} successfully`
                );

                queryClient.invalidateQueries({
                    queryKey: [QueryConst.user.list],
                });
            } catch (error) {
                if (error) {
                    toast.error("Failed to update user status");
                }
            }
        },
        [confirm, toggleStatusAsync, queryClient]
    );

    const handleRowAction = useCallback(
        async (type: UserActionType, data: UserDetails) => {
            setSelectedUser(data);
            switch (type) {
                case "edit":
                    setIsAddDialogOpen(true);
                    break;
                case "toggleStatus": {
                    handleToggleStatus(data);
                    break;
                }
                default:
                    break;
            }
        },
        [handleToggleStatus]
    );

    const columns = useMemo(
        () => getColumns({ onAction: handleRowAction }),
        [handleRowAction]
    );

    const dataTable = useDataTable({
        columns,
        data: rows,
        totalRows: data?.totalNumber ?? 0,
        page: filters.pageNumber ?? 1,
        rowsPerPage: filters.rowsPerPage ?? 10,
        onPageChange: (page, rowsPerPage) => {
            if (rowsPerPage !== filters.rowsPerPage) {
                filters.handleChange("rowsPerPage", rowsPerPage);
            } else {
                filters.handlePageChange(page);
            }
        },
        initialColumnPinning: { right: ["actions"] },
        getRowId: (row) => row.userId,
    });

    const handleCloseDialog = () => {
        setSelectedUser(undefined);
        setIsAddDialogOpen(false);
    };

    const handleOpenAddDialog = () => {
        setSelectedUser(undefined);
        setIsAddDialogOpen(true);
    };

    return {
        rows,
        columns,
        data,
        dataTable,
        userLoadState,
        selectedUser,
        setSelectedUser,
        isAddDialogOpen,
        setIsAddDialogOpen,
        handleCloseDialog,
        handleOpenAddDialog,
        filters,
        roles,
        isRolesLoading,
        isToggling,
    };
};
