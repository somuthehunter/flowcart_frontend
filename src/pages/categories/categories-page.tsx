import PageWithHeaderFooter, { PWHFHeaderActions } from "@/layouts/page-with-header-footer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CategoriesTable from "./components/categories-table";

const CategoriesPage = () => {
    return (
        <PageWithHeaderFooter title={"Category Management"}>
            <PWHFHeaderActions>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </PWHFHeaderActions>
            <CategoriesTable />
        </PageWithHeaderFooter>
    );
};

export default CategoriesPage;
