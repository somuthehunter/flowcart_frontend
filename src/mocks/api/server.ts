import { setupServer } from "msw/node";

import { aiAgentHandlers } from "./aiAgentHandlers";
import { handlers as authHandlers } from "./authHandlers";
import { configurationHandlers } from "./configurationHandlers";
import { dealerHandlers } from "./dealerHandlers";
import { integrationHandlers } from "./integrationHandlers";
import { inventoryHandlers } from "./inventory";
import { productHandlers } from "./productHandlers";
import { categoryHandlers } from "./categoryHandlers";
import { billHandlers } from "./billHandlers";

export const server = setupServer(
    ...authHandlers,
    ...aiAgentHandlers,
    ...configurationHandlers,
    ...integrationHandlers,
    ...dealerHandlers,
    ...inventoryHandlers,
    ...productHandlers,
    ...categoryHandlers,
    ...billHandlers
);
