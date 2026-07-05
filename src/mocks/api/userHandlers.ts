import { config } from "@/lib/config";
import { HttpStatusCode } from "axios";
import { delay, http, HttpResponse } from "msw";
import { fakerEN_IN as faker } from "@faker-js/faker";

import QueryConst from "@/constants/query-constants";
import { UserDetails, UserStatus, UserType } from "@/types/response/user-response";
import { ServerPaginatedData } from "@/types/response/common-response";
import { CreateUserRequest, UpdateUserRequest } from "@/types/request/user-request";

const baseURL = config.env.API_BASE_URL;

const generateMockUsers = (count: number): UserDetails[] => {
    return Array.from({ length: count }, () => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        return {
            userId: faker.string.uuid(),
            firstName,
            lastName,
            email: faker.internet.email({ firstName, lastName }),
            phone: faker.phone.number(),
            entityId: faker.string.uuid(),
            roleId: faker.string.uuid(),
            entityName: faker.company.name(),
            roleName: faker.person.jobTitle(),
            userType: faker.helpers.arrayElement([UserType.PlatformAdmin, UserType.MerchantOwner, UserType.StoreManager]),
            status: faker.helpers.arrayElement([UserStatus.Active, UserStatus.Disable]),
            profileImageUrl: faker.image.avatar(),
            createdAt: faker.date.past().toISOString(),
            updatedAt: faker.date.recent().toISOString(),
            isPrimaryUser: faker.datatype.boolean(),
        };
    });
};

const mockUsers = generateMockUsers(45);

export const userHandlers = [
    http.get(`${baseURL}/${QueryConst.user.list}`, async ({ request }) => {
        const url = new URL(request.url);
        const pageNumber = Number(url.searchParams.get("pageNumber") || "1");
        const rowsPerPage = Number(url.searchParams.get("rowsPerPage") || "20");
        const searchKeyword = url.searchParams.get("searchKeyword")?.toLowerCase();
        const status = url.searchParams.get("status");

        await delay(600);

        let filteredUsers = [...mockUsers];
        
        if (searchKeyword) {
            filteredUsers = filteredUsers.filter(u => 
                u.firstName.toLowerCase().includes(searchKeyword) || 
                u.lastName.toLowerCase().includes(searchKeyword) ||
                u.email.toLowerCase().includes(searchKeyword)
            );
        }

        if (status) {
            filteredUsers = filteredUsers.filter(u => u.status.toString() === status);
        }

        const totalNumber = filteredUsers.length;
        const totalPages = Math.ceil(totalNumber / rowsPerPage);
        
        const start = (pageNumber - 1) * rowsPerPage;
        const data = filteredUsers.slice(start, start + rowsPerPage);

        const response: ServerPaginatedData<UserDetails> = {
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

    http.get(`${baseURL}/${QueryConst.user.list}/:userId`, async ({ params }) => {
        const { userId } = params;
        await delay(300);
        const user = mockUsers.find(u => u.userId === userId);
        if (user) {
            return HttpResponse.json(user, { status: HttpStatusCode.Ok });
        }
        return new HttpResponse(null, { status: HttpStatusCode.NotFound });
    }),

    http.post(`${baseURL}/${QueryConst.user.create}`, async ({ request }) => {
        const data = (await request.json()) as CreateUserRequest;
        await delay(800);
        
        const newUser: UserDetails = {
            userId: faker.string.uuid(),
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || "",
            entityId: data.entityId || faker.string.uuid(),
            roleId: data.roleId,
            entityName: "New Entity",
            roleName: "Assigned Role",
            userType: data.userType,
            status: data.status || UserStatus.Active,
            profileImageUrl: data.profileImageUrl || "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPrimaryUser: false,
        };
        
        mockUsers.unshift(newUser);
        
        return HttpResponse.json(newUser, { status: HttpStatusCode.Created });
    }),

    http.put(`${baseURL}/${QueryConst.user.update}/:userId`, async ({ request, params }) => {
        const { userId } = params;
        const data = (await request.json()) as UpdateUserRequest;
        await delay(600);
        
        const index = mockUsers.findIndex(u => u.userId === userId);
        if (index !== -1) {
            mockUsers[index] = {
                ...mockUsers[index],
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone || "",
                roleId: data.roleId,
                userType: data.userType,
                status: data.status || mockUsers[index].status,
                entityId: data.entityId || mockUsers[index].entityId,
                updatedAt: new Date().toISOString(),
            };
            return HttpResponse.json(mockUsers[index], { status: HttpStatusCode.Ok });
        }
        
        return new HttpResponse(null, { status: HttpStatusCode.NotFound });
    }),
];
