import { config } from "@/lib/config";
import { HttpStatusCode } from "axios";
import { delay, http, HttpResponse } from "msw";
import { fakerEN_IN as faker } from "@faker-js/faker";

import QueryConst from "@/constants/query-constants";
import { ScopeSuggestion } from "@/types/response/scope-response";

const baseURL = config.env.API_BASE_URL;

const mockScopes: ScopeSuggestion[] = [
    {
        scopeId: faker.string.uuid(),
        scopeName: "users.view",
        accessType: 1,
        displayName: "View Users",
        groupName: "User Management",
        groupSortOrder: 1,
        scopeSortOrder: 1,
        description: "Allow viewing the users list",
    },
    {
        scopeId: faker.string.uuid(),
        scopeName: "users.manage",
        accessType: 1,
        displayName: "Manage Users",
        groupName: "User Management",
        groupSortOrder: 1,
        scopeSortOrder: 2,
        description: "Allow creating, updating, and deleting users",
    },
    {
        scopeId: faker.string.uuid(),
        scopeName: "roles.view",
        accessType: 1,
        displayName: "View Roles",
        groupName: "Role Management",
        groupSortOrder: 2,
        scopeSortOrder: 1,
        description: "Allow viewing the roles list",
    },
    {
        scopeId: faker.string.uuid(),
        scopeName: "roles.manage",
        accessType: 1,
        displayName: "Manage Roles",
        groupName: "Role Management",
        groupSortOrder: 2,
        scopeSortOrder: 2,
        description: "Allow creating, updating, and deleting roles",
    },
    {
        scopeId: faker.string.uuid(),
        scopeName: "settings.view",
        accessType: 1,
        displayName: "View Settings",
        groupName: "System Settings",
        groupSortOrder: 3,
        scopeSortOrder: 1,
        description: "Allow viewing system settings",
    },
];

export const scopeHandlers = [
    http.get(`${baseURL}/${QueryConst.scope.suggestions}`, async () => {
        await delay(400);
        return HttpResponse.json(mockScopes, { status: HttpStatusCode.Ok });
    }),
];
