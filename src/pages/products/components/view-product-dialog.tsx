import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/services/api/product-ep";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ViewProductDialogProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ViewProductDialog = ({ product, open, onOpenChange }: ViewProductDialogProps) => {
    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Product Details</DialogTitle>
                </DialogHeader>
                
                <div className="flex items-start gap-4 mt-4">
                    <Avatar className="h-24 w-24 rounded-md border">
                        <AvatarImage src={product.image_url} className="object-cover" />
                        <AvatarFallback className="rounded-md bg-muted">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-1 flex-1">
                        <h2 className="text-xl font-bold">{product.english_name}</h2>
                        {product.bengali_name && <p className="text-muted-foreground">{product.bengali_name}</p>}
                        <div className="flex gap-2 text-sm mt-2">
                            <span className="font-semibold">SKU:</span> {product.product_code || "N/A"}
                        </div>
                        <div className="flex gap-2 text-sm">
                            <span className="font-semibold">Barcode:</span> {product.barcode || "N/A"}
                        </div>
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div>
                        <span className="font-semibold block text-muted-foreground">Category</span>
                        <span>{product.category?.name || "Uncategorized"}</span>
                    </div>
                    <div>
                        <span className="font-semibold block text-muted-foreground">Base Price</span>
                        <span>₹{Number(product.base_price).toFixed(2)}</span>
                    </div>
                    <div>
                        <span className="font-semibold block text-muted-foreground">Inventory</span>
                        <span>{product.track_stock ? `${product.current_stock} ${product.unit}` : "Not tracked"}</span>
                    </div>
                    <div>
                        <span className="font-semibold block text-muted-foreground">Unit</span>
                        <span>{product.unit || "N/A"}</span>
                    </div>
                </div>

                {product.description && (
                    <div className="mt-4">
                        <span className="font-semibold block text-muted-foreground text-sm">Description</span>
                        <p className="text-sm mt-1">{product.description}</p>
                    </div>
                )}

                {product.brands && product.brands.length > 0 && (
                    <div className="mt-4">
                        <span className="font-semibold block text-muted-foreground text-sm mb-2">Brands / Variants</span>
                        <div className="space-y-2 border rounded-md p-2 bg-muted/20">
                            {product.brands.map((brand, i) => (
                                <div key={i} className="flex justify-between items-center text-sm p-2 bg-background border rounded-sm">
                                    <div>
                                        <span className="font-medium">{brand.brand?.name || brand.brand_name}</span>
                                        {brand.sku && <span className="text-muted-foreground text-xs ml-2">({brand.sku})</span>}
                                    </div>
                                    <span>₹{Number(brand.selling_price).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
