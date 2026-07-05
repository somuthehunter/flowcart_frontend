import { UserRoleData } from "./user-role-data";

export interface UserData {
    status: UserStatus;
    password: string | null;
    firstName: string;
    lastName: string;
    role: UserRoleData;
    phone: string | null;
    email: string;
    created?: string;
    updated?: number;
}

export enum UserStatus {
    Active = 1,
    Disable = 2,
    PendingActivation = 3,
}

export enum UserType {
    PlatformAdmin = 1,
    MerchantOwner = 2,
    StoreManager = 3,
    Cashier = 4,
    StoreStaff = 5,
    Security = 6,
}

export type User = {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    password?: string;
    roleId: string;
    entityId: string;
    userType: UserType;
    status: UserStatus;
    profileImageUrl?: string | null;
    createdAt: string;
    updatedAt?: string | null;
    designation?: string | null;
};

export type UserDetails = User & {
    entityName?: string | null;
    roleName?: string | null;
    roleDescription?: string | null;
    isPrimaryUser: boolean;
};
