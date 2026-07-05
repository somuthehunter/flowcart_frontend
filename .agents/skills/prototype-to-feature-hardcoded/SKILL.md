---
name: prototype-to-feature-hardcoded
description: "Convert a prototype (Next.js) page into the project's React/Vite architecture using hardcoded early-return mocks in endpoint files instead of MSW. Use when: porting .prototype/components/ pages to src/, rapid dev without MSW wiring, decomposing a monolith into angular-style two-file pairs (.tsx UI + .ts hook), mock data returned directly from ep.ts via 'return mockXxx' before the real httpService.get call."
argument-hint: 'Prototype file path (e.g., ".prototype/components/service-opportunities.tsx")'
user-invocable: true
---

# Prototype to Feature (Hardcoded Mock)

## When to Use

You have a file in `.prototype/components/` or `.prototype/app/` to port into `src/`, and you want **fast iteration without wiring MSW**:

- You need working UI quickly without setting up Service Worker + handler files
- Test coverage is not required yet
- Single developer working on the feature
- Prototype uses `fetch()` in `useEffect`, hardcoded data arrays, or `"use client"` patterns

**Use `prototype-to-feature-msw` instead** when you need dev/test mocks via Service Worker, or when the feature will have Vitest tests.

---

## Key Difference vs MSW Skill

**Phase 3 is different.** Instead of creating MSW handler files and registering them in `browser.ts`/`server.ts`, you:

1. Create the fake data factory in `src/mocks/fake-store/<domain>.ts` (same as MSW)
2. Import it in the endpoint function
3. Add `return mockData;` as the **first statement inside the `try` block**, before `httpService.get`

The real API call code stays in place, unreachable, as a ready-to-activate placeholder.

[See hardcoded-endpoint.md](./references/hardcoded-endpoint.md)

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

**Data flow**: Component → Hook → TanStack Query → Endpoint → returns hardcoded mock directly

**Files involved** (8 steps across 4 phases):

| Phase      | Step                               | File                                                       |
| ---------- | ---------------------------------- | ---------------------------------------------------------- |
| Analyze    | 1. Analyze prototype               | — (read-only)                                              |
| Analyze    | 2. Plan decomposition              | — (design only)                                            |
| Data layer | 3. Response types                  | `src/types/response/<domain>-response.ts`                  |
| Data layer | 4. Query constants                 | `src/constants/query-constants.ts`                         |
| Data layer | 5. Endpoint functions              | `src/services/api/<domain>-ep.ts`                          |
| Mock layer | 6. Fake factory + hardcoded return | `src/mocks/fake-store/<domain>.ts` + edit `<domain>-ep.ts` |
| UI layer   | 7. Hooks                           | `src/pages/<feature>/hooks/use-<component>.ts`             |
| UI layer   | 8. Components + page               | `src/pages/<feature>/`                                     |

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

Map each section to a component + hook decision.

**A component needs its own hook if it has ANY of**: data fetching, local state, event handlers, derived computed values.

---

## Phase 2: Data Layer

### Step 3: Define Response Types

[See api-feature-integration/references/types.md](../api-feature-integration/references/types.md)

Add to `src/types/response/<domain>-response.ts`.

**Tip**: Prototype hardcoded `const mockData = [...]` arrays are the most accurate type blueprint — copy field names and infer types from the values.

```ts
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

> **Prototype `/api/` paths are Next.js API routes — not real backend URLs.** Confirm actual paths with the backend team.

```ts
opportunities: {
    serviceList: "opportunities/service-list",
},
```

---

### Step 5: Create Endpoint Functions

[See api-feature-integration/references/endpoint.md](../api-feature-integration/references/endpoint.md)

Add to `src/services/api/<domain>-ep.ts`. Write the full real implementation — the hardcoded mock return will be added in Step 6.

**Pagination params must extend `PageParams` or `CursorPaginationParams`** from `@/types/request/common-request.ts` — never inline `page`/`limit` fields:

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

## Phase 3: Mock Layer (Hardcoded)

### Step 6: Fake Data Factory + Hardcoded Return

[See hardcoded-endpoint.md](./references/hardcoded-endpoint.md)

**6a. Create fake data factory** in `src/mocks/fake-store/<domain>.ts`:

```ts
import { fakerEN_IN as faker } from "@faker-js/faker";

import { ServiceOpportunityResponse } from "@/types/response/opportunity-response";

export const createMockServiceOpportunity = (): ServiceOpportunityResponse => ({
    id: faker.string.uuid(),
    address: faker.location.streetAddress(),
    estimatedValue: faker.number.int({ min: 500, max: 15000 }),
    severityScore: faker.number.int({ min: 1, max: 10 }),
    status: faker.helpers.arrayElement(["open", "pending", "closed"]),
});

export const mockServiceOpportunities = Array.from(
    { length: 10 },
    createMockServiceOpportunity
);
```

**6b. Add hardcoded return in the endpoint function:**

```ts
import { mockServiceOpportunities } from "@/mocks/fake-store/opportunities";

export const getServiceOpportunities = async (
    params: ServiceOpportunityFilter
) => {
    try {
        return mockServiceOpportunities; // ← hardcoded mock; remove when API is ready
        const response = await httpService.get<ServiceOpportunityResponse[]>(
            QueryConst.opportunities.serviceList,
            { params }
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};
```

**No MSW handler files. No `browser.ts`/`server.ts` registration needed.**

> **To activate the real API later**: delete the `return mockServiceOpportunities;` line and remove the import. The endpoint code below it is already production-ready.

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

### Step 8: Create Components, Page File & Route

[See api-feature-integration/references/component.md](../api-feature-integration/references/component.md)
[See nextjs-translation.md](./references/nextjs-translation.md)

One hook call at top, pure JSX below. Always handle all four async states:

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

If you need action buttons in the page header (top-right), use `PWHFHeaderActions` as a direct child:

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
| `hideHeader`     | `boolean`                        | Hides the header entirely                                   |
| `maxWidth`       | `"full" \| "7xl" \| ... \| "lg"` | Constrains page width (default: `"full"`)                   |
| `errorResetKeys` | `unknown[]`                      | Passed to the built-in `ErrorBoundary`                      |

> **Do not add a manual `<title>` tag** — `PageWithHeaderFooter` sets it automatically.

Register route in `src/router/` using `defineAuthedRoute`:

```ts
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
| Fake factory      | `createMock<Entity>`                        | `createMockServiceOpportunity()` |
| Fake data export  | `mock<Entities>`                            | `mockServiceOpportunities`       |
| Hook              | `use<Component>`                            | `useOpportunityTable`            |
| Component         | `<component>.tsx`                           | `opportunity-table.tsx`          |

---

## Tips & Gotchas

- **Hardcoded mock always from fake-store**: never define the mock object inline in `ep.ts` — it belongs in `src/mocks/fake-store/<domain>.ts` so it's easy to find and update.
- **`return mock;` goes inside `try`, before `httpService.get`**: this ensures the function signature and error handling are identical to the real implementation.
- **The real code below the early-return is not dead code** — it's the production implementation waiting to be activated. Keep it accurate.
- **Prototype hardcoded data = type blueprint**: derive field names and types from the mock array directly.
- **Prototype `/api/` = Next.js routes, not real backend**. Confirm actual endpoint paths.
- **Remove `"use client"`** directives — not applicable in Vite.
- **Parametrized queries**: include params in cache key: `queryKey: [QueryConst.x.y, params]`.
- **`success && !data` state**: `handleApiError()` silently returns `undefined` on 401/403. Always render this case.
