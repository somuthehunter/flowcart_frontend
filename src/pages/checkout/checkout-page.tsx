import PageWithHeaderFooter, { PWHFHeaderActions } from "@/layouts/page-with-header-footer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CheckoutTable from "./components/billing-table";
import { usePosStore } from "@/stores/pos-store";
import { StartSessionDialog } from "./components/start-session-dialog";
import { PosScanner } from "./components/pos-scanner";
import { PosCart } from "./components/pos-cart";

const CheckoutPage = () => {
    const isSessionActive = usePosStore((state) => state.isSessionActive);

    if (isSessionActive) {
        return (
            <div className="h-[calc(100vh-80px)] p-6 bg-muted/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full max-w-6xl mx-auto">
                    <div className="h-full">
                        <PosScanner />
                    </div>
                    <div className="h-full">
                        <PosCart />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <PageWithHeaderFooter title={"Checkout POS"}>
            <PWHFHeaderActions>
                <StartSessionDialog>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Start New Session
                    </Button>
                </StartSessionDialog>
            </PWHFHeaderActions>
            <CheckoutTable />
        </PageWithHeaderFooter>
    );
};

export default CheckoutPage;
