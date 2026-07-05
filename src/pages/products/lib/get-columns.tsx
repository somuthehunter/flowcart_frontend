import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Image as ImageIcon, MoreVertical } from "lucide-react";
import { format } from "date-fns";

import { Product } from "@/services/api/product-ep";
import { DataTableCellContent } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type ActionType = "view" | "edit" | "delete";

type GetColumnsParams = {
    onAction: (type: ActionType, row: Product) => void;
};

export const getColumns = ({
    onAction,
}: GetColumnsParams): ColumnDef<Product>[] => [
    {
        accessorKey: "image_url",
        header: "Image",
        cell: ({ row }) => (
            <Avatar className="h-10 w-10 border rounded-md">
                <AvatarImage src={row.original.image_url} alt={row.original.english_name} className="object-cover" />
                <AvatarFallback className="rounded-md bg-muted text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                </AvatarFallback>
            </Avatar>
        ),
        enableSorting: false,
    },
    {
        accessorKey: "product_code",
        header: "SKU",
        cell: ({ row }) => (
            <DataTableCellContent>
                {row.original.product_code ?? "—"}
            </DataTableCellContent>
        ),
    },
    {
        accessorKey: "barcode",
        header: "Barcode",
        cell: ({ row }) => (
            <DataTableCellContent>
                {row.original.barcode ?? "—"}
            </DataTableCellContent>
        ),
    },
    {
        accessorKey: "english_name",
        header: "Product Name",
        cell: ({ row }) => (
            <DataTableCellContent>
                {row.original.english_name ?? "—"}
            </DataTableCellContent>
        ),
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
            <DataTableCellContent>
                {row.original.category?.name ?? "—"}
            </DataTableCellContent>
        ),
    },
    {
        accessorKey: "base_price",
        header: "Price",
        cell: ({ row }) => (
            <DataTableCellContent>
                ₹{Number(row.original.base_price || 0).toFixed(2)}
            </DataTableCellContent>
        ),
    },
    {
        accessorKey: "current_stock",
        header: "Stock",
        cell: ({ row }) => {
            const isLowStock = row.original.track_stock && (row.original.current_stock <= (row.original.minimum_stock || 0));
            return (
                <div className="flex items-center gap-2">
                    <span className={isLowStock ? "text-destructive font-medium" : ""}>
                        {row.original.current_stock ?? "—"} {row.original.unit ?? ""}
                    </span>
                    {isLowStock && (
                        <Badge color="destructive" size="sm" className="h-5 px-1 text-[10px]">Low</Badge>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => (
            <DataTableCellContent>
                {row.original.created_at
                    ? format(new Date(row.original.created_at), "MMM d, yyyy")
                    : "—"}
            </DataTableCellContent>
        ),
    },
    {
        id: "actions",
        header: () => <div className="flex justify-end">Actions</div>,
        cell: ({ row }) => (
            <div className="flex justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="text-primary h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => onAction("view", row.original)}>
                            View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onAction("edit", row.original)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                            onClick={() => onAction("delete", row.original)}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
        enableSorting: false,
    },
];
