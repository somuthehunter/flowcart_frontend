import { fakerEN_IN as faker } from "@faker-js/faker";

import {
    AvailableNumberResponse,
    ChannelSettingsResponse,
    EscalationSettingsResponse,
    LeadFormResponse,
    PhoneNumberResponse,
    SocialConnectionResponse,
    TeamMemberResponse,
    UsageStatsResponse,
    WidgetSettingsResponse,
} from "@/types/response/configuration-response";

export const createMockOwnedNumber = (): PhoneNumberResponse => ({
    id: faker.string.uuid(),
    number: faker.phone.number(),
    type: faker.helpers.arrayElement(["local", "toll-free"]),
    capabilities: ["voice", "sms"],
    status: "active",
    monthlyRate: faker.helpers.arrayElement([2.0, 5.0]),
    assignedTo: faker.helpers.arrayElement([
        "AI Voice Agent",
        "Main Line",
        undefined,
    ]),
});

export const createMockAvailableNumber = (
    areaCode?: string
): AvailableNumberResponse => ({
    number: `+1 (${areaCode || faker.string.numeric(3)}) ${faker.string.numeric(3)}-${faker.string.numeric(4)}`,
    type: faker.helpers.arrayElement(["local", "toll-free"]),
    capabilities: ["voice", "sms"],
    monthlyRate: faker.helpers.arrayElement([2.0, 5.0]),
    areaCode: areaCode || faker.string.numeric(3),
});

export const createMockSocialConnection = (
    platform: "facebook" | "instagram" | "whatsapp"
): SocialConnectionResponse => ({
    id: faker.string.uuid(),
    platform,
    name: faker.company.name(),
    pageId: faker.string.numeric(9),
    status: faker.helpers.arrayElement(["connected", "disconnected"]),
    connectedAt: faker.date.recent().toISOString().split("T")[0],
});

export const mockChannelSettings: ChannelSettingsResponse = {
    voiceEnabled: true,
    smsEnabled: true,
    webChatEnabled: true,
    facebookEnabled: true,
    instagramEnabled: false,
    whatsappEnabled: false,
};

export const mockUsageStats: UsageStatsResponse = {
    voiceMinutes: 1247,
    smsSent: 3892,
    smsReceived: 2156,
};

export const mockWidgetSettings: WidgetSettingsResponse = {
    primaryColor: "#2563EB",
    position: "bottom-right",
    buttonSize: "medium",
    buttonIcon: "chat",
    welcomeMessage: "Hi there! How can I help you today?",
    placeholder: "Type your message...",
    showBranding: true,
    autoOpen: false,
    autoOpenDelay: 5,
    collectEmail: true,
    headerTitle: "Chat with us",
    headerSubtitle: "We typically reply within minutes",
    offlineMessage:
        "We are currently offline. Leave us a message and we'll get back to you.",
    bubbleText: "Need help?",
};

export const createMockFormField = (
    index: number
): LeadFormResponse["fields"][0] => {
    const types = ["text", "email", "phone", "select", "textarea"] as const;
    const type = types[index % types.length];
    return {
        id: faker.string.uuid(),
        type,
        label: faker.helpers.arrayElement([
            "Name",
            "Email",
            "Phone",
            "Interest",
            "Message",
        ]),
        placeholder: faker.lorem.words(2),
        required: faker.datatype.boolean(),
        options:
            type === "select"
                ? ["Option 1", "Option 2", "Option 3"]
                : undefined,
    };
};

export const mockLeadForm: LeadFormResponse = {
    formName: "Vehicle Inquiry Form",
    submitButtonText: "Submit Inquiry",
    successMessage: "Thank you! We'll contact you shortly.",
    primaryColor: "#2563EB",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    fields: Array.from({ length: 5 }, (_, i) => createMockFormField(i)),
};

export const createMockTeamMember = (): TeamMemberResponse => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    role: faker.helpers.arrayElement([
        "Sales Manager",
        "Sales Agent",
        "BDC Agent",
    ]),
    phone: faker.phone.number(),
    available: faker.datatype.boolean(),
});

export const mockTeamMembers: TeamMemberResponse[] = Array.from(
    { length: 8 },
    createMockTeamMember
);

export const mockEscalationSettings: EscalationSettingsResponse = {
    autoEscalateNegativeSentiment: true,
    autoEscalateComplaint: true,
    autoEscalateFinancing: true,
    autoEscalatePriceNegotiation: true,
    autoEscalateNoResponse: true,
    autoEscalateAfterAttempts: 3,
    noResponseTimeout: "60",
    escalateOutsideHours: true,
    businessHoursStart: "09:00",
    businessHoursEnd: "18:00",
    voiceFallbackAction: "transfer",
    chatFallbackAction: "queue",
    routingMethod: "round-robin",
    fallbackEmail: faker.internet.email(),
    maxRingTime: "30",
    fallbackTeam: mockTeamMembers.slice(0, 3).map((m) => m.id),
};
