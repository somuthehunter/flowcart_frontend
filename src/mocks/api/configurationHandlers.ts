import { config } from "@/lib/config";
import { HttpStatusCode } from "axios";
import { delay, http, HttpResponse } from "msw";

import QueryConst from "@/constants/query-constants";

import {
    createMockAvailableNumber,
    createMockOwnedNumber,
    createMockSocialConnection,
    mockChannelSettings,
    mockEscalationSettings,
    mockLeadForm,
    mockTeamMembers,
    mockUsageStats,
    mockWidgetSettings,
} from "../fake-store/configuration";

const baseURL = config.env.API_BASE_URL;

export const configurationHandlers = [
    http.get(`${baseURL}/${QueryConst.channels.ownedNumbers}`, async () => {
        await delay(500);
        return HttpResponse.json(
            [createMockOwnedNumber(), createMockOwnedNumber()],
            { status: HttpStatusCode.Ok }
        );
    }),

    http.get(
        `${baseURL}/${QueryConst.channels.availableNumbers}`,
        async ({ request }) => {
            const url = new URL(request.url);
            const areaCode = url.searchParams.get("areaCode") || undefined;
            await delay(800);
            return HttpResponse.json(
                Array.from({ length: 8 }, () =>
                    createMockAvailableNumber(areaCode)
                ),
                { status: HttpStatusCode.Ok }
            );
        }
    ),

    http.post(`${baseURL}/${QueryConst.channels.buyNumber}`, async () => {
        await delay(1000);
        return HttpResponse.json(createMockOwnedNumber(), {
            status: HttpStatusCode.Created,
        });
    }),

    http.get(
        `${baseURL}/${QueryConst.channels.socialConnections}`,
        async () => {
            await delay(500);
            return HttpResponse.json(
                [
                    {
                        ...createMockSocialConnection("facebook"),
                        status: "connected",
                    },
                    {
                        ...createMockSocialConnection("instagram"),
                        status: "disconnected",
                        name: "",
                    },
                    {
                        ...createMockSocialConnection("whatsapp"),
                        status: "disconnected",
                        name: "",
                    },
                ],
                { status: HttpStatusCode.Ok }
            );
        }
    ),

    http.post(
        `${baseURL}/${QueryConst.channels.connectSocial}`,
        async ({ request }) => {
            const { platform } = (await request.json()) as { platform: "facebook" | "instagram" | "whatsapp" };
            await delay(1500);
            return HttpResponse.json(
                {
                    ...createMockSocialConnection(platform),
                    status: "connected",
                },
                { status: HttpStatusCode.Ok }
            );
        }
    ),

    http.post(
        `${baseURL}/${QueryConst.channels.disconnectSocial}`,
        async () => {
            await delay(500);
            return HttpResponse.json(
                { success: true },
                { status: HttpStatusCode.Ok }
            );
        }
    ),

    http.get(`${baseURL}/${QueryConst.channels.settings}`, async () => {
        await delay(300);
        return HttpResponse.json(mockChannelSettings, {
            status: HttpStatusCode.Ok,
        });
    }),

    http.patch(
        `${baseURL}/${QueryConst.channels.settings}`,
        async ({ request }) => {
            const updates = (await request.json()) as object;
            await delay(500);
            return HttpResponse.json(
                { ...mockChannelSettings, ...updates },
                { status: HttpStatusCode.Ok }
            );
        }
    ),

    http.get(`${baseURL}/${QueryConst.channels.usageStats}`, async () => {
        await delay(300);
        return HttpResponse.json(mockUsageStats, { status: HttpStatusCode.Ok });
    }),

    http.get(`${baseURL}/${QueryConst.widget.settings}`, async () => {
        await delay(300);
        return HttpResponse.json(mockWidgetSettings, {
            status: HttpStatusCode.Ok,
        });
    }),

    http.patch(
        `${baseURL}/${QueryConst.widget.settings}`,
        async ({ request }) => {
            const updates = (await request.json()) as object;
            await delay(500);
            return HttpResponse.json(
                { ...mockWidgetSettings, ...updates },
                { status: HttpStatusCode.Ok }
            );
        }
    ),

    http.get(`${baseURL}/${QueryConst.widget.forms}`, async () => {
        await delay(300);
        return HttpResponse.json(mockLeadForm, { status: HttpStatusCode.Ok });
    }),

    http.patch(`${baseURL}/${QueryConst.widget.forms}`, async ({ request }) => {
        const updates = (await request.json()) as object;
        await delay(500);
        return HttpResponse.json(
            { ...mockLeadForm, ...updates },
            { status: HttpStatusCode.Ok }
        );
    }),

    http.get(`${baseURL}/${QueryConst.escalation.settings}`, async () => {
        await delay(300);
        return HttpResponse.json(mockEscalationSettings, {
            status: HttpStatusCode.Ok,
        });
    }),

    http.patch(
        `${baseURL}/${QueryConst.escalation.settings}`,
        async ({ request }) => {
            const updates = (await request.json()) as object;
            await delay(500);
            return HttpResponse.json(
                { ...mockEscalationSettings, ...updates },
                { status: HttpStatusCode.Ok }
            );
        }
    ),

    http.get(`${baseURL}/${QueryConst.escalation.teamMembers}`, async () => {
        await delay(300);
        return HttpResponse.json(mockTeamMembers, {
            status: HttpStatusCode.Ok,
        });
    }),
];
