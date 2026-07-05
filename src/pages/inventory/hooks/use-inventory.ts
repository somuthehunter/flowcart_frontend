import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    getCurrentStock,
    getStockHistory,
    getStockLedger,
    purchaseStock,
    adjustStock,
    updateMinMaxStock,
    PurchaseItem,
    AdjustmentItem,
} from "@/services/api/inventory-ep";
import QueryConst from "@/constants/query-constants";

export const useInventory = () => {
    const queryClient = useQueryClient();

    const { data: stockData, isLoading: isStockLoading } = useQuery({
        queryKey: [QueryConst.inventory.currentStock],
        queryFn: getCurrentStock,
    });

    const { data: historyData, isLoading: isHistoryLoading } = useQuery({
        queryKey: [QueryConst.inventory.history],
        queryFn: getStockHistory,
    });

    const { data: ledgerData, isLoading: isLedgerLoading } = useQuery({
        queryKey: [QueryConst.inventory.ledger],
        queryFn: getStockLedger,
    });

    const updateMinMaxMutation = useMutation({
        mutationFn: ({ id, params }: { id: string; params: { minStock: number; maxStock: number } }) =>
            updateMinMaxStock(id, params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [QueryConst.inventory.currentStock] });
            toast.success(data?.message || "Stock limits updated successfully");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to update stock limits");
        },
    });

    const purchaseStockMutation = useMutation({
        mutationFn: (params: Omit<PurchaseItem, "id" | "date">) => purchaseStock(params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [QueryConst.inventory.currentStock] });
            queryClient.invalidateQueries({ queryKey: [QueryConst.inventory.history] });
            queryClient.invalidateQueries({ queryKey: [QueryConst.inventory.ledger] });
            toast.success(data?.message || "Stock purchased successfully");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to purchase stock");
        },
    });

    const adjustStockMutation = useMutation({
        mutationFn: (params: Omit<AdjustmentItem, "id" | "date">) => adjustStock(params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [QueryConst.inventory.currentStock] });
            queryClient.invalidateQueries({ queryKey: [QueryConst.inventory.history] });
            queryClient.invalidateQueries({ queryKey: [QueryConst.inventory.ledger] });
            toast.success(data?.message || "Stock adjusted successfully");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to adjust stock");
        },
    });

    return {
        stockData,
        isStockLoading,
        historyData,
        isHistoryLoading,
        ledgerData,
        isLedgerLoading,
        updateMinMaxMutation,
        purchaseStockMutation,
        adjustStockMutation,
    };
};
