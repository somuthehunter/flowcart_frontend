import { buildURL, getErrorString, handleApiError } from "@/lib/object-utils";
import { HttpStatusCode } from "axios";

import {
    CreateUserRequest,
    UpdateUserRequest,
    UserFilter,
} from "@/types/request/user-request";
import { ServerPaginatedData } from "@/types/response/common-response";
import { UserDetails } from "@/types/response/user-response";
import QueryConst from "@/constants/query-constants";

import httpService from "../http-service";

export const getUsers = async (params: UserFilter) => {
    try {
        const response = await httpService.get<
            ServerPaginatedData<UserDetails>
        >(QueryConst.user.list, { params });

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const getUserById = async (userId: string) => {
    try {
        const response = await httpService.get<UserDetails>(
            `${QueryConst.user.list}/${userId}`
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const createUser = async (data: CreateUserRequest) => {
    try {
        const response = await httpService.post<UserDetails>(
            QueryConst.user.create,
            data
        );
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

export const updateUser = async (data: UpdateUserRequest) => {
    try {
        const { userId, ...updateData } = data;
        const response = await httpService.put<UserDetails>(
            buildURL(QueryConst.user.update, { userId }),
            updateData
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};
