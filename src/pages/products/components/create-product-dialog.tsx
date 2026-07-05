import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { CreateProductRequest } from "@/services/api/product-ep";
import { UseMutationResult } from "@tanstack/react-query";

interface CreateProductDialogProps {
    children: React.ReactNode;
    createMutation: UseMutationResult<any, any, CreateProductRequest, unknown>;
}

export const CreateProductDialog: FC<CreateProductDialogProps> = ({
    children,
    createMutation,
}) => {
    const [open, setOpen] = useState(false);

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
        },
    });

    const { data: categoriesResponse, isLoading: categoriesLoading } = useQuery({
        queryKey: [QueryConst.categories.list],
        queryFn: async () => {
            const response = await httpService.get(QueryConst.categories.list);
            return response.data;
        },
        enabled: open, // Only fetch when dialog is open
    });

    const categories = categoriesResponse?.data || [];

    const onSubmit = (data: CreateProductFormValues) => {
        createMutation.mutate(data, {
            onSuccess: () => {
                form.reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Product</DialogTitle>
                    <DialogDescription>
                        Add a new product to your catalog. Click save when you're done.
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
                                            />
                                        </FormControl>
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

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createMutation.isPending}
                            >
                                {createMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save Product
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
