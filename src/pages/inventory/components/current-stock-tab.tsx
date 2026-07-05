import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInventory } from "../hooks/use-inventory";
import AppLoading from "@/components/app-loading";
import { StockItem } from "@/services/api/inventory-ep";

const CurrentStockTab = () => {
    const { stockData, isStockLoading, updateMinMaxMutation } = useInventory();
    const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
    const [minStock, setMinStock] = useState("");
    const [maxStock, setMaxStock] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    if (isStockLoading) return <AppLoading />;

    const handleUpdate = () => {
        if (!selectedItem) return;
        updateMinMaxMutation.mutate(
            {
                id: selectedItem.id,
                params: {
                    minStock: parseInt(minStock),
                    maxStock: parseInt(maxStock),
                },
            },
            {
                onSuccess: () => setIsDialogOpen(false),
            }
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Current Stock</CardTitle>
                <CardDescription>
                    Overview of your current inventory levels and limits.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Current Stock</TableHead>
                                <TableHead>Min Stock</TableHead>
                                <TableHead>Max Stock</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stockData?.data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.sku}</TableCell>
                                    <TableCell>{item.productName}</TableCell>
                                    <TableCell>{item.currentStock}</TableCell>
                                    <TableCell>{item.minStock}</TableCell>
                                    <TableCell>{item.maxStock}</TableCell>
                                    <TableCell>
                                        {item.currentStock < item.minStock ? (
                                            <Badge variant="flat">Low Stock</Badge>
                                        ) : item.currentStock > item.maxStock ? (
                                            <Badge variant="solid">Overstocked</Badge>
                                        ) : (
                                            <Badge className="bg-green-500">Optimal</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Dialog open={isDialogOpen && selectedItem?.id === item.id} onOpenChange={(open) => {
                                            setIsDialogOpen(open);
                                            if (open) {
                                                setSelectedItem(item);
                                                setMinStock(item.minStock.toString());
                                                setMaxStock(item.maxStock.toString());
                                            } else {
                                                setSelectedItem(null);
                                            }
                                        }}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    Update Limits
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Update Stock Limits</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid gap-2">
                                                        <Label>Min Stock</Label>
                                                        <Input
                                                            type="number"
                                                            value={minStock}
                                                            onChange={(e) => setMinStock(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Max Stock</Label>
                                                        <Input
                                                            type="number"
                                                            value={maxStock}
                                                            onChange={(e) => setMaxStock(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button 
                                                        onClick={handleUpdate}
                                                        disabled={updateMinMaxMutation.isPending}
                                                    >
                                                        Save
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {stockData?.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                                        No stock items found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default CurrentStockTab;
