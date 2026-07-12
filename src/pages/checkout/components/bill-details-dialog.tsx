import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Bill } from "@/services/api/bill-ep";
import { formatDate } from "@/lib/format";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface BillDetailsDialogProps {
    bill: Bill | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const BillDetailsDialog = ({ bill, open, onOpenChange }: BillDetailsDialogProps) => {
    if (!bill) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Bill Details</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                    <div>
                        <p className="text-muted-foreground">Invoice Number</p>
                        <p className="font-medium">{bill.invoice_number}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium">{formatDate(bill.created_at)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Customer</p>
                        <p className="font-medium">
                            {bill.customer_name || <span className="italic text-muted-foreground">Guest</span>}
                        </p>
                        {bill.customer_mobile && (
                            <p className="text-muted-foreground">{bill.customer_mobile}</p>
                        )}
                    </div>
                    <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-medium">{bill.payment_status || "PAID"}</p>
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="font-semibold mb-2">Items</div>
                <ScrollArea className="flex-1 -mx-6 px-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead className="text-right">Qty</TableHead>
                                <TableHead className="text-right">Unit Price</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bill.items?.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="font-medium">
                                            {item.brand_name || item.product?.english_name || 'Unknown Item'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">
                                        ₹{Number(item.unit_price).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        ₹{Number(item.total_price || (Number(item.unit_price) * item.quantity)).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!bill.items || bill.items.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                        No items found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>

                <Separator className="my-4" />

                <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount</span>
                    <span>₹{Number(bill.total_amount).toFixed(2)}</span>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BillDetailsDialog;
