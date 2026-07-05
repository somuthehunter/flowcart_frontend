import { getErrorString, handleApiError } from "@/lib/object-utils";
import httpService from "@/services/http-service";
import { HttpStatusCode } from "axios";

import { AIAgentConfigResponse } from "@/types/response/ai-agent-response";
import QueryConst from "@/constants/query-constants";

export const getAIAgentConfig = async () => {
    try {
        const response = await httpService.get<AIAgentConfigResponse>(
            QueryConst.aiAgent.config
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const updateAIAgentConfig = async (data: AIAgentConfigResponse) => {
    try {
        const response = await httpService.put<void>(
            QueryConst.aiAgent.config,
            data
        );
        if (response.status === HttpStatusCode.Ok) {
            return true;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};
