import { useState } from "react";
import { Plus, Printer, Loader2 } from "lucide-react";
import PageWithHeaderFooter, { PWHFHeaderActions } from "@/layouts/page-with-header-footer";
import { Button } from "@/components/ui/button";
import { DataTable, DataTableSkeleton } from "@/components/data-table";
import FailedMessage from "@/components/failed-message";

import ProductsFilter from "./components/products-filter";
import { CreateProductDialog } from "./components/create-product-dialog";
import { useProducts } from "./hooks/use-products";
import useProductsFilter from "./hooks/use-products-filter";
import { exportProductLabels, Product } from "@/services/api/product-ep";
import { toast } from "sonner";
import { ViewProductDialog } from "./components/view-product-dialog";
import { UpdateProductDialog } from "./components/update-product-dialog";

const ProductsPage = () => {
    const filters = useProductsFilter();
    
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsUpdateOpen(true);
    };

    const handleView = (product: Product) => {
        setSelectedProduct(product);
        setIsViewOpen(true);
    };

    const { status, error, dataTable, isEmpty, createProductMutation, updateProductMutation } = useProducts(
        filters, 
        handleEdit, 
        handleView
    );
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        try {
            setIsExporting(true);
            await exportProductLabels();
            toast.success("Labels exported successfully");
        } catch (error: any) {
            toast.error("Failed to export labels");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <PageWithHeaderFooter title={"Products Management"}>
            <PWHFHeaderActions>
                <Button variant="outline" onClick={handleExport} disabled={isExporting}>
                    {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Printer className="mr-2 h-4 w-4" />}
                    Print Labels
                </Button>
                <CreateProductDialog createMutation={createProductMutation}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                </CreateProductDialog>
            </PWHFHeaderActions>
            
            <div className="space-y-6">
                <ProductsFilter {...filters} />

                {status === "pending" && <DataTableSkeleton columnCount={9} />}

                {status === "success" && !isEmpty && (
                    <div className="mx-auto w-full">
                        <DataTable table={dataTable.table} />
                    </div>
                )}

                {isEmpty && (
                    <FailedMessage type="no-data" text="No products found." />
                )}

                {status === "error" && (
                    <FailedMessage
                        type="error"
                        text={error?.message ?? "Failed to load products."}
                    />
                )}
            </div>

            <ViewProductDialog 
                product={selectedProduct} 
                open={isViewOpen} 
                onOpenChange={setIsViewOpen} 
            />

            <UpdateProductDialog 
                product={selectedProduct} 
                open={isUpdateOpen} 
                onOpenChange={setIsUpdateOpen} 
                updateMutation={updateProductMutation} 
            />
        </PageWithHeaderFooter>
    );
};

export default ProductsPage;
