import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Product } from "@/services/api/product-ep";
import { Label } from "@/components/ui/label";

interface AddQuantityDialogProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (quantity: number) => void;
    initialQuantity?: number;
    title?: string;
    actionText?: string;
}

export function AddQuantityDialog({ product, open, onOpenChange, onConfirm, initialQuantity = 1, title = "Add Quantity", actionText = "Add to Cart" }: AddQuantityDialogProps) {
    const [quantity, setQuantity] = useState(initialQuantity.toString());

    // Reset quantity when dialog opens
    useEffect(() => {
        if (open) {
            setQuantity(initialQuantity.toString());
        }
    }, [open, initialQuantity]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const qty = parseFloat(quantity);
        if (!isNaN(qty) && qty > 0) {
            onConfirm(qty);
            onOpenChange(false);
        }
    };

    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[325px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            Enter quantity for {product.english_name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity {product.unit ? `(${product.unit})` : ""}</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="0.001"
                                step="any"
                                autoFocus
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">{actionText}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
