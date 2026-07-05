import logger from "@/lib/log-utils";
import { redirectTo } from "@/lib/route-utils";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

import { AccessTokenPayload } from "@/types/access-token";
import { AccountUser } from "@/types/account-user";
import { SignInResponse } from "@/types/response/auth-response";
import { UserType } from "@/types/response/user-response";
import { UserRoles } from "@/types/types";
import { UserScopes } from "@/types/user-scopes";

import httpService from "./http-service";
import { StorageService } from "./storage-service";

const loginStateStorage = new StorageService("isLoggedIn");
const refreshTokenStorage = new StorageService("refreshToken");

export function getRefreshToken(): string | null {
    return refreshTokenStorage.get();
}

export function setRefreshToken(token: string | null): void {
    if (token) {
        refreshTokenStorage.set(token);
    } else {
        refreshTokenStorage.clear();
    }
}

/**
 * Set the login state flag in localStorage
 */
export function setLoginState(isLoggedIn: boolean): void {
    loginStateStorage.set(isLoggedIn);
}

/**
 * Get the login state flag from localStorage
 */
export function getLoginState(): boolean {
    const state = loginStateStorage.get();
    return state === true; // explicit check for true
}

/**
 * Get user object from access token and id token
 */
export function getUserFromToken({
    accessToken,
}: {
    accessToken: string;
}): AccountUser | undefined {
    if (accessToken) {
        const decodedAccessToken = jwtDecode<AccessTokenPayload>(accessToken);

        const rawUserType = decodedAccessToken.user_type || (decodedAccessToken as any).role;
        let userType = Number(rawUserType) as UserType;
        
        let roleString: UserRoles = "Merchant Owner";
        
        if (!isNaN(userType)) {
            if (userType === UserType.PlatformAdmin) roleString = "Platform Admin";
            else if (userType === UserType.MerchantOwner) roleString = "Merchant Owner";
            else if (userType === UserType.StoreManager) roleString = "Store Manager";
            else if (userType === UserType.Cashier) roleString = "Cashier";
            else if (userType === UserType.StoreStaff) roleString = "Store Staff";
            else if (userType === UserType.Security) roleString = "Security";
        } else {
            const strType = String(rawUserType).trim();
            if (strType === "Platform Admin" || strType === "Super Admin") {
                roleString = "Platform Admin";
                userType = UserType.PlatformAdmin;
            }
            else if (strType === "Merchant Owner") {
                roleString = "Merchant Owner";
                userType = UserType.MerchantOwner;
            }
            else if (strType === "Store Manager") {
                roleString = "Store Manager";
                userType = UserType.StoreManager;
            }
            else if (strType === "Cashier") {
                roleString = "Cashier";
                userType = UserType.Cashier;
            }
            else if (strType === "Store Staff") {
                roleString = "Store Staff";
                userType = UserType.StoreStaff;
            }
            else if (strType === "Security") {
                roleString = "Security";
                userType = UserType.Security;
            }
        }

        const user: AccountUser = {
            id: decodedAccessToken.id,
            firstName: decodedAccessToken.given_name,
            lastName: decodedAccessToken.family_name,
            email: decodedAccessToken.email,
            profileImageUrl: decodedAccessToken.profile_image_url,
            phoneNumber: decodedAccessToken.phone_number,
            entityId: decodedAccessToken.entity_id,
            userType: userType,
            roleId: decodedAccessToken.role_id,
            role: roleString,
            scopes: decodedAccessToken.scp as UserScopes[],
            expiresAt: decodedAccessToken.exp,
            accessToken: accessToken,
        };
        return user;
    }
    return undefined;
}

/**
 * Handle login success by injecting tokens in http service and redirecting to post login path
 * @param data
 * @param postLoginPath
 */
export async function onLoginSuccess(
    response: SignInResponse,
    postLoginPath?: string
): Promise<void> {
    if (response.data?.accessToken) {
        try {
            const user = getUserFromToken({
                accessToken: response.data.accessToken,
            });
            if (user) {
                httpService.injectAuthToken(response.data.accessToken);
                setLoginState(true);
                setRefreshToken(response.data.refreshToken);
                logger.setUsername(user.email);
                logger.info("{username}: Login successful!");
            }
            if (postLoginPath) {
                redirectTo(postLoginPath);
            }
        } catch (err) {
            toast.error("Couldn't fetch the access token");
            // logger.error(err);
        }
    }
}

export function logout() {
    httpService.removeAuthToken();
    setLoginState(false);
    setRefreshToken(null);
    logger.info("{username}: Logout successful!");
    logger.removeUser();
}
