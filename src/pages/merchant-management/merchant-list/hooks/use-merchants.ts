import { useCallback, useMemo } from "react";
import { getDealers } from "@/services/api/dealer-ep";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { DealerDetails } from "@/types/response/dealer-response";
import QueryConst from "@/constants/query-constants";
import { useDataTable } from "@/hooks/useDataTable";
import { useIsMobile } from "@/hooks/useMobile";

import { ActionType, getColumns } from "../lib/get-columns";
import { DealersFilterProps } from "../lib/types";
import { useState } from "react";

export const useMerchants = (dealerFilters: DealersFilterProps) => {
    const { filters, handlePageChange } = dealerFilters;
    const navigate = useNavigate();
    
    const [editingDealer, setEditingDealer] = useState<DealerDetails | null>(null);

    const isMobile = useIsMobile();
    const {
        data,
        status: queryStatus,
        error,
    } = useQuery({
        queryKey: [
            QueryConst.dealers.list,
            {
                pageNumber: filters.page,
                rowsPerPage: filters.perPage,
                searchKeyword: filters.search,
                status: filters.status,
            },
        ],
        queryFn: () =>
            getDealers({
                pageNumber: filters.page,
                rowsPerPage: filters.perPage,
                searchKeyword: filters.search,
                status: filters.status,
            }),
    });

    const handleRowAction = useCallback(
        (type: ActionType, row: DealerDetails) => {
            switch (type) {
                case "view":
                    navigate(`/dealers/${row.dealerId}`);
                    break;

                case "edit":
                    setEditingDealer(row);
                    break;
            }
        },
        [navigate]
    );

    const columns = useMemo(
        () =>
            getColumns({
                onAction: handleRowAction,
            }),
        [handleRowAction]
    );

    const dataTable = useDataTable({
        columns,
        data: data?.data ?? [],
        totalRows: data?.totalNumber ?? 0,
        page: filters.page,
        rowsPerPage: filters.perPage,
        onPageChange: handlePageChange,
        initialColumnPinning: { right: ["actions"] },
        getRowId: (row) => row.dealerId,
    });

    const isEmpty =
        queryStatus === "success" && (data?.data?.length ?? 0) === 0;

    return { 
        dataTable, 
        status: queryStatus, 
        error, 
        isEmpty, 
        isMobile,
        editingDealer,
        setEditingDealer
    };
};
