import { getErrorString, handleApiError } from "@/lib/object-utils";
import httpService from "@/services/http-service";
import { HttpStatusCode } from "axios";

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
import QueryConst from "@/constants/query-constants";

export const getOwnedNumbers = async () => {
    try {
        const response = await httpService.get<PhoneNumberResponse[]>(
            QueryConst.channels.ownedNumbers
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const getAvailableNumbers = async (params: {
    areaCode?: string;
    type?: string;
}) => {
    try {
        const response = await httpService.get<AvailableNumberResponse[]>(
            QueryConst.channels.availableNumbers,
            { params }
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const buyPhoneNumber = async (number: string) => {
    try {
        const response = await httpService.post<PhoneNumberResponse>(
            QueryConst.channels.buyNumber,
            { number }
        );
        if (
            response.status === HttpStatusCode.Created ||
            response.status === HttpStatusCode.Ok
        ) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const getSocialConnections = async () => {
    try {
        const response = await httpService.get<SocialConnectionResponse[]>(
            QueryConst.channels.socialConnections
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const connectSocialPlatform = async (platform: string) => {
    try {
        const response = await httpService.post<SocialConnectionResponse>(
            QueryConst.channels.connectSocial,
            { platform }
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const disconnectSocialPlatform = async (platform: string) => {
    try {
        const response = await httpService.post<{ success: boolean }>(
            QueryConst.channels.disconnectSocial,
            { platform }
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const getChannelSettings = async () => {
    try {
        const response = await httpService.get<ChannelSettingsResponse>(
            QueryConst.channels.settings
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const updateChannelSettings = async (
    settings: Partial<ChannelSettingsResponse>
) => {
    try {
        const response = await httpService.patch<ChannelSettingsResponse>(
            QueryConst.channels.settings,
            settings
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const getUsageStats = async () => {
    try {
        const response = await httpService.get<UsageStatsResponse>(
            QueryConst.channels.usageStats
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const getWidgetSettings = async () => {
    try {
        const response = await httpService.get<WidgetSettingsResponse>(
            QueryConst.widget.settings
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const updateWidgetSettings = async (
    settings: Partial<WidgetSettingsResponse>
) => {
    try {
        const response = await httpService.patch<WidgetSettingsResponse>(
            QueryConst.widget.settings,
            settings
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const getLeadFormSettings = async () => {
    try {
        const response = await httpService.get<LeadFormResponse>(
            QueryConst.widget.forms
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const updateLeadFormSettings = async (
    settings: Partial<LeadFormResponse>
) => {
    try {
        const response = await httpService.patch<LeadFormResponse>(
            QueryConst.widget.forms,
            settings
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const getEscalationSettings = async () => {
    try {
        const response = await httpService.get<EscalationSettingsResponse>(
            QueryConst.escalation.settings
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const updateEscalationSettings = async (
    settings: Partial<EscalationSettingsResponse>
) => {
    try {
        const response = await httpService.patch<EscalationSettingsResponse>(
            QueryConst.escalation.settings,
            settings
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};

export const getTeamMembers = async () => {
    try {
        const response = await httpService.get<TeamMemberResponse[]>(
            QueryConst.escalation.teamMembers
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};
