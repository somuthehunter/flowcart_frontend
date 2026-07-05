import { UserStatus, UserType } from "../response/user-response";
import { NullableOptional } from "../utility-types";
import { PageParams, SortOrder } from "./common-request";

export enum UserSortBy {
    FirstName = 1,
    LastName = 2,
    Email = 3,
    Phone = 4,
    CreatedAt = 5,
    UpdatedAt = 6,
}

export type UserFilter = PageParams &
    NullableOptional<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        status: UserStatus;
        userType?: UserType;
        entityId: string;
        roleId: string;
        searchKeyword: string;
        sortBy: UserSortBy;
        sortOrder: SortOrder;
    }>;

export type CreateUserRequest = {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password?: string;
    roleId: string;
    entityId?: string;
    userType: UserType;
    status?: UserStatus;
    profileImageUrl?: string | null;
};

export type UpdateUserRequest = Omit<CreateUserRequest, "password"> & {
    userId: string;
};
