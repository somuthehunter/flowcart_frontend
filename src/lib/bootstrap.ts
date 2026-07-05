import { worker } from "@/mocks/api/browser";
import { mountAuthInterceptor } from "@/lib/auth-interceptor";

import { config } from "./config";
import logger from "./log-utils";
import { getFullUrl } from "./route-utils";

async function initMockServiceWorker() {
    if (
        (config.env.MODE === "development" ||
            config.env.MODE === "production") &&
        config.env.API_BASE_URL?.startsWith("/")
    ) {
        await worker.start({
            onUnhandledRequest(req, print) {
                const url = new URL(req.url);
                if (
                    !url.pathname.startsWith(
                        getFullUrl(config.env.API_BASE_URL)
                    )
                ) {
                    return;
                }

                print.warning();
            },
        });
    }
}

export async function bootstrap() {
    // 1. Start MSW worker (dev/mock mode only)
    await initMockServiceWorker();

    // 2. Initialize logger (window.onerror handler)
    logger.initialize();

    // 3. Mount Axios auth interceptor (401 → refresh → retry)
    mountAuthInterceptor();
}
