import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useBilling } from "../hooks/use-billing";
import AppLoading from "@/components/app-loading";
import { Button } from "@/components/ui/button";
import { Eye, Printer } from "lucide-react";
import { Bill } from "@/services/api/bill-ep";
import { formatDate } from "@/lib/format";
import { useState } from "react";
import BillDetailsDialog from "./bill-details-dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const handlePrint = (bill: Bill) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = `
        <html>
        <head>
            <title>Receipt - ${bill.invoice_number}</title>
            <style>
                body { font-family: monospace; padding: 20px; color: #000; max-width: 400px; margin: 0 auto; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border-bottom: 1px dashed #000; padding: 8px 0; text-align: left; }
                .text-right { text-align: right; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 10px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>FLOWPAY</h2>
                <p>Invoice: ${bill.invoice_number}</p>
                <p>Date: ${new Date(bill.created_at).toLocaleString()}</p>
                ${bill.customer_name ? `<p>Customer: ${bill.customer_name} ${bill.customer_mobile ? `(${bill.customer_mobile})` : ''}</p>` : ''}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th class="text-right">Price</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${bill.items?.map(i => `
                        <tr>
                            <td>${i.brand_name || i.product?.english_name || 'Item'}</td>
                            <td>${i.quantity}</td>
                            <td class="text-right">₹${Number(i.unit_price).toFixed(2)}</td>
                            <td class="text-right">₹${Number((i as any).total_price || (i as any).subtotal || (Number(i.unit_price) * i.quantity)).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div style="margin-top: 20px; text-align: right; font-size: 1.2em; border-top: 2px solid #000; padding-top: 10px;">
                <strong>Total: ₹${Number(bill.total_amount).toFixed(2)}</strong>
            </div>
            <div style="text-align: center; margin-top: 40px;">
                <p>Thank you for shopping with us!</p>
            </div>
            <script>
                window.onload = function() { window.print(); window.setTimeout(function(){ window.close(); }, 500); }
            </script>
        </body>
        </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
};

const BillingTable = () => {
    const { billsData, isBillsLoading } = useBilling();
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleViewBill = (bill: Bill) => {
        setSelectedBill(bill);
        setIsDialogOpen(true);
    };

    const filteredBills = billsData?.data.filter((bill) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            bill.invoice_number.toLowerCase().includes(query) ||
            bill.customer_name?.toLowerCase().includes(query) ||
            bill.customer_mobile?.includes(query)
        );
    }) || [];

    if (isBillsLoading) return <AppLoading />;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="relative flex-1 md:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by invoice, name, or phone..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <Card>
                <CardContent className="p-0">
                    <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Invoice Number</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBills.map((item: Bill) => (
                            <TableRow key={item.id}>
                                <TableCell className="whitespace-nowrap">
                                    {formatDate(item.created_at)}
                                </TableCell>
                                <TableCell className="font-medium">{item.invoice_number}</TableCell>
                                <TableCell>
                                    {item.customer_name ? (
                                        <div>
                                            <div className="font-medium">{item.customer_name}</div>
                                            <div className="text-xs text-muted-foreground">{item.customer_mobile}</div>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground italic">Guest</span>
                                    )}
                                </TableCell>
                                <TableCell>{item.payment_status || "PAID"}</TableCell>
                                <TableCell>{item.items?.length || 0}</TableCell>
                                <TableCell>₹{Number(item.total_amount).toFixed(2)}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleViewBill(item)}>
                                        <Eye className="h-4 w-4 text-blue-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handlePrint(item)}>
                                        <Printer className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredBills.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                                    No bills found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            <BillDetailsDialog 
                bill={selectedBill} 
                open={isDialogOpen} 
                onOpenChange={setIsDialogOpen} 
            />
        </Card>
        </div>
    );
};

export default BillingTable;
