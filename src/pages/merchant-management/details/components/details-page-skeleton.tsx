import { FC } from "react";
import PageWithHeaderFooter from "@/layouts/page-with-header-footer";
import { Skeleton } from "@/components/ui/skeleton";

const DealerDetailsPageSkeleton: FC = () => {
    return (
        <PageWithHeaderFooter
            title="Dealer Details"
            description="Loading dealer information...">
            <div className="flex flex-col gap-6">
                <Skeleton className="h-62.5 w-full rounded-xl" />
                <Skeleton className="h-100 w-full rounded-xl" />
            </div>
        </PageWithHeaderFooter>
    );
};

export default DealerDetailsPageSkeleton;
