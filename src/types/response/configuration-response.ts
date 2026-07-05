export type PhoneNumberResponse = {
    id: string;
    number: string;
    type: "local" | "toll-free";
    capabilities: ("voice" | "sms")[];
    status: "active" | "pending";
    monthlyRate: number;
    assignedTo?: string;
};

export type AvailableNumberResponse = {
    number: string;
    type: "local" | "toll-free";
    capabilities: ("voice" | "sms")[];
    monthlyRate: number;
    areaCode: string;
};

export type SocialConnectionResponse = {
    id: string;
    platform: "facebook" | "instagram" | "whatsapp";
    name: string;
    pageId?: string;
    status: "connected" | "disconnected" | "pending";
    connectedAt?: string;
};

export type ChannelSettingsResponse = {
    voiceEnabled: boolean;
    smsEnabled: boolean;
    webChatEnabled: boolean;
    facebookEnabled: boolean;
    instagramEnabled: boolean;
    whatsappEnabled: boolean;
};

export type UsageStatsResponse = {
    voiceMinutes: number;
    smsSent: number;
    smsReceived: number;
};

export interface WidgetSettingsResponse {
    primaryColor: string;
    position: "bottom-right" | "bottom-left";
    buttonSize: "small" | "medium" | "large";
    buttonIcon: "chat" | "support" | "custom";
    welcomeMessage: string;
    placeholder: string;
    showBranding: boolean;
    autoOpen: boolean;
    autoOpenDelay: number;
    collectEmail: boolean;
    headerTitle: string;
    headerSubtitle: string;
    offlineMessage: string;
    bubbleText: string;
}

export interface FormField {
    id: string;
    type: "text" | "email" | "phone" | "select" | "textarea" | "checkbox";
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
}

export interface LeadFormResponse {
    formName: string;
    submitButtonText: string;
    successMessage: string;
    primaryColor: string;
    backgroundColor: string;
    borderRadius: number;
    fields: FormField[];
}

export interface EscalationSettingsResponse {
    autoEscalateNegativeSentiment: boolean;
    autoEscalateComplaint: boolean;
    autoEscalateFinancing: boolean;
    autoEscalatePriceNegotiation: boolean;
    autoEscalateNoResponse: boolean;
    autoEscalateAfterAttempts: number;
    noResponseTimeout: string;
    escalateOutsideHours: boolean;
    businessHoursStart: string;
    businessHoursEnd: string;
    voiceFallbackAction: string;
    chatFallbackAction: string;
    routingMethod: "round-robin" | "ring-all" | "priority";
    fallbackEmail: string;
    maxRingTime: string;
    fallbackTeam: string[]; // IDs of team members
}

export interface TeamMemberResponse {
    id: string;
    name: string;
    role: string;
    phone: string;
    available: boolean;
}
