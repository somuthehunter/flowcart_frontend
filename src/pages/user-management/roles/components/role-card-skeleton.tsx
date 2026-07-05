import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const RoleCardSkeleton = () => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
                <div className="mt-4 space-y-4">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-16" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
