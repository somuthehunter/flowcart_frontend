import { setupWorker } from "msw/browser";

import { aiAgentHandlers } from "./aiAgentHandlers";
import { handlers as authHandlers } from "./authHandlers";
import { configurationHandlers } from "./configurationHandlers";
import { dealerHandlers } from "./dealerHandlers";
import { integrationHandlers } from "./integrationHandlers";
import { roleHandlers } from "./roleHandlers";
import { scopeHandlers } from "./scopeHandlers";
import { userHandlers } from "./userHandlers";
import { inventoryHandlers } from "./inventory";
import { productHandlers } from "./productHandlers";
import { categoryHandlers } from "./categoryHandlers";
import { billHandlers } from "./billHandlers";

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(
    ...authHandlers,
    ...aiAgentHandlers,
    ...configurationHandlers,
    ...integrationHandlers,
    ...dealerHandlers,
    ...roleHandlers,
    ...scopeHandlers,
    ...userHandlers,
    ...inventoryHandlers,
    ...productHandlers,
    ...categoryHandlers,
    ...billHandlers
);
