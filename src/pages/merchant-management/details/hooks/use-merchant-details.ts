import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

import { AdminRoutes } from "@/constants/route-constants";
import QueryConst from "@/constants/query-constants";
import { getDealerDetailsById } from "@/services/api/dealer-ep";

export const useMerchantDetails = () => {
    // ── 1. States & inline hooks ──────────────────────────────────────────

    const { dealerId } = useParams<{ dealerId: string }>();
    const navigate = useNavigate();

    const [isDealerInfoDialogOpen, setIsDealerInfoDialogOpen] = useState(false);
    const [isDealerAddressesDialogOpen, setIsDealerAddressesDialogOpen] = useState(false);
    const [isDealerContactsDialogOpen, setIsDealerContactsDialogOpen] = useState(false);
    const [isDealerHoursDialogOpen, setIsDealerHoursDialogOpen] = useState(false);

    // ── 2. Queries ────────────────────────────────────────────────────────

    const {
        data: dealer,
        isLoading,
        error,
    } = useQuery({
        queryKey: [QueryConst.dealers.details, dealerId],
        queryFn: () => getDealerDetailsById(dealerId!),
        enabled: !!dealerId,
    });

    // ── 3. Handlers ───────────────────────────────────────────────────────

    const handleGoBack = useCallback(() => {
        navigate(AdminRoutes.merchants.list);
    }, [navigate]);

    // Basic Info dialog
    const handleDealerInfoOpen = useCallback(() => setIsDealerInfoDialogOpen(true), []);
    const handleDealerInfoClose = useCallback(() => setIsDealerInfoDialogOpen(false), []);

    // Addresses dialog
    const handleAddressesOpen = useCallback(() => setIsDealerAddressesDialogOpen(true), []);
    const handleAddressesClose = useCallback(() => setIsDealerAddressesDialogOpen(false), []);

    // Contacts dialog
    const handleContactsOpen = useCallback(() => setIsDealerContactsDialogOpen(true), []);
    const handleContactsClose = useCallback(() => setIsDealerContactsDialogOpen(false), []);

    // Business Hours dialog
    const handleHoursOpen = useCallback(() => setIsDealerHoursDialogOpen(true), []);
    const handleHoursClose = useCallback(() => setIsDealerHoursDialogOpen(false), []);

    return {
        dealerId,
        dealer,
        isLoading,
        error,
        handleGoBack,
        // Basic info dialog
        isDealerInfoDialogOpen,
        handleDealerInfoOpen,
        handleDealerInfoClose,
        // Addresses dialog
        isDealerAddressesDialogOpen,
        handleAddressesOpen,
        handleAddressesClose,
        // Contacts dialog
        isDealerContactsDialogOpen,
        handleContactsOpen,
        handleContactsClose,
        // Business Hours dialog
        isDealerHoursDialogOpen,
        handleHoursOpen,
        handleHoursClose,
    };
};
