import { config } from "@/lib/config";
import { fakerEN_IN as faker } from "@faker-js/faker";
import { HttpStatusCode } from "axios";
import { delay, http, HttpResponse } from "msw";

import {
    CreateRoleRequest,
    UpdateRoleRequest,
} from "@/types/request/role-request";
import { ServerPaginatedData } from "@/types/response/common-response";
import { Role, RoleStatus } from "@/types/response/role-response";
import { UserType } from "@/types/response/user-response";
import QueryConst from "@/constants/query-constants";

const baseURL = config.env.API_BASE_URL;

// Generate some mock roles
const generateMockRoles = (count: number): Role[] => {
    return Array.from({ length: count }, () => ({
        roleId: faker.string.uuid(),
        roleName: faker.person.jobTitle(),
        description: faker.lorem.sentence(),
        userType: faker.helpers.arrayElement([
            UserType.PlatformAdmin,
            UserType.MerchantOwner,
            UserType.StoreManager,
        ]),
        entityId: faker.string.uuid(),
        status: faker.helpers.arrayElement([
            RoleStatus.Active,
            RoleStatus.Disable,
        ]),
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
        isPrimary: faker.datatype.boolean(),
        scopes: [],
    }));
};

let mockRoles = generateMockRoles(25);

export const roleHandlers = [
    http.get(`${baseURL}/${QueryConst.role.list}`, async ({ request }) => {
        const url = new URL(request.url);
        const pageNumber = Number(url.searchParams.get("pageNumber") || "1");
        const rowsPerPage = Number(url.searchParams.get("rowsPerPage") || "10");
        const searchKeyword = url.searchParams
            .get("searchKeyword")
            ?.toLowerCase();
        const status = url.searchParams.get("status");

        await delay(500);

        let filteredRoles = [...mockRoles];

        if (searchKeyword) {
            filteredRoles = filteredRoles.filter((r) =>
                r.roleName.toLowerCase().includes(searchKeyword)
            );
        }

        if (status) {
            filteredRoles = filteredRoles.filter(
                (r) => r.status.toString() === status
            );
        }

        const totalNumber = filteredRoles.length;
        const totalPages = Math.ceil(totalNumber / rowsPerPage);

        const start = (pageNumber - 1) * rowsPerPage;
        const data = filteredRoles.slice(start, start + rowsPerPage);

        const response: ServerPaginatedData<Role> = {
            data,
            totalNumber,
            totalPages,
            pageNumber,
            rowsPerPage,
            hasNextPage: pageNumber < totalPages,
            hasPreviousPage: pageNumber > 1,
        };

        return HttpResponse.json(response, { status: HttpStatusCode.Ok });
    }),

    http.get(`${baseURL}/iam/role/:roleId`, async ({ params }) => {
        const { roleId } = params;
        await delay(300);
        const role = mockRoles.find((r) => r.roleId === roleId);
        if (role) {
            return HttpResponse.json(role, { status: HttpStatusCode.Ok });
        }
        return new HttpResponse(null, { status: HttpStatusCode.NotFound });
    }),

    http.get(`${baseURL}/${QueryConst.role.suggestions}`, async () => {
        await delay(300);
        const suggestions = mockRoles.map((r) => ({
            roleId: r.roleId,
            roleName: r.roleName,
        }));
        return HttpResponse.json(suggestions, { status: HttpStatusCode.Ok });
    }),

    http.post(`${baseURL}/${QueryConst.role.create}`, async ({ request }) => {
        const data = (await request.json()) as CreateRoleRequest;
        await delay(600);

        const newRole: Role = {
            roleId: faker.string.uuid(),
            roleName: data.roleName,
            description: data.description || "",
            userType: UserType.PlatformAdmin,
            entityId: data.entityId,
            status: RoleStatus.Active,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPrimary: data.isPrimary,
            scopes: [],
        };

        mockRoles.unshift(newRole);

        return HttpResponse.json(newRole, { status: HttpStatusCode.Ok });
    }),

    http.put(`${baseURL}/iam/role/:roleId`, async ({ request, params }) => {
        const { roleId } = params;
        const data = (await request.json()) as UpdateRoleRequest;
        await delay(600);

        const index = mockRoles.findIndex((r) => r.roleId === roleId);
        if (index !== -1) {
            mockRoles[index] = {
                ...mockRoles[index],
                roleName: data.roleName,
                description: data.description || "",
                entityId: data.entityId,
                isPrimary: data.isPrimary,
                updatedAt: new Date().toISOString(),
            };
            return HttpResponse.json(mockRoles[index], {
                status: HttpStatusCode.Ok,
            });
        }

        return new HttpResponse(null, { status: HttpStatusCode.NotFound });
    }),

    http.delete(`${baseURL}/iam/role/:roleId`, async ({ params }) => {
        const { roleId } = params;
        await delay(500);
        mockRoles = mockRoles.filter((r) => r.roleId !== roleId);
        return new HttpResponse(null, { status: HttpStatusCode.Ok });
    }),
];
