import { usePosStore } from "@/stores/pos-store";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, User, Minus, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { createBill } from "@/services/api/bill-ep";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import QueryConst from "@/constants/query-constants";
import { AddQuantityDialog } from "./add-quantity-dialog";
import { Product } from "@/services/api/product-ep";

export function PosCart() {
    const { customer, cart, updateQuantity, removeFromCart, clearSession } = usePosStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingItem, setEditingItem] = useState<{ product: Product, quantity: number } | null>(null);
    const queryClient = useQueryClient();

    const cartItems = Object.values(cart);
    
    const subtotal = cartItems.reduce(
        (sum, item) => sum + Number(item.product.base_price) * item.quantity,
        0
    );
    const tax = 0; // Simplified for now
    const discount = 0; // Simplified for now
    const total = subtotal + tax - discount;

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;
        
        try {
            setIsSubmitting(true);
            const payload = {
                customer_name: customer?.name,
                customer_mobile: customer?.mobile,
                items: cartItems.map((item) => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                })),
                tax_amount: tax,
                discount_amount: discount,
            };

            await createBill(payload);
            toast.success("Checkout completed successfully!");
            queryClient.invalidateQueries({ queryKey: [QueryConst.billing.list] });
            clearSession();
        } catch (error: any) {
            toast.error(error.message || "Checkout failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center text-lg">
                        <ShoppingCart className="mr-2 h-5 w-5" /> Current Cart
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearSession}>
                        Cancel
                    </Button>
                </CardTitle>
                {customer && (
                    <div className="flex items-center text-sm text-muted-foreground mt-2 bg-muted p-2 rounded-md">
                        <User className="mr-2 h-4 w-4" />
                        <span className="font-medium mr-2">{customer.name}</span>
                        <span>({customer.mobile})</span>
                    </div>
                )}
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full px-6">
                    {cartItems.length === 0 ? (
                        <div className="h-40 flex items-center justify-center text-muted-foreground">
                            Cart is empty. Scan products to add them.
                        </div>
                    ) : (
                        <div className="space-y-4 py-4">
                            {cartItems.map((item) => (
                                <div key={item.product.id} className="flex flex-col space-y-2 bg-muted/30 p-3 rounded-lg">
                                    <div className="flex justify-between font-medium">
                                        <span>{item.product.english_name}</span>
                                        <span>₹{(Number(item.product.base_price) * item.quantity).toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <span>₹{Number(item.product.base_price).toFixed(2)} / {item.product.unit || "unit"}</span>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => updateQuantity(item.product.id, Math.max(0.1, item.quantity - 1))}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span 
                                                className="w-10 text-center font-bold text-foreground cursor-pointer underline decoration-muted-foreground/50 underline-offset-4 hover:text-primary transition-colors"
                                                onClick={() => setEditingItem({ product: item.product, quantity: item.quantity })}
                                                title="Click to edit quantity"
                                            >
                                                {item.quantity}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-6 w-6 ml-2"
                                                onClick={() => removeFromCart(item.product.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
            <Separator />
            <CardFooter className="flex flex-col pt-6 bg-muted/10">
                <div className="w-full space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                </div>
                <Button 
                    className="w-full h-12 text-lg" 
                    size="lg" 
                    disabled={cartItems.length === 0 || isSubmitting}
                    onClick={handleCheckout}
                >
                    {isSubmitting ? "Processing..." : "Complete Checkout"}
                </Button>
            </CardFooter>

            <AddQuantityDialog
                product={editingItem?.product || null}
                initialQuantity={editingItem?.quantity || 1}
                open={!!editingItem}
                onOpenChange={(open) => !open && setEditingItem(null)}
                onConfirm={(qty) => {
                    if (editingItem) updateQuantity(editingItem.product.id, qty);
                }}
                title="Update Quantity"
                actionText="Update"
            />
        </Card>
    );
}
