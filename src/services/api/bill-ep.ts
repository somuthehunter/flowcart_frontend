import { HttpStatusCode } from "axios";
import httpService from "@/services/http-service";
import QueryConst from "@/constants/query-constants";
import { getErrorString, handleApiError } from "@/lib/object-utils";

export interface BillItem {
    id: string;
    quantity: number;
    unit_price: string | number;
    total_price: string | number;
    product: {
        id: string;
        english_name: string;
        product_code: string;
    };
    brand_name?: string;
}

export interface Bill {
    id: string;
    invoice_number: string;
    customer_name?: string;
    customer_mobile?: string;
    payment_status?: string;
    total_amount: string | number;
    net_amount?: string | number;
    created_at: string;
    items?: BillItem[];
}

export type CreateBillRequest = {
    customer_name?: string;
    customer_mobile?: string;
    items: {
        product_id: string;
        quantity: number;
    }[];
};

export const getBills = async () => {
    try {
        const response = await httpService.get<{ data: Bill[] }>(
            QueryConst.billing.list
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const createBill = async (params: CreateBillRequest) => {
    try {
        const response = await httpService.post<{ message: string; data: Bill }>(
            QueryConst.billing.create,
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

export const getBillDetails = async (id: string) => {
    try {
        const response = await httpService.get<{ data: Bill }>(
            QueryConst.billing.details.replace(":id", id)
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};
