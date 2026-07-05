import { getErrorString, handleApiError } from "@/lib/object-utils";
import httpService from "@/services/http-service";
import { HttpStatusCode } from "axios";

import {
    IntegrationCategoryResponse,
    IntegrationResponse,
} from "@/types/response/integration-response";
import QueryConst from "@/constants/query-constants";

export const getIntegrations = async () => {
    try {
        const response = await httpService.get<IntegrationResponse[]>(
            QueryConst.integrations.list
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const getIntegrationCategories = async () => {
    try {
        const response = await httpService.get<IntegrationCategoryResponse[]>(
            QueryConst.integrations.categories
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const connectIntegration = async (id: string, apiKey?: string) => {
    try {
        const response = await httpService.post(
            QueryConst.integrations.connect,
            { id, apiKey }
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const disconnectIntegration = async (id: string) => {
    try {
        const response = await httpService.post(
            QueryConst.integrations.disconnect,
            { id }
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};
