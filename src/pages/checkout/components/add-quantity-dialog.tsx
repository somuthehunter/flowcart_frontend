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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AddQuantityDialogProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (quantity: number, brandId?: string) => void;
    initialQuantity?: number;
    initialBrandId?: string;
    title?: string;
    actionText?: string;
}

export function AddQuantityDialog({ 
    product, 
    open, 
    onOpenChange, 
    onConfirm, 
    initialQuantity = 1, 
    initialBrandId,
    title = "Add Quantity", 
    actionText = "Add to Cart" 
}: AddQuantityDialogProps) {
    const [quantity, setQuantity] = useState(initialQuantity.toString());
    const [brandId, setBrandId] = useState<string | undefined>(initialBrandId);

    // Reset state when dialog opens
    useEffect(() => {
        if (open) {
            setQuantity(initialQuantity.toString());
            if (initialBrandId) {
                setBrandId(initialBrandId);
            } else {
                setBrandId("none");
            }
        }
    }, [open, initialQuantity, initialBrandId, product]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const qty = parseFloat(quantity);
        if (!isNaN(qty) && qty > 0) {
            onConfirm(qty, brandId === "none" ? undefined : brandId);
            onOpenChange(false);
        }
    };

    if (!product) return null;

    const hasBrands = product.brands && product.brands.length > 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[325px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            Enter details for {product.english_name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        {hasBrands && (
                            <div className="space-y-2">
                                <Label htmlFor="brand">Brand</Label>
                                <Select
                                    value={brandId}
                                    onValueChange={setBrandId}
                                >
                                    <SelectTrigger id="brand">
                                        <SelectValue placeholder="No brand (Base Price)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            No brand - ₹{Number(product.base_price).toFixed(2)}
                                        </SelectItem>
                                        {product.brands?.map((brand) => (
                                            <SelectItem key={brand.id} value={brand.brand_id}>
                                                {brand.brand?.name || brand.brand_name} - ₹{Number(brand.selling_price).toFixed(2)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity {product.unit ? `(${product.unit})` : ""}</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="0.001"
                                step="any"
                                autoFocus={!hasBrands}
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
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
