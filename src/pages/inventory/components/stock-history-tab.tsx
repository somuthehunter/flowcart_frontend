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
import { useInventory } from "../hooks/use-inventory";
import AppLoading from "@/components/app-loading";
import { formatDate } from "@/lib/format";

const StockHistoryTab = () => {
    const { historyData, isHistoryLoading } = useInventory();

    if (isHistoryLoading) return <AppLoading />;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Stock History</CardTitle>
                <CardDescription>
                    Log of all stock purchases and manual adjustments.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {historyData?.data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="whitespace-nowrap">
                                        {formatDate(item.date)}
                                    </TableCell>
                                    <TableCell>
                                        {"supplier" in item ? (
                                            <Badge variant="bordered" className="text-blue-500">Purchase</Badge>
                                        ) : (
                                            <Badge variant="bordered" className="text-orange-500">Adjustment</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{item.sku}</TableCell>
                                    <TableCell>{item.productName}</TableCell>
                                    <TableCell className={item.quantity > 0 ? "text-green-600" : "text-red-600"}>
                                        {item.quantity > 0 ? `+${item.quantity}` : item.quantity}
                                    </TableCell>
                                    <TableCell>
                                        {"supplier" in item ? (
                                            <span className="text-muted-foreground text-sm">
                                                From: {item.supplier} @ ${item.purchasePrice}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">
                                                Reason: {item.reason}
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!historyData?.data || historyData.data.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                                        No history records found.
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

export default StockHistoryTab;
