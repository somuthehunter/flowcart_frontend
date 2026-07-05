import { HttpStatusCode } from "axios";
import { getUnixTime } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { HttpResponse } from "msw";

import { AccessTokenPayload } from "@/types/access-token";

export const authMiddleware = (handler: any) => {
    return async (args: any) => {
        const { request } = args;
        const authHeader = request.headers.get("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return HttpResponse.json(
                { success: false, message: "Unauthorized" },
                { status: HttpStatusCode.Unauthorized }
            );
        }

        const token = authHeader.replace("Bearer ", "");
        try {
            const decoded = jwtDecode<AccessTokenPayload>(token);
            const now = getUnixTime(new Date());
            if (decoded.exp < now) {
                return HttpResponse.json(
                    { success: false, message: "Token expired" },
                    { status: HttpStatusCode.Unauthorized }
                );
            }
            // If auth is valid, proceed to the handler
            return handler(args);
        } catch (error) {
            return HttpResponse.json(
                { success: false, message: "Invalid token" },
                { status: HttpStatusCode.Unauthorized }
            );
        }
    };
};
