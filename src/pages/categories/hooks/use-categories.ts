import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    Category,
} from "@/services/api/category-ep";
import QueryConst from "@/constants/query-constants";

export const useCategories = () => {
    const queryClient = useQueryClient();

    const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
        queryKey: [QueryConst.categories.list],
        queryFn: getCategories,
    });

    const createCategoryMutation = useMutation({
        mutationFn: (params: Omit<Category, "id">) => createCategory(params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [QueryConst.categories.list] });
            toast.success(data?.message || "Category created successfully");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to create category");
        },
    });

    const updateCategoryMutation = useMutation({
        mutationFn: ({ id, params }: { id: string; params: Omit<Category, "id"> }) =>
            updateCategory(id, params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [QueryConst.categories.list] });
            toast.success(data?.message || "Category updated successfully");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to update category");
        },
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: (id: string) => deleteCategory(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [QueryConst.categories.list] });
            toast.success(data?.message || "Category deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to delete category");
        },
    });

    return {
        categoriesData,
        isCategoriesLoading,
        createCategoryMutation,
        updateCategoryMutation,
        deleteCategoryMutation,
    };
};
