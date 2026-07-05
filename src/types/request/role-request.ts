import { RoleStatus } from "../response/role-response";
export type RoleFilter = {
    pageNumber?: number;
    rowsPerPage?: number;
    searchKeyword?: string;
    sortBy?: string;
    sortOrder?: string;
    status?: RoleStatus | null;
};

export type CreateRoleRequest = {
    roleName: string;
    description?: string;
    entityId: string;
    isPrimary: boolean;
    scopeIds: string[];
};

export type UpdateRoleRequest = CreateRoleRequest & {
    roleId: string;
};
