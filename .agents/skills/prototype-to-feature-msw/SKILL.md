---
name: prototype-to-feature-msw
description: "Convert a prototype (Next.js) page into the project's React/Vite architecture with full MSW mock support. Use when: porting .prototype/components/ pages to src/, decomposing a monolithic component that mixes UI + state + data fetching into angular-style two-file pairs (.tsx UI + .ts hook), adding MSW dev/test mocks, converting Next.js fetch/useEffect to TanStack Query."
argument-hint: 'Prototype file path (e.g., ".prototype/components/service-opportunities.tsx")'
user-invocable: true
---

# Prototype to Feature (with MSW)

## When to Use

You have a file in `.prototype/components/` or `.prototype/app/` to port into `src/`:

- Prototype has a monolith component mixing UI, state, and data fetching in one file
- You need to break it into angular-style two-file pairs (`.tsx` UI + `.ts` hook)
- You want full MSW mock support (dev Service Worker + Vitest test server)
- Prototype uses `fetch()` in `useEffect`, hardcoded data arrays, or `"use client"` patterns

**Use `api-feature-integration` instead** when starting a greenfield feature with no prototype.

---

## Architecture Overview

Angular-like two-file pattern per component:

```
src/pages/<feature>/
  index.tsx                      ← re-export only (export default MyFeaturePage)
  my-feature-page.tsx            ← page layout FC — composes sub-components, sets <title>
  components/
    kpi-cards.tsx                ← UI only
    data-table.tsx               ← UI only
    filter-bar.tsx               ← UI only
  hooks/
    use-kpi-cards.ts             ← data + derived values
    use-data-table.ts            ← data + pagination + row handlers
    use-filter-bar.ts            ← local filter state + handlers
```

**Data flow**: Component → Hook → TanStack Query → Endpoint → Axios → MSW (dev/test) or real API

**Files involved** (9 steps across 4 phases):

| Phase      | Step                          | File                                                                     |
| ---------- | ----------------------------- | ------------------------------------------------------------------------ |
| Analyze    | 1. Analyze prototype          | — (read-only)                                                            |
| Analyze    | 2. Plan decomposition         | — (design only)                                                          |
| Data layer | 3. Response types             | `src/types/response/<domain>-response.ts`                                |
| Data layer | 4. Query constants            | `src/constants/query-constants.ts`                                       |
| Data layer | 5. Endpoint functions         | `src/services/api/<domain>-ep.ts`                                        |
| Mock layer | 6. Fake factory + MSW handler | `src/mocks/fake-store/<domain>.ts` + `src/mocks/api/<domain>Handlers.ts` |
| UI layer   | 7. Hooks                      | `src/pages/<feature>/hooks/use-<component>.ts`                           |
| UI layer   | 8. Components                 | `src/pages/<feature>/components/<component>.tsx`                         |
| UI layer   | 9. Page + route               | `src/pages/<feature>/` + `src/router/`                                   |

---

## Phase 1: Analyze & Decompose

### Step 1: Analyze the Prototype Component

[See analysis.md](./references/analysis.md)

Read the prototype file and extract:

- **Visual sections** — distinct UI regions (header stats, filter bar, data table, sidebar, modals)
- **Data shapes** — what each section renders; hardcoded mock arrays are type blueprints
- **State inventory** — which sections have local state (filters, pagination, open dialogs, active tabs)
- **Data fetching** — which sections call an API, what params they pass
- **Interactions** — click handlers, form submissions, navigation, modal triggers

---

### Step 2: Plan Component Decomposition

[See decomposition.md](./references/decomposition.md)

Map each section to a component + hook decision:

**A component needs its own hook if it has ANY of**: data fetching, local state, event handlers, derived computed values.

Example decomposition:

| Section            | Component file           | Needs hook? | Reason                              |
| ------------------ | ------------------------ | ----------- | ----------------------------------- |
| KPI cards          | `kpi-cards.tsx`          | Yes         | Fetches data                        |
| Filter bar         | `filter-bar.tsx`         | Yes         | Local filter state                  |
| Data table         | `data-table.tsx`         | Yes         | Fetches + pagination + row handlers |
| Static page header | _(inline in page)_       | No          | Pure display, no state              |
| Modal              | _(state in parent hook)_ | No          | Opened/closed from parent           |

---

## Phase 2: Data Layer

### Step 3: Define Response Types

[See api-feature-integration/references/types.md](../api-feature-integration/references/types.md)

Add to `src/types/response/<domain>-response.ts`.

**Tip**: Prototype hardcoded `const mockData = [...]` arrays are the most accurate type blueprint available — copy field names and infer types directly from the values.

```ts
// Derived from prototype's hardcoded mock array
export type ServiceOpportunityResponse = {
    id: string;
    address: string;
    estimatedValue: number;
    severityScore: number;
    status: "open" | "pending" | "closed";
};
```

**Paginated lists**: Wrap the item type in the shared generic from `@/types/response/common-response.ts` — never redeclare `totalPages`, `pageNumber`, `nextCursor`, etc. inline:

