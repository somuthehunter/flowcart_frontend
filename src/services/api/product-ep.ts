import { HttpStatusCode } from "axios";
import httpService from "@/services/http-service";
import QueryConst from "@/constants/query-constants";
import { getErrorString, handleApiError } from "@/lib/object-utils";

export interface Product {
    id: string;
    english_name: string;
    bengali_name?: string;
    description?: string;
    product_code: string;
    barcode?: string;
    qr_number?: string;
    qr_code_image_url?: string;
    base_price: string | number;
    unit?: string;
    track_stock?: boolean;
    current_stock: number;
    minimum_stock?: number;
    image_url?: string;
    category_id?: string;
    category?: {
        id: string;
        name: string;
    };
    created_at?: string;
    updated_at?: string;
    brands?: Array<{
        id: string;
        brand_id: string;
        brand_name?: string;
        brand?: {
            id: string;
            name: string;
        };
        selling_price: number | string;
        purchase_price?: number | string;
        sku?: string;
    }>;
}

export type CreateProductRequest = {
    category_id: string;
    english_name: string;
    bengali_name?: string;
    description?: string;
    unit?: string;
    base_price: number;
    track_stock?: boolean;
    current_stock?: number;
    minimum_stock?: number;
    image_url?: string;
    brands?: Array<{
        brand_name: string;
        selling_price: number;
        purchase_price?: number;
        sku?: string;
    }>;
};

export const getProducts = async (params?: Record<string, any>) => {
    try {
        const response = await httpService.get<{ data: Product[], totalNumber: number }>(
            QueryConst.products.list,
            { params }
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const createProduct = async (params: CreateProductRequest) => {
    try {
        const response = await httpService.post<{ message: string; data: Product }>(
            QueryConst.products.create,
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

export const updateProduct = async (id: string, params: Partial<CreateProductRequest>) => {
    try {
        const response = await httpService.patch<{ message: string; data: Product }>(
            QueryConst.products.update.replace(":id", id),
            params
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const deleteProduct = async (id: string) => {
    try {
        const response = await httpService.delete<{ message: string }>(
            QueryConst.products.delete.replace(":id", id)
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const exportProductLabels = async () => {
    try {
        const response = await httpService.get(QueryConst.products.exportLabels, {
            responseType: 'blob',
        });
        
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'product-labels.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        return true;
    } catch (error) {
        handleApiError(error);
    }
};

export const scanProduct = async (code: string) => {
    try {
        const response = await httpService.post<{ success: boolean; data: Product }>(
            QueryConst.products.scan,
            { code }
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};
