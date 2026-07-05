import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    getBills,
    createBill,
    getBillDetails,
    Bill,
    CreateBillRequest,
} from "@/services/api/bill-ep";
import QueryConst from "@/constants/query-constants";

export const useBilling = () => {
    const queryClient = useQueryClient();

    const { data: billsData, isLoading: isBillsLoading } = useQuery({
        queryKey: [QueryConst.billing.list],
        queryFn: getBills,
    });

    const createBillMutation = useMutation({
        mutationFn: (params: CreateBillRequest) => createBill(params),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [QueryConst.billing.list] });
            toast.success(data?.message || "Bill created successfully");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to create bill");
        },
    });

    return {
        billsData,
        isBillsLoading,
        createBillMutation,
    };
};

export const useBillDetails = (id: string) => {
    const { data: billDetails, isLoading: isBillLoading } = useQuery({
        queryKey: [QueryConst.billing.details, id],
        queryFn: () => getBillDetails(id),
        enabled: !!id,
    });

    return {
        billDetails,
        isBillLoading,
    };
};
