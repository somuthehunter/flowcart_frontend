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

const StockLedgerTab = () => {
    const { ledgerData, isLedgerLoading } = useInventory();

    if (isLedgerLoading) return <AppLoading />;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Stock Ledger</CardTitle>
                <CardDescription>
                    Comprehensive ledger showing running balance of stock items.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Transaction</TableHead>
                                <TableHead className="text-right">Change</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ledgerData?.data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="whitespace-nowrap">
                                        {formatDate(item.date)}
                                    </TableCell>
                                    <TableCell className="font-medium">{item.sku}</TableCell>
                                    <TableCell>{item.productName}</TableCell>
                                    <TableCell>
                                        <Badge variant="bordered">
                                            {item.transactionType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className={`text-right ${item.quantityChanged > 0 ? "text-green-600" : "text-red-600"}`}>
                                        {item.quantityChanged > 0 ? `+${item.quantityChanged}` : item.quantityChanged}
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                        {item.balance}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!ledgerData?.data || ledgerData.data.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                                        No ledger records found.
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

export default StockLedgerTab;
