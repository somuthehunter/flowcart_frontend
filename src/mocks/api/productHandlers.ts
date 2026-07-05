import { http, HttpResponse } from "msw";
import { config } from "@/lib/config";
import QueryConst from "@/constants/query-constants";
import { Product, CreateProductRequest } from "@/services/api/product-ep";
import {
    addFakeProduct,
    deleteFakeProduct,
    getFakeProducts,
    updateFakeProduct,
} from "../fake-store/products";

const url = (path: string) => `${config.env.API_BASE_URL}/${path}`;

export const productHandlers = [
    http.get(url(QueryConst.products.exportLabels), async () => {
        // Return a mock PDF binary stream
        const pdfContent = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52, 10]); // %PDF-1.4\n
        return new HttpResponse(pdfContent, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="product-labels.pdf"',
                "Content-Length": pdfContent.length.toString(),
            },
        });
    }),

    http.get(url(QueryConst.products.list), ({ request }) => {
        const urlObj = new URL(request.url);
        const page = parseInt(urlObj.searchParams.get("page") || "1", 10);
        const limit = parseInt(urlObj.searchParams.get("limit") || "10", 10);
        const search = urlObj.searchParams.get("search")?.toLowerCase();
        const categoryId = urlObj.searchParams.get("categoryId");
        const status = urlObj.searchParams.get("status");

        let products = getFakeProducts();

        if (search) {
            products = products.filter(
                (p) =>
                    p.english_name.toLowerCase().includes(search) ||
                    (p.product_code && p.product_code.toLowerCase().includes(search)) ||
                    (p.barcode && p.barcode.toLowerCase().includes(search))
            );
        }

        if (categoryId) {
            products = products.filter((p) => p.category_id === categoryId);
        }

        // Mock status filter (assuming we add status property later or just ignore)

        const totalNumber = products.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = products.slice(startIndex, endIndex);

        return HttpResponse.json({ data: paginatedProducts, totalNumber });
    }),

    http.post(url(QueryConst.products.create), async ({ request }) => {
        const body = (await request.json()) as CreateProductRequest;
        const newProduct = addFakeProduct(body);
        return HttpResponse.json(
            { message: "Product created successfully", data: newProduct },
            { status: 201 }
        );
    }),

    http.post(url(QueryConst.products.scan), async ({ request }) => {
        const body = (await request.json()) as { code: string };
        const products = getFakeProducts();
        
        const found = products.find(
            (p) => p.product_code === body.code || p.barcode === body.code
        );

        if (found) {
            return HttpResponse.json({ success: true, data: found });
        }
        return new HttpResponse(null, { status: 404, statusText: "Product not found" });
    }),

    http.put(url(QueryConst.products.update.replace(":id", ":id")), async ({ params, request }) => {
        const id = params.id as string;
        const body = (await request.json()) as Partial<CreateProductRequest>;
        const updatedProduct = updateFakeProduct(id, body);
        
        if (updatedProduct) {
            return HttpResponse.json({ message: "Product updated successfully", data: updatedProduct });
        }
        return new HttpResponse(null, { status: 404, statusText: "Not Found" });
    }),

    http.delete(url(QueryConst.products.delete.replace(":id", ":id")), ({ params }) => {
        const id = params.id as string;
        deleteFakeProduct(id);
        return HttpResponse.json({ message: "Product deleted successfully" });
    }),
];
