import { buildURL, getErrorString, handleApiError } from "@/lib/object-utils";
import { HttpStatusCode } from "axios";

import { CreateDealerRequest, DealerFilterParams, UpdateDealerRequest } from "@/types/request/dealer-request";
import { DealerDetails } from "@/types/response/dealer-response";
import { ServerPaginatedData } from "@/types/response/common-response";
import QueryConst from "@/constants/query-constants";

import httpService from "../http-service";

export const createDealer = async (payload: CreateDealerRequest) => {
    try {
        const response = await httpService.post<DealerDetails>(
            QueryConst.dealers.create,
            payload
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

export const getDealers = async (params: DealerFilterParams) => {
    try {
        const response = await httpService.get<ServerPaginatedData<DealerDetails>>(
            QueryConst.dealers.list,
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

export const getDealerDetailsById = async (dealerId: string) => {
    try {
        const url = buildURL(QueryConst.dealers.details, { dealerId });
        const response = await httpService.get<DealerDetails>(url);

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const updateDealerAction = async (payload: UpdateDealerRequest) => {
    try {
        const { dealerId, ...rest } = payload;
        const response = await httpService.put<DealerDetails>(
            buildURL(QueryConst.dealers.update, { dealerId }),
            rest
        );

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};
