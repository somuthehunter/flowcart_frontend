import { config } from "@/lib/config";
import { HttpStatusCode } from "axios";
import { http, HttpResponse } from "msw";

import QueryConst from "@/constants/query-constants";
import type { AIAgentConfigResponse } from "@/types/response/ai-agent-response";

import { createMockAIAgentConfig } from "../fake-store/ai-agent";

const baseURL = config.env.API_BASE_URL;

let mockConfig = createMockAIAgentConfig();

export const aiAgentHandlers = [
    http.get(`${baseURL}/${QueryConst.aiAgent.config}`, () => {
        return HttpResponse.json(mockConfig, { status: HttpStatusCode.Ok });
    }),

    http.put(`${baseURL}/${QueryConst.aiAgent.config}`, async ({ request }) => {
        const body = (await request.json()) as Partial<AIAgentConfigResponse>;
        mockConfig = { ...mockConfig, ...body };
        return HttpResponse.json(null, { status: HttpStatusCode.Ok });
    }),
];
