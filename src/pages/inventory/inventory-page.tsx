import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, PlusCircle, ArrowRightLeft, History, BookOpen } from "lucide-react";
import CurrentStockTab from "./components/current-stock-tab";

import PageWithHeaderFooter from "@/layouts/page-with-header-footer";
import StockOperationsTab from "./components/stock-operations-tab";
import StockHistoryTab from "./components/stock-history-tab";
import StockLedgerTab from "./components/stock-ledger-tab";

const InventoryPage = () => {
    return (
        <PageWithHeaderFooter
            title={"Inventory Management"}>
            <Tabs defaultValue="current" className="w-full space-y-6">
                <TabsList className="grid w-full max-w-2xl grid-cols-4">
                    <TabsTrigger value="current" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Current Stock
                    </TabsTrigger>
                    <TabsTrigger value="operations" className="flex items-center gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Operations
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center gap-2">
                        <History className="h-4 w-4" />
                        History
                    </TabsTrigger>
                    <TabsTrigger value="ledger" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Ledger
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="current">
                    <CurrentStockTab />
                </TabsContent>

                <TabsContent value="operations">
                    <StockOperationsTab />
                </TabsContent>

                <TabsContent value="history">
                    <StockHistoryTab />
                </TabsContent>

                <TabsContent value="ledger">
                    <StockLedgerTab />
                </TabsContent>
            </Tabs>
        </PageWithHeaderFooter>
    );
};

export default InventoryPage;
