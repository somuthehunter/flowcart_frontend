import { HttpStatusCode } from "axios";
import httpService from "@/services/http-service";
import QueryConst from "@/constants/query-constants";
import { getErrorString, handleApiError } from "@/lib/object-utils";

export interface Category {
    id: string;
    name: string;
    merchant_id?: string;
    created_at?: string;
    updated_at?: string;
}

export const getCategories = async () => {
    try {
        const response = await httpService.get<{ data: Category[] }>(
            QueryConst.categories.list
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const createCategory = async (params: Omit<Category, "id">) => {
    try {
        const response = await httpService.post<{ message: string; data: Category }>(
            QueryConst.categories.create,
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

export const updateCategory = async (id: string, params: Omit<Category, "id">) => {
    try {
        const response = await httpService.put<{ message: string; data: Category }>(
            QueryConst.categories.update.replace(":id", id),
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

export const deleteCategory = async (id: string) => {
    try {
        const response = await httpService.delete<{ message: string }>(
            QueryConst.categories.delete.replace(":id", id)
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};
