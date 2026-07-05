import { config } from "@/lib/config";
import {
    login as loginApi,
    logout as logoutApi,
    refreshToken,
} from "@/services/api/auth-ep";
import {
    getLoginState,
    getRefreshToken,
    getUserFromToken,
    logout as localLogout,
    onLoginSuccess,
    setRefreshToken,
} from "@/services/auth-service";
import httpService from "@/services/http-service";
import { create } from "zustand";
import { devtools, NamedSet, subscribeWithSelector } from "zustand/middleware";

import { AccountUser } from "@/types/account-user";
import { SignInRequest } from "@/types/request/auth-request";

const STORE = "auth";

const Actions = {
    signIn: `${STORE}/signIn`,
    signOut: `${STORE}/signOut`,
    refreshToken: `${STORE}/refreshToken/success`,
    refreshTokenFailed: `${STORE}/refreshToken/failed`,
    verifyUser: `${STORE}/verifyUser/success`,
    verifyUserFailed: `${STORE}/verifyUser/failed`,
    verifyUserNoSession: `${STORE}/verifyUser/noSession`,
    updateUser: `${STORE}/updateUser`,
    unknown: `${STORE}/unknown`,
} as const;

type ActionName = (typeof Actions)[keyof typeof Actions];

interface AuthState {
    isLoading: boolean;
    isAuthenticated: boolean;
    user?: AccountUser;
    signIn: (data: SignInRequest) => Promise<void>;
    signOut: () => void;
    refreshToken: () => Promise<void>;
    verifyUser: () => void;
    updateUser: (user: AccountUser) => void;
}

export const useAuthStore = create<AuthState>()(
    subscribeWithSelector(
        devtools(
            (set) => ({
            // STATE
            user: undefined,
            isAuthenticated: false,
            isLoading: true,

            // ACTIONS
            signIn: async (data) => {
                const response = await loginApi(data);
                if (!response) return;

                const userObj = getUserFromToken({
                    accessToken: response.data.accessToken!,
                });
                set(
                    {
                        isLoading: false,
                        isAuthenticated: true,
                        user: userObj,
                    },
                    false,
                    Actions.signIn
                );
                onLoginSuccess(response);
            },

            signOut: () => {
                logoutApi(getRefreshToken()).finally(() => {
                    set(
                        {
                            isAuthenticated: false,
                            user: undefined,
                            isLoading: false,
                        },
                        false,
                        Actions.signOut
                    );
                    localLogout();
                });
            },

            refreshToken: () =>
                handleTokenRefresh(set, {
                    success: Actions.refreshToken,
                    failed: Actions.refreshTokenFailed,
                }),

            verifyUser: () => {
                if (!getLoginState()) {
                    set(
                        { isLoading: false },
                        false,
                        Actions.verifyUserNoSession
                    );
                    return;
                }
                handleTokenRefresh(set, {
                    success: Actions.verifyUser,
                    failed: Actions.verifyUserFailed,
                });
            },
            updateUser: (user: AccountUser) => {
                set({ user }, false, Actions.updateUser);
            },
        }),
        {
            name: STORE,
            anonymousActionType: Actions.unknown,
            enabled: config.env.MODE !== "production",
        }
    )
));

let refreshTokenPromise: Promise<void> | null = null;

const handleTokenRefresh = async (
    set: NamedSet<AuthState>,
    actionName: { success: ActionName; failed: ActionName }
) => {
    if (refreshTokenPromise) {
        return refreshTokenPromise;
    }

    refreshTokenPromise = (async () => {
        try {
            const response = await refreshToken(getRefreshToken());
        if (!response) {
            set(
                { isAuthenticated: false, isLoading: false, user: undefined },
                false,
                actionName.failed
            );
            return localLogout();
        }

        const user = getUserFromToken({
            accessToken: response.accessToken!,
        });

        if (user) {
            httpService.injectAuthToken(response.accessToken!);
            setRefreshToken(response.refreshToken!);
            set(
                { isAuthenticated: true, user, isLoading: false },
                false,
                actionName.success
            );
            return;
        }

        set(
            { isAuthenticated: false, isLoading: false, user: undefined },
            false,
            actionName.failed
        );
        localLogout();
    } catch (error) {
        console.log(error);
        localLogout();
        set(
            { isAuthenticated: false, isLoading: false, user: undefined },
            false,
            actionName.failed
        );
    } finally {
        refreshTokenPromise = null;
    }
    })();
    return refreshTokenPromise;
};
