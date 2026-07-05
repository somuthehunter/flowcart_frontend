import { http, HttpResponse } from "msw";
import { config } from "@/lib/config";
import QueryConst from "@/constants/query-constants";
import { Bill, CreateBillRequest } from "@/services/api/bill-ep";
import {
    addFakeBill,
    getFakeBillDetails,
    getFakeBills,
} from "../fake-store/bills";

const url = (path: string) => `${config.env.API_BASE_URL}/${path}`;

export const billHandlers = [
    http.get(url(QueryConst.billing.list), () => {
        return HttpResponse.json({ data: getFakeBills() });
    }),

    http.get(url(QueryConst.billing.details.replace(":id", ":id")), ({ params }) => {
        const id = params.id as string;
        const bill = getFakeBillDetails(id);
        
        if (bill) {
            return HttpResponse.json({ data: bill });
        }
        return new HttpResponse(null, { status: 404, statusText: "Not Found" });
    }),

    http.post(url(QueryConst.billing.create), async ({ request }) => {
        const body = (await request.json()) as CreateBillRequest;
        const newBill = addFakeBill(body);
        return HttpResponse.json(
            { message: "Bill created successfully", data: newBill },
            { status: 201 }
        );
    }),
];
