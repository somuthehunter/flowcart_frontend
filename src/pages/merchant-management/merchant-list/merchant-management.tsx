import { FC } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router";

import { AdminRoutes } from "@/constants/route-constants";
import PageWithHeaderFooter, {
    PWHFHeaderActions,
} from "@/layouts/page-with-header-footer";
import { DataTable, DataTableSkeleton } from "@/components/data-table";
import FailedMessage from "@/components/failed-message";
import { Button } from "@/components/ui/button";

import { DealerFilters } from "./components/dealer-filters";
import { DealerUnifiedUpdateDialog } from "./components/dealer-unified-update-dialog";
import { useMerchants } from "./hooks/use-merchants";
import useMerchantsFilter from "./hooks/use-merchants-filter";

const DealerPage: FC = () => {
    const filters = useMerchantsFilter();

    const { status, error, dataTable, isEmpty, isMobile, editingDealer, setEditingDealer } = useMerchants(filters);

    return (
        <PageWithHeaderFooter
            title="All Dealers"
            description="Manage all dealers information">
            <PWHFHeaderActions>
                <Link
                    to={AdminRoutes.merchants.create}
                    className="flex items-center">
                    <Button size="sm">
                        {isMobile ? (
                            <Plus className="h-4 w-4" />
                        ) : (
                            <>
                                <Plus className="h-4 w-4" />
                                <span>Onboard Dealer</span>
                            </>
                        )}
                    </Button>
                </Link>
            </PWHFHeaderActions>

            <DealerFilters {...filters} />

            {status === "pending" && <DataTableSkeleton columnCount={5} />}

            {status === "success" && !isEmpty && (
                <div className="mx-auto w-full">
                    <DataTable table={dataTable.table} />
                </div>
            )}

            {isEmpty && (
                <FailedMessage type="no-data" text="No records found" grow />
            )}

            {status === "error" && (
                <FailedMessage
                    type="error"
                    text={error?.message ?? "Failed to load data"}
                    grow
                />
            )}

            <DealerUnifiedUpdateDialog
                dealer={editingDealer}
                open={!!editingDealer}
                onClose={() => setEditingDealer(null)}
            />
        </PageWithHeaderFooter>
    );
};

export default DealerPage;
