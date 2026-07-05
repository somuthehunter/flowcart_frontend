import { http, HttpResponse } from "msw";
import { config } from "@/lib/config";
import QueryConst from "@/constants/query-constants";
import {
    addFakeAdjustment,
    addFakePurchase,
    getFakeHistory,
    getFakeLedger,
    getFakeStock,
    initializeFakeInventory,
    updateFakeMinMaxStock,
} from "../fake-store/inventory";
import { PurchaseItem, AdjustmentItem } from "@/services/api/inventory-ep";

const url = (path: string) => `${config.env.API_BASE_URL}/${path}`;

export const inventoryHandlers = [
    http.get(url(QueryConst.inventory.currentStock), () => {
        initializeFakeInventory();
        return HttpResponse.json({ data: getFakeStock() });
    }),

    http.post(url(QueryConst.inventory.updateMinMax.replace(":id", ":id")), async ({ params, request }) => {
        const id = params.id as string;
        const body = (await request.json()) as { minStock: number; maxStock: number };
        updateFakeMinMaxStock(id, body.minStock, body.maxStock);
        return HttpResponse.json({ message: "Stock limits updated successfully" });
    }),

    http.post(url(QueryConst.inventory.purchase), async ({ request }) => {
        const body = (await request.json()) as Omit<PurchaseItem, "id" | "date">;
        addFakePurchase(body);
        return HttpResponse.json({ message: "Purchase added successfully" }, { status: 201 });
    }),

    http.post(url(QueryConst.inventory.adjust), async ({ request }) => {
        const body = (await request.json()) as Omit<AdjustmentItem, "id" | "date">;
        addFakeAdjustment(body);
        return HttpResponse.json({ message: "Stock adjusted successfully" }, { status: 201 });
    }),

    http.get(url(QueryConst.inventory.history), () => {
        return HttpResponse.json({ data: getFakeHistory() });
    }),

    http.get(url(QueryConst.inventory.ledger), () => {
        return HttpResponse.json({ data: getFakeLedger() });
    }),
];
