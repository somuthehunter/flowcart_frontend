import { FC } from "react";
import { UserPlus } from "lucide-react";

import PageWithHeaderFooter, {
    PWHFHeaderActions,
} from "@/layouts/page-with-header-footer";
import useGuard from "@/hooks/useGuard";
import { DataTable, DataTableSkeleton } from "@/components/data-table";
import FailedMessage from "@/components/failed-message";
import { Button } from "@/components/ui/button";

import { UserAddDialog } from "./components/user-add-dialog";
import { UserFilter } from "./components/user-filter";
import { useUserFilter } from "./hooks/use-user-filter";
import { useUsers } from "./hooks/use-users";

const UsersPage: FC = () => {
    // Only Admin can create users, Manager can only view
    const { hasRole } = useGuard();
    const canCreateUser = hasRole("Admin");

    const filter = useUserFilter();
    const {
        dataTable,
        userLoadState,
        rows,
        isAddDialogOpen,
        handleCloseDialog,
        selectedUser,
        handleOpenAddDialog,
    } = useUsers(filter);

    return (
        <PageWithHeaderFooter
            title="Users"
            description="Manage user accounts and roles.">
            <PWHFHeaderActions>
                {canCreateUser && (
                    <Button size="sm" onClick={handleOpenAddDialog}>
                        <UserPlus className="h-4 w-4" />
                        Create User
                    </Button>
                )}
            </PWHFHeaderActions>
            <div className="flex flex-col gap-6">
                <UserFilter {...filter} />

                <div className="mx-auto w-full">
                    {userLoadState === "pending" && (
                        <DataTableSkeleton columnCount={5} />
                    )}

                    {userLoadState === "success" && rows.length > 0 && (
                        <DataTable table={dataTable.table} />
                    )}

                    {userLoadState === "success" && rows.length === 0 && (
                        <FailedMessage
                            type="no-data"
                            text="No users found matching your criteria"
                        />
                    )}

                    {userLoadState === "error" && (
                        <FailedMessage
                            type="error"
                            text="Failed to load users. Please try again later."
                        />
                    )}
                </div>
            </div>

            {isAddDialogOpen && (
                <UserAddDialog
                    isOpen={isAddDialogOpen}
                    onClose={handleCloseDialog}
                    user={selectedUser}
                />
            )}
        </PageWithHeaderFooter>
    );
};

export default UsersPage;
