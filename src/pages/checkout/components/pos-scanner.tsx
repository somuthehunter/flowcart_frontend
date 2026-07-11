import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanBarcode, Loader2, Camera, X } from "lucide-react";
import { scanProduct, Product } from "@/services/api/product-ep";
import { toast } from "sonner";
import { AddQuantityDialog } from "./add-quantity-dialog";
import { usePosStore } from "@/stores/pos-store";
import { Scanner } from "@yudiel/react-qr-scanner";

export function PosScanner() {
    const [code, setCode] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
    const [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    
    const inputRef = useRef<HTMLInputElement>(null);
    const addToCart = usePosStore((state) => state.addToCart);

    // Keep focus on input for continuous scanning if camera is not open
    useEffect(() => {
        if (!isQuantityDialogOpen && !isScanning && !isCameraOpen) {
            inputRef.current?.focus();
        }
    }, [isQuantityDialogOpen, isScanning, isCameraOpen]);

    const processScanCode = async (scanCode: string) => {
        if (!scanCode.trim() || isScanning || isQuantityDialogOpen) return;
        
        setIsScanning(true);
        setCode(""); // Clear immediately for next scan
        
        try {
            const response = await scanProduct(scanCode.trim());
            if (response?.data) {
                setScannedProduct(response.data);
                setIsQuantityDialogOpen(true);
                // We keep the camera open intentionally so they can scan the next product later
            }
        } catch (error: any) {
            toast.error("Product not found or error scanning");
        } finally {
            setIsScanning(false);
        }
    };

    const handleScan = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && code.trim()) {
            e.preventDefault();
            await processScanCode(code);
        }
    };

    const handleConfirmQuantity = (qty: number, brandId?: string) => {
        if (scannedProduct) {
            addToCart(scannedProduct, qty, brandId);
            toast.success(`Added ${qty} ${scannedProduct.english_name} to cart`);
        }
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center text-lg">
                    <ScanBarcode className="mr-2 h-5 w-5" /> Product Scanner
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="text-center text-muted-foreground max-w-sm">
                    Use a barcode scanner, type the product code manually, or use your device camera.
                </div>
                
                {isCameraOpen ? (
                    <div className="w-full max-w-md relative overflow-hidden rounded-xl border bg-black aspect-video flex items-center justify-center">
                        <Scanner
                            onScan={(detectedCodes) => {
                                if (detectedCodes.length > 0) {
                                    processScanCode(detectedCodes[0].rawValue);
                                }
                            }}
                            onError={(error) => {
                                console.error(error);
                                toast.error("Camera error. Please ensure permissions are granted.");
                            }}
                            styles={{
                                container: { width: "100%", height: "100%" },
                                video: { objectFit: "cover" }
                            }}
                        />
                        <Button 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-2 right-2 rounded-full h-8 w-8"
                            onClick={() => setIsCameraOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="relative w-full max-w-md">
                        <Input
                            ref={inputRef}
                            autoFocus
                            placeholder="Scan barcode..."
                            className="h-14 text-xl pl-12"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onKeyDown={handleScan}
                            disabled={isScanning || isQuantityDialogOpen}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            {isScanning ? (
                                <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
                            ) : (
                                <ScanBarcode className="h-6 w-6 text-muted-foreground" />
                            )}
                        </div>
                    </div>
                )}
                
                {!isCameraOpen && (
                    <Button variant="outline" className="w-full max-w-md" onClick={() => setIsCameraOpen(true)}>
                        <Camera className="mr-2 h-4 w-4" /> Use Device Camera
                    </Button>
                )}
            </CardContent>

            <AddQuantityDialog
                product={scannedProduct}
                open={isQuantityDialogOpen}
                onOpenChange={setIsQuantityDialogOpen}
                onConfirm={handleConfirmQuantity}
            />
        </Card>
    );
}
