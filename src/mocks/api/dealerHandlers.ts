import { config } from "@/lib/config";
import { HttpStatusCode } from "axios";
import { delay, http, HttpResponse } from "msw";

import { CreateDealerRequest } from "@/types/request/dealer-request";
import { DealerDetails } from "@/types/response/dealer-response";
import QueryConst from "@/constants/query-constants";

import { createMockDealer } from "../fake-store/dealer";

const baseURL = config.env.API_BASE_URL;

export const dealerHandlers = [
    http.post(`${baseURL}/${QueryConst.dealers.create}`, async ({ request }) => {
        const body = (await request.json()) as CreateDealerRequest;
        await delay(1000);

        const dealerId = crypto.randomUUID();
        const newDealer: DealerDetails = {
            ...body,
            dealerId,
            dealerCode: null,
            status: 1, // DealerStatus.PendingActivation
            ownerName: null,
            addresses: body.addresses.map((addr) => ({
                ...addr,
                addressId: crypto.randomUUID(),
                dealerId,
                latitude: "0",
                longitude: "0",
            })),
            contactPersons: body.contactPersons.map((cp) => ({
                ...cp,
                contactId: crypto.randomUUID(),
                dealerId,
            })),
            departmentBusinessHours: body.departmentBusinessHours.map((dept) => ({
                ...dept,
                dealerId,
            })),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            logUsername: "system",
            logDts: new Date().toISOString(),
        };

        return HttpResponse.json(newDealer, {
            status: HttpStatusCode.Created,
        });
    }),

    http.get(`${baseURL}/${QueryConst.dealers.list}`, async () => {
        await delay(800);
        return HttpResponse.json(
            Array.from({ length: 5 }, () => createMockDealer()),
            { status: HttpStatusCode.Ok }
        );
    }),
];
