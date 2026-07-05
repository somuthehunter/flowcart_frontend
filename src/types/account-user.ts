import { UserRoles } from "./types";
import { UserScopes } from "./user-scopes";
import { UserType } from "./response/user-response";

export type AccountUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl?: string;
    entityId: string;
    userType: UserType;
    roleId: string;
    phoneNumber: string;
    role: UserRoles;
    scopes: UserScopes[];
    expiresAt: number; 
    accessToken?: string;
};
