# MSW Mocks & Fake Data

Set up Mock Service Worker (MSW) handlers + fake data factories for dev and test.

## Files

1. **Handler file**: `src/mocks/api/<domain>Handlers.ts` — HTTP route interception
2. **Fake factory file**: `src/mocks/fake-store/<domain>.ts` — Randomized data generation

## Handler Pattern

In `src/mocks/api/<domain>Handlers.ts`:

```ts
import config from "@/lib/config";
import { HttpStatusCode } from "axios";
import { http, HttpResponse } from "msw";

import QueryConst from "@/constants/query-constants";

import { createMockPrimaryMarketArea } from "../fake-store/contractor-analytics";

const baseURL = config.env.API_BASE_URL;

export const analyticsHandlers = [
    http.get(`${baseURL}/${QueryConst.analytics.primaryMarketArea}`, () => {
        return HttpResponse.json(createMockPrimaryMarketArea(), {
            status: HttpStatusCode.Ok,
        });
    }),
];
```

## Key Parts

| Part                                                   | Purpose                                                                  |
| ------------------------------------------------------ | ------------------------------------------------------------------------ |
| `http.get(url, handler)`                               | Intercept GET requests to this URL                                       |
| `${baseURL}/${QueryConst.analytics.primaryMarketArea}` | Full URL including API base (e.g., `/api/analytics/primary-market-area`) |
| `HttpResponse.json(data, { status })`                  | Return JSON response with status code                                    |
| `createMockPrimaryMarketArea()`                        | Factory function that generates fake data                                |

## Fake Data Factory Pattern

In `src/mocks/fake-store/<domain>.ts`:

```ts
import { fakerEN_IN } from "@faker-js/faker";

import { PrimaryMarketAreaResponse } from "@/types/response/contractor-dashboard-response";

const faker = fakerEN_IN;

export const createMockPrimaryMarketArea = (): PrimaryMarketAreaResponse => ({
    totalHouseholds: faker.number.int({ min: 5000, max: 50000 }),
    totalAnnualGoal: faker.number.int({ min: 1000, max: 5000 }),
});
```

## Rules

- **Import faker as `fakerEN_IN`** — provides India-localized fake data (phone numbers, names, etc.)
- **Return type matches response type** — `createMock<Entity>(): <Entity>Response`
- **Use faker methods** for realistic data:
    - `faker.string.uuid()` — UUID
    - `faker.number.int({ min, max })` — integer in range
    - `faker.company.name()` — company name
    - `faker.person.email()` — email address
    - `faker.location.city()` — city name
    - `faker.phone.number()` — phone number (India format)

## Registering Handlers

**You must register your handler array in two files** — one for the browser (dev), one for Node (tests).

### 1. `src/mocks/api/browser.ts` — dev Service Worker

```ts
import { setupWorker } from "msw/browser";

import { analyticsHandlers } from "./analyticsHandlers";
import { myDomainHandlers } from "./myDomainHandlers"; // ← ADD

export const worker = setupWorker(
    ...analyticsHandlers,
    ...myDomainHandlers // ← ADD
);
```

### 2. `src/mocks/api/server.ts` — Vitest / MSW node server

```ts
import { setupServer } from "msw/node";

import { analyticsHandlers } from "./analyticsHandlers";
import { myDomainHandlers } from "./myDomainHandlers"; // ← ADD

export const server = setupServer(
    ...analyticsHandlers,
    ...myDomainHandlers // ← ADD
);
```

Missing `browser.ts` → mocks won't work in dev. Missing `server.ts` → mocks won't work in Vitest tests.

## Per-Test Handler Overrides

In test files, override specific handlers:

```ts
import { server } from "@/mocks/server";

it("shows error when API fails", () => {
    server.use(
        http.get(`${baseURL}/${QueryConst.analytics.primaryMarketArea}`, () => {
            return HttpResponse.error();
        })
    );
    // Test error state
});
```

## Testing & Development

- **Dev**: When `VITE_API_BASE_URL` starts with `/` (e.g., `/api`), MSW auto-starts and intercepts all API calls
- **Test**: MSW is always active; use `server.use()` to override defaults per test
- **Production**: MSW is not bundled; real API calls go through

## Next Steps

- [Create hook](./hook.md)
- [Create component](./component.md)
