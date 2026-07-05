import QueryConst from "@/constants/query-constants";

import { config } from "./config";

type UrlUtilsParams = {
    url: string;
    baseUrl: string;
    endpoints: string[];
};
export const urlMatchesEndpoints = ({
    url,
    baseUrl,
    endpoints,
}: UrlUtilsParams): boolean => {
    return endpoints.some((endpoint) => url.includes(`${baseUrl}/${endpoint}`));
};

export const isAuthEndpoint = (reqUrl: string): boolean => {
    const authEndpoints = [
        QueryConst.auth.refreshToken,
        QueryConst.auth.logout,
        QueryConst.auth.login,
    ];
    return urlMatchesEndpoints({
        url: reqUrl,
        baseUrl: config.env.API_BASE_URL,
        endpoints: authEndpoints,
    });
};
