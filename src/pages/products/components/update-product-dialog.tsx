import { FC, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Trash2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import {
    createProductSchema,
    CreateProductFormValues,
} from "../schemas/product-schema";
import QueryConst from "@/constants/query-constants";
import httpService from "@/services/http-service";
import { Product, CreateProductRequest } from "@/services/api/product-ep";
import { UseMutationResult } from "@tanstack/react-query";

interface UpdateProductDialogProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    updateMutation: UseMutationResult<any, any, { id: string; params: Partial<CreateProductRequest> }, unknown>;
}

export const UpdateProductDialog: FC<UpdateProductDialogProps> = ({
    product,
    open,
    onOpenChange,
    updateMutation,
}) => {
    const form = useForm<CreateProductFormValues>({
        resolver: zodResolver(createProductSchema) as any,
        defaultValues: {
            english_name: "",
            bengali_name: "",
            description: "",
            category_id: "",
            unit: "",
            base_price: 0,
            track_stock: true,
            current_stock: 0,
            minimum_stock: 0,
            image_url: "",
            brands: [],
        },
    });

    useEffect(() => {
        if (product && open) {
            form.reset({
                english_name: product.english_name || "",
                bengali_name: product.bengali_name || "",
                description: product.description || "",
                category_id: product.category_id || "",
                unit: product.unit || "",
                base_price: Number(product.base_price || 0),
                track_stock: product.track_stock ?? true,
                current_stock: Number(product.current_stock || 0),
                minimum_stock: Number(product.minimum_stock || 0),
                image_url: product.image_url || "",
                brands: product.brands?.map(b => ({
                    brand_name: b.brand?.name || b.brand_name || "",
                    selling_price: Number(b.selling_price || 0),
                    purchase_price: b.purchase_price ? Number(b.purchase_price) : undefined,
                    sku: b.sku || ""
                })) || [],
            });
        }
    }, [product, open, form]);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "brands",
    });

    const { data: categoriesResponse, isLoading: categoriesLoading } = useQuery({
        queryKey: [QueryConst.categories.list],
        queryFn: async () => {
            const response = await httpService.get(QueryConst.categories.list);
            return response.data;
        },
        enabled: open,
    });

    const categories = categoriesResponse?.data || [];

    const onSubmit = (data: CreateProductFormValues) => {
        if (!product) return;
        updateMutation.mutate({ id: product.id, params: data }, {
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    };

    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Update Product</DialogTitle>
                    <DialogDescription>
                        Modify the details for {product.english_name}. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium leading-none">
                                Basic Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="english_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name (English)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Rice" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bengali_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name (Bengali)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. চাল" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Brief description of the product"
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="image_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Image</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            field.onChange(reader.result as string);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    } else {
                                                        field.onChange("");
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        {field.value && (
                                            <div className="mt-2">
                                                <img src={field.value} alt="Preview" className="w-24 h-24 object-cover rounded-md border" />
                                            </div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="category_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={categoriesLoading}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((c: any) => (
                                                        <SelectItem key={c.id} value={c.id}>
                                                            {c.name || c.english_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="unit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Unit of Measurement</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. kg, pcs, ltr" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Pricing & Stock */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium leading-none">
                                Pricing & Inventory
                            </h4>
                            <div className="grid grid-cols-1 gap-4">
                                <FormField
                                    control={form.control}
                                    name="base_price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Base Price ($)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="track_stock"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Track Inventory
                                            </FormLabel>
                                            <FormDescription>
                                                Keep track of stock levels for this product.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {form.watch("track_stock") && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="current_stock"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Current Stock</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="minimum_stock"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Low Stock Alert Level</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Brands / Sub Products */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium leading-none">
                                    Brands / Sub Products
                                </h4>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ brand_name: "", selling_price: 0, purchase_price: undefined, sku: "" })}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Brand
                                </Button>
                            </div>
                            
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start border p-4 rounded-lg relative">
                                    <div className="col-span-12 md:col-span-11 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`brands.${index}.brand_name`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Brand Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. MDH" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`brands.${index}.sku`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>SKU (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. SKU-001" {...field} value={field.value || ""} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`brands.${index}.selling_price`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Selling Price ($)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" step="0.01" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`brands.${index}.purchase_price`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Purchase Price ($) (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" step="0.01" {...field} value={field.value || ""} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-1 flex justify-end">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {fields.length === 0 && (
                                <p className="text-sm text-muted-foreground italic text-center py-4 border rounded-lg border-dashed">
                                    No brands or sub-products added.
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={updateMutation.isPending}
                            >
                                {updateMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
