import { PageParams } from "./common-request";
import { DealerDetails } from "../response/dealer-response";

export type DealerFilterParams = PageParams & {
    searchKeyword?: string | null;
    status?: number | null;
};

export type CreateDealerRequest = Omit<
    DealerDetails,
    | "dealerId"
    | "createdAt"
    | "updatedAt"
    | "logUsername"
    | "logDts"
    | "dealerCode"
    | "status"
    | "ownerName"
    | "addresses"
    | "contactPersons"
    | "departmentBusinessHours"
> & {
    addresses: Omit<DealerDetails["addresses"][number], "addressId" | "dealerId" | "latitude" | "longitude">[];
    contactPersons: Omit<DealerDetails["contactPersons"][number], "contactId" | "dealerId">[];
    departmentBusinessHours: Omit<DealerDetails["departmentBusinessHours"][number], "dealerId">[];
};

/**
 * Update payload — partial over CreateDealerRequest fields plus
 * dealerId (used in the URL) and any server-assigned fields that
 * may be sent back unchanged.
 */
export type UpdateDealerRequest = Omit<
    Partial<CreateDealerRequest>,
    "addresses" | "contactPersons" | "departmentBusinessHours"
> & {
    dealerId: string;
    dealerCode?: string;
    primaryPhone?: string | null;
    addresses?: Omit<DealerDetails["addresses"][number], "dealerId" | "latitude" | "longitude">[];
    contactPersons?: Omit<DealerDetails["contactPersons"][number], "dealerId">[];
    departmentBusinessHours?: Omit<DealerDetails["departmentBusinessHours"][number], "dealerId">[];
};
