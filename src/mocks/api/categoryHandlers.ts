import { http, HttpResponse } from "msw";
import { config } from "@/lib/config";
import QueryConst from "@/constants/query-constants";
import { Category } from "@/services/api/category-ep";
import {
    addFakeCategory,
    deleteFakeCategory,
    getFakeCategories,
    updateFakeCategory,
} from "../fake-store/categories";

const url = (path: string) => `${config.env.API_BASE_URL}/${path}`;

export const categoryHandlers = [
    http.get(url(QueryConst.categories.list), () => {
        return HttpResponse.json({ data: getFakeCategories() });
    }),

    http.post(url(QueryConst.categories.create), async ({ request }) => {
        const body = (await request.json()) as Omit<Category, "id">;
        const newCategory = addFakeCategory(body);
        return HttpResponse.json(
            { message: "Category created successfully", data: newCategory },
            { status: 201 }
        );
    }),

    http.put(url(QueryConst.categories.update.replace(":id", ":id")), async ({ params, request }) => {
        const id = params.id as string;
        const body = (await request.json()) as Omit<Category, "id">;
        const updatedCategory = updateFakeCategory(id, body);
        
        if (updatedCategory) {
            return HttpResponse.json({ message: "Category updated successfully", data: updatedCategory });
        }
        return new HttpResponse(null, { status: 404, statusText: "Not Found" });
    }),

    http.delete(url(QueryConst.categories.delete.replace(":id", ":id")), ({ params }) => {
        const id = params.id as string;
        deleteFakeCategory(id);
        return HttpResponse.json({ message: "Category deleted successfully" });
    }),
];
