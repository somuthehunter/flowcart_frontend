import { getErrorString, handleApiError } from "@/lib/object-utils";
import { HttpStatusCode } from "axios";

import {
    ChangePasswordPayload,
    SignInRequest,
} from "@/types/request/auth-request";
import {
    RefreshTokenResponse,
    SignInResponse,
} from "@/types/response/auth-response";
import QueryConst from "@/constants/query-constants";

import httpService from "../http-service";
import { CommonResponse } from "@/types/response/common-response";

export const forgotPassword = async (email: string) => {
    try {
        const response = await httpService.post<CommonResponse>(
            QueryConst.auth.forgotPassword,
            { email }
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response), {
            cause: "Server Notified!",
        });
    } catch (error) {
        handleApiError(error);
    }
};

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await httpService.put<CommonResponse>(
            QueryConst.auth.resetPassword,
            {
                token,
                newPassword,
            }
        );

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }

        throw new Error(getErrorString(response), {
            cause: "Server Notified!",
        });
    } catch (error) {
        handleApiError(error);
    }
};

export const changePassword = async (payload: ChangePasswordPayload) => {
    try {
        const response = await httpService.put(
            QueryConst.auth.changePassword,
            payload
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data || "Password updated successfully!";
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const login = async (data: SignInRequest) => {
    try {
        const response = await httpService.post<SignInResponse>(
            QueryConst.auth.login,
            data
        );

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }

        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const logout = async (refreshToken: string | null) => {
    try {
        const response = await httpService.post(QueryConst.auth.logout, { refreshToken });

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }

        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const refreshToken = async (refreshTokenStr: string | null) => {
    try {
        const response = await httpService.post<RefreshTokenResponse>(
            QueryConst.auth.refreshToken,
            { refreshToken: refreshTokenStr }
        );

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }

        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};
