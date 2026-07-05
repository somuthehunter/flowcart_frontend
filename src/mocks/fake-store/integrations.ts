import { fakerEN_IN as faker } from "@faker-js/faker";

import {
    IntegrationCategoryResponse,
    IntegrationResponse,
} from "@/types/response/integration-response";

export const integrationCategories: IntegrationCategoryResponse[] = [
    { id: "crm", name: "CRM", description: "Customer relationship management" },
    { id: "dms", name: "DMS", description: "Dealer management systems" },
    { id: "calendar", name: "Calendar", description: "Appointment scheduling" },
    {
        id: "communications",
        name: "Communications",
        description: "Voice and messaging",
    },
    { id: "social", name: "Social", description: "Social media channels" },
    { id: "payments", name: "Payments", description: "Payment processing" },
];

const integrationData: Omit<
    IntegrationResponse,
    "id" | "category" | "status" | "lastSync" | "errorMessage"
>[] = [
    {
        name: "GoHighLevel",
        description: "All-in-one CRM and marketing platform",
        logo: "/integrations/gohighlevel.svg",
        tier: "core",
    },
    {
        name: "HubSpot",
        description: "CRM, marketing, sales, and service software",
        logo: "/integrations/hubspot.svg",
        tier: "core",
    },
    {
        name: "Salesforce",
        description: "Enterprise CRM platform",
        logo: "/integrations/salesforce.svg",
        tier: "enterprise",
    },
    {
        name: "CDK Global",
        description: "Dealer management system for inventory and sales",
        logo: "/integrations/cdk.svg",
        tier: "core",
    },
    {
        name: "Reynolds and Reynolds",
        description: "Automotive retail management solutions",
        logo: "/integrations/reynolds.svg",
        tier: "core",
    },
    {
        name: "Google Calendar",
        description: "Schedule and manage appointments",
        logo: "/integrations/google-calendar.svg",
        tier: "core",
    },
    {
        name: "Microsoft Outlook",
        description: "Email and calendar management",
        logo: "/integrations/outlook.svg",
        tier: "core",
    },
    {
        name: "Twilio",
        description: "Voice, SMS, and messaging APIs",
        logo: "/integrations/twilio.svg",
        tier: "core",
    },
    {
        name: "Facebook Messenger",
        description: "Connect with customers on Facebook",
        logo: "/integrations/facebook.svg",
        tier: "performance",
    },
    {
        name: "Instagram DM",
        description: "Handle Instagram direct messages",
        logo: "/integrations/instagram.svg",
        tier: "performance",
    },
    {
        name: "WhatsApp Business",
        description: "WhatsApp messaging integration",
        logo: "/integrations/whatsapp.svg",
        tier: "performance",
    },
    {
        name: "Stripe",
        description: "Payment processing and billing",
        logo: "/integrations/stripe.svg",
        tier: "core",
    },
];

export const mockIntegrations: IntegrationResponse[] = integrationData.map(
    (data, index) => {
        const categories: IntegrationCategoryResponse["id"][] = [
            "crm",
            "dms",
            "calendar",
            "communications",
            "social",
            "payments",
        ];
        const status: IntegrationResponse["status"][] = [
            "connected",
            "disconnected",
            "pending",
            "error",
        ];

        return {
            ...data,
            id: data.name.toLowerCase().replace(/\s+/g, "-"),
            category: categories[index % categories.length],
            status: status[index % status.length],
            lastSync:
                status[index % status.length] === "connected"
                    ? faker.date.recent().toISOString()
                    : undefined,
            errorMessage:
                status[index % status.length] === "error"
                    ? "Failed to synchronize data"
                    : undefined,
        };
    }
);