```ts
// Endpoint returns: ServerPaginatedData<ServiceOpportunityResponse>

// For cursor-based:
import {
    CursorPaginatedData,
    ServerPaginatedData,
} from "@/types/response/common-response";

// Endpoint returns: CursorPaginatedData<ServiceOpportunityResponse>
```

---

### Step 4: Add Query Constants

[See api-feature-integration/references/query-constants.md](../api-feature-integration/references/query-constants.md)

Add to `src/constants/query-constants.ts`.

> **Prototype `/api/` paths are Next.js API routes — not real backend URLs.** Map them to descriptive constants and confirm real endpoint paths with the backend team.

```ts
// prototype: fetch('/api/opportunities/service')
// → real: confirm with backend, use placeholder for now
opportunities: {
    serviceList: "opportunities/service-list",
},
```

---

### Step 5: Create Endpoint Functions

[See api-feature-integration/references/endpoint.md](../api-feature-integration/references/endpoint.md)

Add to `src/services/api/<domain>-ep.ts`. Replace prototype `fetch()` / `URLSearchParams` patterns.

For filtered/paginated endpoints, accept a params object. **Pagination params must extend `PageParams` or `CursorPaginationParams`** from `@/types/request/common-request.ts` — never inline `page`/`limit` fields:

```ts
import { PageParams } from "@/types/request/common-request";
import { ServerPaginatedData } from "@/types/response/common-response";

// ✅ Extend PageParams — adds rowsPerPage + pageNumber
export type ServiceOpportunityFilter = PageParams & {
    search?: string;
    status?: string;
};

export const getServiceOpportunities = async (
    params: ServiceOpportunityFilter
) => {
    try {
        const response = await httpService.get<
            ServerPaginatedData<ServiceOpportunityResponse>
        >(QueryConst.opportunities.serviceList, { params });
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};
```

---

## Phase 3: Mock Layer (MSW)

### Step 6: Fake Data Factory + MSW Handler

**6a. Create fake data factory** in `src/mocks/fake-store/<domain>.ts`:

Use the prototype's hardcoded mock values as guidance for realistic faker ranges.

```ts
import { fakerEN_IN } from "@faker-js/faker";

import { ServiceOpportunityResponse } from "@/types/response/opportunity-response";

const faker = fakerEN_IN;

export const createMockServiceOpportunity = (): ServiceOpportunityResponse => ({
    id: faker.string.uuid(),
    address: faker.location.streetAddress(),
    estimatedValue: faker.number.int({ min: 500, max: 15000 }),
    severityScore: faker.number.int({ min: 1, max: 10 }),
    status: faker.helpers.arrayElement(["open", "pending", "closed"]),
});
```

**6b. Add MSW handler** in `src/mocks/api/<domain>Handlers.ts`:

```ts
import config from "@/lib/config";
import { HttpStatusCode } from "axios";
import { http, HttpResponse } from "msw";

import QueryConst from "@/constants/query-constants";

import { createMockServiceOpportunity } from "../fake-store/opportunities";

const baseURL = config.env.API_BASE_URL;

export const opportunitiesHandlers = [
    http.get(`${baseURL}/${QueryConst.opportunities.serviceList}`, () => {
        return HttpResponse.json(
            Array.from({ length: 10 }, createMockServiceOpportunity),
            { status: HttpStatusCode.Ok }
        );
    }),
];
```

**6c. Register in `src/mocks/api/browser.ts`** (dev Service Worker):

```ts
export const worker = setupWorker(
    ...existingHandlers,
    ...opportunitiesHandlers // ← ADD
);
```

**6d. Register in `src/mocks/api/server.ts`** (Vitest):

```ts
export const server = setupServer(
    ...existingHandlers,
    ...opportunitiesHandlers // ← ADD
);
```

> **Both registrations are required.** Missing `browser.ts` = no mocks in dev. Missing `server.ts` = no mocks in tests.

---

## Phase 4: UI Layer

### Step 7: Create Hooks

[See api-feature-integration/references/hook.md](../api-feature-integration/references/hook.md)

Create `src/pages/<feature>/hooks/use-<component>.ts` for each component that needs one.

**Prototype → Hook pattern mapping:**

| Prototype pattern                                                                     | Hook equivalent                                                                 |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `const [data, setData] = useState([]); useEffect(() => fetchData(), [filters, page])` | `useQuery({ queryKey: [QueryConst.x.y, params], queryFn: () => getX(params) })` |
| `useState` for filter object                                                          | `useState<FilterType>({})` in hook; expose setter                               |
| `useState` for `isModalOpen`                                                          | `useState(false)` in hook; expose `handleOpen` / `handleClose`                  |
| Computed values from data                                                             | Derived: `const total = data?.reduce(...)`                                      |
| `useRouter().push(route)`                                                             | `const navigate = useNavigate()` from `react-router`                            |
| `const [loading, setLoading] = useState(true)`                                        | Replaced by `status === "pending"` from `useQuery`                              |

---

### Step 8: Create Component Files

