import {
    AxiosHeaders,
    HttpStatusCode,
    InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "@/stores/auth-store";
import httpService from "@/services/http-service";

import { isAuthEndpoint } from "./url-utils";

export function mountAuthInterceptor() {
    let isRefreshing = false;
    let failedQueue: Array<{
        resolve: (value?: any) => void;
        reject: (error?: any) => void;
        config: InternalAxiosRequestConfig;
    }> = [];

    httpService.insertResponseInterceptor(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response?.status === HttpStatusCode.Unauthorized) {
                const reqUrl = error.response.request?.responseURL || "";
                if (isAuthEndpoint(reqUrl)) {
                    return Promise.reject(error);
                }

                if (!isRefreshing) {
                    isRefreshing = true;
                    useAuthStore
                        .getState()
                        .refreshToken()
                        .then(() => {
                            isRefreshing = false;
                            failedQueue.forEach(({ resolve, config }) => {
                                if (
                                    httpService.instance.defaults.headers.common
                                        .Authorization
                                ) {
                                    config.headers = new AxiosHeaders({
                                        ...config.headers,
                                        Authorization:
                                            httpService.instance.defaults.headers
                                                .common.Authorization,
                                    });
                                }
                                resolve(httpService.instance.request(config));
                            });
                            failedQueue = [];
                        })
                        .catch((err) => {
                            isRefreshing = false;
                            failedQueue.forEach(({ reject }) => reject(err));
                            failedQueue = [];
                        });
                }

                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject, config: error.config });
                });
            }
            return Promise.reject(error);
        }
    );
}
