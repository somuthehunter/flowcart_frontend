import { HttpStatusCode } from "axios";
import httpService from "@/services/http-service";
import QueryConst from "@/constants/query-constants";
import { getErrorString, handleApiError } from "@/lib/object-utils";

export interface StockItem {
    id: string;
    productName: string;
    sku: string;
    currentStock: number;
    minStock: number;
    maxStock: number;
}

export interface PurchaseItem {
    id: string;
    productName: string;
    sku: string;
    quantity: number;
    purchasePrice: number;
    supplier: string;
    date: string;
}

export interface AdjustmentItem {
    id: string;
    productName: string;
    sku: string;
    quantity: number;
    reason: string;
    date: string;
}

export interface LedgerItem {
    id: string;
    productName: string;
    sku: string;
    transactionType: "Purchase" | "Adjustment" | "Sale";
    quantityChanged: number;
    balance: number;
    date: string;
}

export const getCurrentStock = async () => {
    try {
        const response = await httpService.get<{ data: StockItem[] }>(
            QueryConst.inventory.currentStock
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const updateMinMaxStock = async (
    id: string,
    params: { minStock: number; maxStock: number }
) => {
    try {
        const response = await httpService.post<{ message: string }>(
            QueryConst.inventory.updateMinMax.replace(":id", id),
            params
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

export const purchaseStock = async (params: Omit<PurchaseItem, "id" | "date">) => {
    try {
        const response = await httpService.post<{ message: string }>(
            QueryConst.inventory.purchase,
            params
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

export const adjustStock = async (params: Omit<AdjustmentItem, "id" | "date">) => {
    try {
        const response = await httpService.post<{ message: string }>(
            QueryConst.inventory.adjust,
            params
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

export const getStockHistory = async () => {
    try {
        const response = await httpService.get<{ data: (PurchaseItem | AdjustmentItem)[] }>(
            QueryConst.inventory.history
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const getStockLedger = async () => {
    try {
        const response = await httpService.get<{ data: LedgerItem[] }>(
            QueryConst.inventory.ledger
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};
