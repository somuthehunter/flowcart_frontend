import PageWithHeaderFooter, { PWHFHeaderActions } from "@/layouts/page-with-header-footer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CategoriesTable from "./components/categories-table";
import { CreateCategoryDialog } from "./components/create-category-dialog";
import { useCategories } from "./hooks/use-categories";

const CategoriesPage = () => {
    const { createCategoryMutation } = useCategories();

    return (
        <PageWithHeaderFooter title={"Category Management"}>
            <PWHFHeaderActions>
                <CreateCategoryDialog createMutation={createCategoryMutation}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Category
                    </Button>
                </CreateCategoryDialog>
            </PWHFHeaderActions>
            <CategoriesTable />
        </PageWithHeaderFooter>
    );
};

export default CategoriesPage;
