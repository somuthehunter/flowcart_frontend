export type IntegrationCategory =
    | "crm"
    | "dms"
    | "calendar"
    | "communications"
    | "social"
    | "payments";

export type IntegrationStatus =
    | "connected"
    | "disconnected"
    | "error"
    | "pending";

export type IntegrationTier = "core" | "performance" | "enterprise";

export interface IntegrationResponse {
    id: string;
    name: string;
    description: string;
    category: IntegrationCategory;
    status: IntegrationStatus;
    logo: string;
    lastSync?: string;
    errorMessage?: string;
    tier: IntegrationTier;
}

export interface IntegrationCategoryResponse {
    id: IntegrationCategory;
    name: string;
    description: string;
}
