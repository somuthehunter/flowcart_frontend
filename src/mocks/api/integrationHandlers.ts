import { config } from "@/lib/config";
import { HttpStatusCode } from "axios";
import { http, HttpResponse } from "msw";

import QueryConst from "@/constants/query-constants";

import {
    integrationCategories,
    mockIntegrations,
} from "../fake-store/integrations";

const baseURL = config.env.API_BASE_URL;

export const integrationHandlers = [
    http.get(`${baseURL}/${QueryConst.integrations.list}`, () => {
        return HttpResponse.json(mockIntegrations, {
            status: HttpStatusCode.Ok,
        });
    }),

    http.get(`${baseURL}/${QueryConst.integrations.categories}`, () => {
        return HttpResponse.json(integrationCategories, {
            status: HttpStatusCode.Ok,
        });
    }),

    http.post(
        `${baseURL}/${QueryConst.integrations.connect}`,
        async ({ request }) => {
            const body = (await request.json()) as { id: string };
            const integration = mockIntegrations.find((i) => i.id === body.id);

            if (!integration) {
                return new HttpResponse(null, {
                    status: HttpStatusCode.NotFound,
                });
            }

            return HttpResponse.json(
                { ...integration, status: "connected" },
                { status: HttpStatusCode.Ok }
            );
        }
    ),

    http.post(
        `${baseURL}/${QueryConst.integrations.disconnect}`,
        async ({ request }) => {
            const body = (await request.json()) as { id: string };
            const integration = mockIntegrations.find((i) => i.id === body.id);

            if (!integration) {
                return new HttpResponse(null, {
                    status: HttpStatusCode.NotFound,
                });
            }

            return HttpResponse.json(
                { ...integration, status: "disconnected" },
                { status: HttpStatusCode.Ok }
            );
        }
    ),
];
