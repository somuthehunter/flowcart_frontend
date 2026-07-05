import { fakerEN_IN as faker } from "@faker-js/faker";

import { UserStatus, UserType } from "@/types/response/user-response";
import { UserRoles } from "@/types/types";
import { UserScopes } from "@/types/user-scopes";

function createUserRoleData(
    id: number,
    name: UserRoles,
    description: string,
    scopes: UserScopes[],
    canBeDeleted: boolean
) {
    return {
        id,
        name,
        description,
        scopes,
        canBeDeleted,
    };
}

function createAuthUserData(
    id: string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    created: string,
    updated: string,
    status: UserStatus,
    role: UserType
) {
    return {
        id,
        firstName,
        lastName,
        phone,
        email,
        role,
        created,
        updated,
        status,
    };
}

export const userRoleData = [
    createUserRoleData(
        1,
        "Platform Admin",
        "Full access admin role",
        [
            "merchant.view",
            "merchant.update",
            "platform.manage",
        ],
        false
    ),
    createUserRoleData(
        2,
        "Merchant Owner",
        "Merchant Owner role with full store access",
        ["merchant.update", "product.view", "product.create", "product.update"],
        false
    ),
    createUserRoleData(
        3,
        "Store Manager",
        "Store Manager role",
        ["product.view", "inventory.update"],
        false
    ),
];

const rawRoles = {
    admin: createAuthUserData(
        faker.string.uuid(),
        "System",
        "Admin",
        faker.phone.number(),
        "admin@flowpay.com",
        faker.date.anytime()?.toISOString(),
        faker.date.anytime()?.toISOString(),
        UserStatus.Active,
        UserType.PlatformAdmin
    ),
    manager: createAuthUserData(
        faker.string.uuid(),
        "John",
        "Smith",
        faker.phone.number(),
        "john.smith@merchant.com",
        faker.date.anytime()?.toISOString(),
        faker.date.anytime()?.toISOString(),
        UserStatus.Active,
        UserType.MerchantOwner
    ),
    viewer: createAuthUserData(
        faker.string.uuid(),
        "Store",
        "Manager",
        faker.phone.number(),
        "manager@merchant.com",
        faker.date.anytime()?.toISOString(),
        faker.date.anytime()?.toISOString(),
        UserStatus.Active,
        UserType.StoreManager
    ),
};

export const authUsers = {
    admin: rawRoles.admin,
    manager: rawRoles.manager,
    viewer: rawRoles.viewer,
};

export const authPasswords: Record<keyof typeof authUsers, string> = {
    admin: "admin@123",
    manager: "merchant@123",
    viewer: "manager@123",
};

export const allRoles = [
    "users.manage",
    "users.edit",
    "users.delete",
    "users.create",
    "users.reset",
    "users.role.view",
    "users.role.edit",
    "users.role.delete",
    "users.role.reset",
];

export const createAdminUsers = (rows: number) =>
    Array.from({ length: rows }, () => ({
        userId: faker.string.uuid(),
        cognitosub: faker.string.uuid(),
        email: faker.internet.email().toLowerCase(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
        userType: faker.helpers.arrayElement([
            UserType.PlatformAdmin,
            UserType.MerchantOwner,
            UserType.StoreManager,
        ]),

        entityId: faker.string.uuid(),
        status: faker.helpers.arrayElement([
            UserStatus.Active,
            UserStatus.PendingActivation,
            UserStatus.Disable,
        ]),
        profileImageUrl: faker.image.avatar(),
        createdAt: faker.date.past()?.toISOString(),
        updatedAt: faker.date.recent()?.toISOString(),
        createdBy: faker.string.uuid(),
        updatedBy: faker.string.uuid(),
    }));
