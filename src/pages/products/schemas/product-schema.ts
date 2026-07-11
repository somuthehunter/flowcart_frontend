import { z } from "zod";

export const createProductSchema = z.object({
    english_name: z.string().min(1, "Product name is required").max(100, "Name is too long"),
    bengali_name: z.string().optional(),
    description: z.string().optional(),
    category_id: z.string().min(1, "Category is required"),
    unit: z.string().optional(),
    base_price: z.coerce.number().min(0.01, "Price must be greater than 0"),
    track_stock: z.boolean().default(true),
    current_stock: z.coerce.number().min(0, "Stock cannot be negative").default(0),
    minimum_stock: z.coerce.number().min(0, "Minimum stock cannot be negative").default(0).optional(),
    image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    brands: z.array(z.object({
        brand_name: z.string().min(1, "Brand name is required"),
        selling_price: z.coerce.number().min(0, "Price must be positive"),
        purchase_price: z.coerce.number().min(0).optional(),
        sku: z.string().optional()
    })).optional().default([]),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
