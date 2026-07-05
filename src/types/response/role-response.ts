import { UserType } from "./user-response";

export type RoleSuggestion = {
    roleId: string;
    roleName: string;
};

export enum RoleStatus {
    Active = 1,
    Disable,
}
// todo: Update later based on actual API response structure
enum AccessType {
    read = 1,
}

export type Role = {
    roleId: string;
    roleName: string;
    description: string;
    userType: UserType;
    entityId: string;
    status: RoleStatus;
    createdAt: string;
    updatedAt: string;
    isPrimary: boolean;
    scopes: Scope[];
};

export type Scope = {
    scopeId: string;
    scopeName: string;
    accessType: AccessType;
    displayName: string;
    groupName: string;
    groupSortOrder: number;
    scopeSortOrder: number;
    description: string;
};
