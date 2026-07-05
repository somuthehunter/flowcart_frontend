import { config } from "@/lib/config";
import { fakerEN_IN as faker } from "@faker-js/faker";
import { HttpStatusCode } from "axios";
import { add, getUnixTime } from "date-fns";
import jwtEncode from "jwt-encode";
import { http, HttpResponse } from "msw";

import { UserType } from "@/types/response/user-response";
import { cookieConstants } from "@/constants/cookie-constants";
import QueryConst from "@/constants/query-constants";

import { authPasswords, authUsers } from "../fake-store/users";

const baseURL = config.env.API_BASE_URL;
const secretKey =
    "q384u5q3894u58394uq3894utq4utrq3u48u83494tu8w34n3923i29394598q2u";

const DEFAULT_SCOPES = [
    "admin.user",
    "user.create",
    "user.update",
    "user.view",
    "user.view.all",
    "role.create",
    "role.update",
    "role.view",
    "role.view.all",
] as const;

const generateAccessToken = (user: typeof authUsers.admin) => {
    const now = new Date();

    return jwtEncode(
        {
            sub: user.id,
            email: user.email,
            family_name: user.firstName,
            given_name: user.lastName,
            jti: faker.string.uuid(),
            user_id: user.id,
            entity_id: faker.string.uuid(),
            user_type: UserType[user.role],
            role_id: faker.string.uuid(),
            scopes: DEFAULT_SCOPES,
            iss: "https://localhost:13001",
            exp: getUnixTime(add(now, { minutes: 10 })),
            iat: getUnixTime(now),
        },
        secretKey,
        {
            alg: "HS256",
            typ: "JWT",
        }
    );
};

const loginHandler = async ({ request: req }: { request: Request }) => {
    const { email, password } = await req.json();

    const userKey = (Object.keys(authUsers) as (keyof typeof authUsers)[]).find(
        (key) => authUsers[key].email === email
    );

    if (userKey && password === authPasswords[userKey]) {
        const user = authUsers[userKey];
        const accessToken = generateAccessToken(user);
        const refreshToken = btoa(user.email.toLowerCase());

        return HttpResponse.json(
            {
                success: true,
                message: null,
                data: {
                    merchant: null,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                },
            },
            {
                headers: {
                    "set-cookie": `${cookieConstants.refreshToken}=${refreshToken}; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}`,
                },
            }
        );
    }
    return HttpResponse.json(
        {
            ServerStatusCode: -9004,
            Message: "Invalid Customer ID",
        },
        { status: HttpStatusCode.BadRequest }
    );
};

export const handlers = [
    http.post(`${baseURL}/${QueryConst.auth.login}`, loginHandler),
    http.post(`${baseURL}/${QueryConst.auth.refreshToken}`, async ({ request }) => {
        const { refreshToken } = await request.json() as any;

        if (!refreshToken) {
            return HttpResponse.json(
                {
                    success: false,
                    message: "No refresh token found",
                    accessToken: null,
                    idToken: null,
                },
                { status: HttpStatusCode.Unauthorized }
            );
        }

        let userEmail = "";
        try {
            userEmail = atob(refreshToken).toLowerCase();
        } catch (e) {
            // ignore
        }

        // For mock purposes, find the matching user or fallback to admin
        let user = authUsers.admin;
        if (userEmail === authUsers.manager.email.toLowerCase()) {
            user = authUsers.manager;
        } else if (userEmail === authUsers.viewer.email.toLowerCase()) {
            user = authUsers.viewer;
        } else if (userEmail === authUsers.admin.email.toLowerCase()) {
            user = authUsers.admin;
        }

        const accessToken = generateAccessToken(user);
        const newRefreshToken = btoa(user.email.toLowerCase());

        return HttpResponse.json(
            {
                accessToken: accessToken,
                refreshToken: newRefreshToken,
            },
            {
                headers: {
                    "set-cookie": `${cookieConstants.refreshToken}=${newRefreshToken}; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}`,
                },
            }
        );
    }),
    http.get<{ email: string }>(
        `${baseURL}/Auth/Password/Reset/:email`,
        ({ params }) => {
            const { email } = params;
            if (email) {
                if (email === "admin.user@gmail.com")
                    return HttpResponse.text("User is disabled", {
                        status: HttpStatusCode.BadRequest,
                    });
                if (email === "sic.user@gmail.com")
                    return HttpResponse.text("User does not exist", {
                        status: HttpStatusCode.NotFound,
                    });

                if (email === "standard.user@gmail.com")
                    return HttpResponse.text("Some Server Error", {
                        status: HttpStatusCode.InternalServerError,
                    });

                return new HttpResponse(null, {
                    status: HttpStatusCode.NoContent,
                });
            }
            return new HttpResponse(null, { status: HttpStatusCode.NoContent });
        }
    ),
    http.put<
        {},
        { requestHash: string; oldPassword: string; newPassword: string }
    >(`${baseURL}/Auth/Password/Set`, async ({ request: req }) => {
        const { requestHash } = await req.json();
        if (!requestHash)
            return HttpResponse.text("Invalid change password param", {
                status: HttpStatusCode.BadRequest,
            });
        if (requestHash === "k2")
            return HttpResponse.text("Password reset request expired", {
                status: HttpStatusCode.Gone,
            });
        if (requestHash === "k1")
            return HttpResponse.text("User not found", {
                status: HttpStatusCode.NotFound,
            });
        return new HttpResponse(null, { status: HttpStatusCode.NoContent });
    }),
    http.put<
        {},
        { requestHash: string; oldPassword: string; newPassword: string }
    >(`${baseURL}/Auth/Password/Change`, async ({ request: req }) => {
        const { oldPassword } = await req.json();
        if (!oldPassword)
            return HttpResponse.text("Invalid change password param", {
                status: HttpStatusCode.BadRequest,
            });
        if (oldPassword === "k2")
            return HttpResponse.text("Password reset request expired", {
                status: HttpStatusCode.Gone,
            });
        if (oldPassword === "k1")
            return HttpResponse.text("User not found", {
                status: HttpStatusCode.NotFound,
            });
        return new HttpResponse(null, { status: HttpStatusCode.NoContent });
    }),
    http.post(`${baseURL}/${QueryConst.auth.logout}`, () => {
        return new HttpResponse(null, {
            status: HttpStatusCode.Ok,
            headers: {
                "set-cookie": `${cookieConstants.refreshToken}=; SameSite=Lax; Path=/; Max-Age=0, ${cookieConstants.idToken}=; SameSite=Lax; Path=/; Max-Age=0`,
            },
        });
    }),
];
