import { FC } from "react";
import { Plus } from "lucide-react";

import PageWithHeaderFooter, {
    PWHFHeaderActions,
} from "@/layouts/page-with-header-footer";
import { Button } from "@/components/ui/button";

import RoleAddDialog from "./components/role-add-dialog";
import RoleCard from "./components/role-card";
import { RoleCardSkeleton } from "./components/role-card-skeleton";
import { RoleFilter } from "./components/role-filter";
import { useRoleFilter } from "./hooks/use-role-filter";
import { useRoles } from "./hooks/use-roles";

const RolesPage: FC = () => {
    const filter = useRoleFilter();
    const {
        roles,
        loadState,
        loaderRef,
        isFetchingNextPage,
        isAddDialogOpen,
        setIsAddDialogOpen,
        selectedRole,
        handleRoleAction,
        handleOpenAddDialog,
    } = useRoles(filter);

    return (
        <PageWithHeaderFooter
            title="Roles"
            description="Manage access control roles and permissions.">
            <PWHFHeaderActions>
                <Button size="sm" onClick={handleOpenAddDialog}>
                    <Plus className="h-4 w-4" />
                    Create Role
                </Button>
            </PWHFHeaderActions>
            <div className="flex flex-col gap-6">
                <RoleFilter {...filter} />

                {loadState === "error" && (
                    <div className="text-destructive p-8 text-center">
                        Failed to load roles. Please try again later.
                    </div>
                )}

                {loadState === "empty" && (
                    <div className="text-muted-foreground bg-muted/10 rounded-lg border p-8 text-center">
                        No roles found matching your criteria.
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {(loadState === "success" || loadState === "loading") &&
                        roles.map((role) => (
                            <RoleCard
                                key={role.roleId}
                                data={role}
                                onAction={handleRoleAction}
                            />
                        ))}

                    {(loadState === "loading" || isFetchingNextPage) && (
                        <>
                            <RoleCardSkeleton />
                            <RoleCardSkeleton />
                            <RoleCardSkeleton />
                            <RoleCardSkeleton />
                        </>
                    )}
                </div>

                <div ref={loaderRef} className="h-4 w-full" />
            </div>
            {isAddDialogOpen && (
                <RoleAddDialog
                    isOpen={isAddDialogOpen}
                    onClose={() => setIsAddDialogOpen(false)}
                    role={selectedRole}
                />
            )}
        </PageWithHeaderFooter>
    );
};

export default RolesPage;