[See api-feature-integration/references/component.md](../api-feature-integration/references/component.md)
[See nextjs-translation.md](./references/nextjs-translation.md)

One hook call at top, pure JSX below — no logic in the component.

Always handle all four async states:

```tsx
{
    status === "pending" && <Skeleton className="h-32 w-full" />;
}
{
    status === "error" && <FailedMessage type="error" text={error?.message} />;
}
{
    status === "success" && data && <div>{/* actual UI */}</div>;
}
{
    status === "success" && !data && (
        <FailedMessage type="no-data" text="No data available" />
    );
}
```

---

### Step 9: Create Page File & Wire Route

```
src/pages/<feature>/
  index.tsx               ← export default MyFeaturePage (re-export only)
  my-feature-page.tsx     ← actual FC
  components/
  hooks/
```

Page file pattern — always wrap with `PageWithHeaderFooter`. It handles `<title>`, the page header/description, footer, and an `ErrorBoundary` around the body automatically:

```tsx
import { FC } from "react";

import PageWithHeaderFooter from "@/layouts/page-with-header-footer";

const MyFeaturePage: FC = () => (
    <PageWithHeaderFooter
        title="My Feature"
        description="Optional subtitle or ReactNode">
        <div className="space-y-6">
            <KpiCards />
            <FilterBar />
            <DataTable />
        </div>
    </PageWithHeaderFooter>
);

export default MyFeaturePage;
```

If you need action buttons in the page header (top-right), use `PWHFHeaderActions` as a direct child — it renders inside the header, not the body:

```tsx
import PageWithHeaderFooter, {
    PWHFHeaderActions,
} from "@/layouts/page-with-header-footer";

const MyFeaturePage: FC = () => (
    <PageWithHeaderFooter title="My Feature">
        <PWHFHeaderActions>
            <Button>Export</Button>
        </PWHFHeaderActions>
        <div className="space-y-6">
            <KpiCards />
            <DataTable />
        </div>
    </PageWithHeaderFooter>
);
```

**Props reference:**

| Prop             | Type                             | Purpose                                                     |
| ---------------- | -------------------------------- | ----------------------------------------------------------- |
| `title`          | `string`                         | Page heading + browser `<title>` (falls back to route name) |
| `description`    | `string \| ReactNode`            | Subtitle under the heading                                  |
| `classes`        | `{ header?, body?, footer? }`    | Class overrides for each zone                               |
| `hideHeader`     | `boolean`                        | Hides the header entirely (e.g., custom hero sections)      |
| `maxWidth`       | `"full" \| "7xl" \| ... \| "lg"` | Constrains page width (default: `"full"`)                   |
| `errorResetKeys` | `unknown[]`                      | Passed to the built-in `ErrorBoundary`                      |

> **Do not add a manual `<title>` tag** — `PageWithHeaderFooter` sets it automatically using `title` prop + `config.env.APP_TITLE`.

Register route in `src/router/` using `defineAuthedRoute`:

```ts
import { defineAuthedRoute, suspendedComponent } from "@/lib/route-utils";
import { AuthedRoutes } from "@/constants/route-constants";

defineAuthedRoute({
    name: "Service Opportunities",
    path: AuthedRoutes.serviceOpportunities,
    icon: <WrenchIcon className="h-4 w-4" />,
    Component: suspendedComponent(lazy(() => import("@/pages/service-opportunities"))),
    guard: { allowedRoles: ["Contractor", "Distributor"] },
});
```

---

## Naming Conventions

| Concern           | Pattern                                     | Example                          |
| ----------------- | ------------------------------------------- | -------------------------------- |
| Response type     | `<Domain><Entity>Response`                  | `ServiceOpportunityResponse`     |
| Query constant    | `<domain>: { <entity>: "domain/endpoint" }` | `opportunities.serviceList`      |
| Endpoint function | `get<Entity>`                               | `getServiceOpportunities()`      |
| MSW handler file  | `<domain>Handlers.ts`                       | `opportunitiesHandlers.ts`       |
| Fake factory      | `createMock<Entity>`                        | `createMockServiceOpportunity()` |
| Hook              | `use<Component>`                            | `useOpportunityTable`            |
| Component         | `<component>.tsx`                           | `opportunity-table.tsx`          |

---

## Tips & Gotchas

- **Prototype hardcoded data = type blueprint**: the mock array shape tells you exactly what `<Entity>Response` should look like. Derive field names and types from it directly.
- **Prototype `/api/` = Next.js routes, not real backend**. Confirm actual endpoint paths.
- **Register MSW handlers in two places**: `browser.ts` AND `server.ts`. Missing either silently breaks that environment.
- **`@faker-js/faker`**: always `import { fakerEN_IN as faker }` in fake-store files.
- **Remove `"use client"`** directives — not applicable in Vite.
- **Parametrized queries**: include params in cache key: `queryKey: [QueryConst.x.y, params]`.
- **`success && !data` state**: `handleApiError()` silently returns `undefined` on 401/403. Always render this case.
