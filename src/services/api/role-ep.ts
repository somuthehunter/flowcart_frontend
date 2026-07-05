import { buildURL, getErrorString, handleApiError } from "@/lib/object-utils";
import { HttpStatusCode } from "axios";

import {
    CreateRoleRequest,
    RoleFilter,
    UpdateRoleRequest,
} from "@/types/request/role-request";
import { ServerPaginatedData } from "@/types/response/common-response";
import {
    Role,
    RoleSuggestion,

} from "@/types/response/role-response";
import QueryConst from "@/constants/query-constants";

import httpService from "../http-service";

export const getRoles = async (params: RoleFilter) => {
    try {
        const response = await httpService.get<ServerPaginatedData<Role>>(
            QueryConst.role.list,
            { params }
        );

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const getRoleById = async (roleId: string) => {
    try {
        const url = buildURL(QueryConst.role.details, { roleId });
        const response = await httpService.get<Role>(url);

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const getRoleSuggestions = async () => {
    try {
        const response = await httpService.get<RoleSuggestion[]>(
            QueryConst.role.suggestions
        );

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const createRole = async (data: CreateRoleRequest) => {
    try {
        const response = await httpService.post(QueryConst.role.create, data);

        if (
            response.status === HttpStatusCode.Ok ||
            response.status === HttpStatusCode.Created
        ) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const updateRole = async (data: UpdateRoleRequest) => {
    try {
        const url = buildURL(QueryConst.role.update, { roleId: data.roleId });
        const response = await httpService.put(url, data);

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const deleteRole = async (roleId: string) => {
    try {
        const url = buildURL(QueryConst.role.delete, { roleId });
        const response = await httpService.delete(url);

        if (
            response.status === HttpStatusCode.Ok ||
            response.status === HttpStatusCode.NoContent
        ) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

