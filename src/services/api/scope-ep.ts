import { getErrorString, handleApiError } from "@/lib/object-utils";
import { HttpStatusCode } from "axios";

import { ScopeSuggestion } from "@/types/response/scope-response";
import QueryConst from "@/constants/query-constants";

import httpService from "../http-service";

export const getScopeSuggestions = async () => {
    try {
        const response = await httpService.get<ScopeSuggestion[]>(
            QueryConst.scope.suggestions
        );

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};
