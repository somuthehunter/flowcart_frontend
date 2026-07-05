import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventory } from "../hooks/use-inventory";

const purchaseSchema = z.object({
    sku: z.string().min(1, "SKU is required"),
    productName: z.string().min(1, "Product name is required"),
    quantity: z.coerce.number().min(1, "Quantity must be greater than 0"),
    purchasePrice: z.coerce.number().min(0, "Price must be positive"),
    supplier: z.string().min(1, "Supplier is required"),
});

const adjustmentSchema = z.object({
    sku: z.string().min(1, "SKU is required"),
    productName: z.string().min(1, "Product name is required"),
    quantity: z.coerce.number(), // Can be negative for deductions
    reason: z.string().min(1, "Reason is required"),
});

type PurchaseValues = z.infer<typeof purchaseSchema>;
type AdjustmentValues = z.infer<typeof adjustmentSchema>;

const StockOperationsTab = () => {
    const { purchaseStockMutation, adjustStockMutation } = useInventory();

    const purchaseForm = useForm<PurchaseValues>({
        resolver: zodResolver(purchaseSchema) as any,
        defaultValues: { sku: "", productName: "", quantity: 1, purchasePrice: 0, supplier: "" },
    });

    const adjustmentForm = useForm<AdjustmentValues>({
        resolver: zodResolver(adjustmentSchema) as any,
        defaultValues: { sku: "", productName: "", quantity: 0, reason: "" },
    });

    const onPurchaseSubmit = (values: PurchaseValues) => {
        purchaseStockMutation.mutate(values, {
            onSuccess: () => purchaseForm.reset(),
        });
    };

    const onAdjustmentSubmit = (values: AdjustmentValues) => {
        adjustStockMutation.mutate(values, {
            onSuccess: () => adjustmentForm.reset(),
        });
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Purchase Stock</CardTitle>
                    <CardDescription>
                        Record new stock arriving from suppliers.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...purchaseForm}>
                        <form onSubmit={purchaseForm.handleSubmit(onPurchaseSubmit as any)} className="space-y-4">
                            <FormField
                                control={purchaseForm.control as any}
                                name="sku"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SKU</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter SKU" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={purchaseForm.control as any}
                                name="productName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter product name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={purchaseForm.control as any}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={purchaseForm.control as any}
                                    name="purchasePrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price per unit</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={purchaseForm.control as any}
                                name="supplier"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Supplier</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter supplier name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={purchaseStockMutation.isPending} className="w-full">
                                Record Purchase
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Adjust Stock</CardTitle>
                    <CardDescription>
                        Manually adjust stock for damages, losses, or corrections.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...adjustmentForm}>
                        <form onSubmit={adjustmentForm.handleSubmit(onAdjustmentSubmit as any)} className="space-y-4">
                            <FormField
                                control={adjustmentForm.control as any}
                                name="sku"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SKU</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter SKU" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={adjustmentForm.control as any}
                                name="productName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter product name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={adjustmentForm.control as any}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Adjustment Quantity</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="e.g. -5 or 5" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={adjustmentForm.control as any}
                                name="reason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reason</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a reason" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Damage">Damage</SelectItem>
                                                <SelectItem value="Loss">Loss / Theft</SelectItem>
                                                <SelectItem value="Correction">Inventory Correction</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={adjustStockMutation.isPending} className="w-full">
                                Adjust Stock
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default StockOperationsTab;
