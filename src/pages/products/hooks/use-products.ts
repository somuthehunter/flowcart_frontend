import { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    Product,
    CreateProductRequest,
} from "@/services/api/product-ep";
import QueryConst from "@/constants/query-constants";
import { useDataTable } from "@/hooks/useDataTable";
import useConfirm from "@/hooks/useConfirm";
import { ActionType, getColumns } from "../lib/get-columns";
import { ProductsFilterProps } from "../lib/types";

export const useProducts = (
    filters: ProductsFilterProps,
    onEdit?: (product: Product) => void,
    onView?: (product: Product) => void
) => {
    const queryClient = useQueryClient();
    const confirm = useConfirm();
    const { pageNumber, rowsPerPage, searchKeyword, categoryId, status: filterStatus, handlePageChange } = filters;

    const { data: productsData, status, error } = useQuery({
        queryKey: [QueryConst.products.list, { pageNumber, rowsPerPage, searchKeyword, categoryId, filterStatus }],
        queryFn: () => getProducts({ 
            page: pageNumber, 
            limit: rowsPerPage, 
            search: searchKeyword || undefined,
            categoryId: categoryId || undefined,
            status: filterStatus || undefined
        }),
    });

    const createProductMutation = useMutation({
        mutationFn: (params: CreateProductRequest) => createProduct(params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [QueryConst.products.list] });
            toast.success(data?.message || "Product created successfully");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to create product");
        },
    });

    const updateProductMutation = useMutation({
        mutationFn: ({ id, params }: { id: string; params: Partial<CreateProductRequest> }) =>
            updateProduct(id, params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [QueryConst.products.list] });
            toast.success(data?.message || "Product updated successfully");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to update product");
        },
    });

    const deleteProductMutation = useMutation({
        mutationFn: (id: string) => deleteProduct(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [QueryConst.products.list] });
            toast.success(data?.message || "Product deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to delete product");
        },
    });

    const handleRowAction = useCallback(
        async (type: ActionType, row: Product) => {
            if (type === "delete") {
                try {
                    await confirm({
                        title: "Delete Product",
                        description: "Are you sure you want to delete this product?",
                        confirmationText: "Delete",
                    });
                    deleteProductMutation.mutate(row.id);
                } catch {
                    // user cancelled
                }
            } else if (type === "edit") {
                if (onEdit) onEdit(row);
            } else if (type === "view") {
                if (onView) onView(row);
            }
        },
        [deleteProductMutation, onEdit, onView, confirm]
    );

    const columns = useMemo(
        () =>
            getColumns({
                onAction: handleRowAction,
            }),
        [handleRowAction]
    );

    const dataTable = useDataTable({
        columns,
        data: productsData?.data ?? [],
        totalRows: productsData?.totalNumber ?? 0,
        page: pageNumber,
        rowsPerPage,
        onPageChange: handlePageChange,
        initialColumnPinning: { right: ["actions"] },
        getRowId: (row) => row.id,
    });

    const isEmpty = status === "success" && (productsData?.data?.length ?? 0) === 0;

    return {
        dataTable,
        status,
        error,
        isEmpty,
        createProductMutation,
        updateProductMutation,
        deleteProductMutation,
    };
};
