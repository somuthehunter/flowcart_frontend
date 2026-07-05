---
name: api-feature-integration
description: "Implement API-backed UI features end-to-end: response types, query constants, endpoint functions, MSW mocks, TanStack Query hooks, and two-file components. Use when: adding new data-fetching features, integrating backend endpoints with React components, setting up mocks for dev/test, building reusable data hooks. Follows the angular-like two-file pattern: *.tsx for UI, use-*.ts for all state/handlers."
argument-hint: 'Feature name (e.g., "primary-market-area")'
user-invocable: true
---

# API Feature Integration

## When to Use

You're adding a new data-fetching feature that pulls from a backend API:

- Need to fetch data and display it in a React component
- Want to add the feature to dev/test with MSW mocks
- Creating a reusable hook for the feature
- Following the project's two-file component pattern (UI + state)
- Setting up proper TypeScript types, query keys, and error handling

**Scope**: No-parameter GET requests. For parametrized queries (filters, pagination), see the optional sections at the end.

---

## Architecture Overview

This project follows an **angular-like two-file pattern** per component:

```
src/pages/<feature>/
  components/
    my-feature-card.tsx        ← UI only (render, no logic)
  hooks/
    use-my-feature-card.ts     ← All state + handlers (data, loading, error, refetch, etc.)
```

**Data flow**: Component → Hook → TanStack Query → Endpoint Function → Axios → API (or MSW mock)

**Files involved** (7 steps):

1. **Response type** — `src/types/response/<domain>-response.ts`
2. **Query constant** — `src/constants/query-constants.ts`
3. **Endpoint function** — `src/services/api/<domain>-ep.ts`
4. **MSW handler** — `src/mocks/api/<domain>Handlers.ts`
5. **Fake data factory** — `src/mocks/fake-store/<domain>.ts`
6. **Hook** — `src/pages/<feature>/hooks/use-<feature>.ts`
7. **Component** — `src/pages/<feature>/components/<feature>.tsx`

---

## Step-by-Step Implementation

### Step 1: Define Response Type

[See types.md](./references/types.md)

**Summary**: Add your response interface to `src/types/response/<domain>-response.ts`.

```ts
export type MyFeatureResponse = {
    id: string;
    name: string;
    value: number;
};
```

---

### Step 2: Add Query Constant

[See query-constants.md](./references/query-constants.md)

**Summary**: Add the URL/key constant to `src/constants/query-constants.ts` under the appropriate domain.

```ts
const QueryConst = {
    myDomain: {
        myEndpoint: "my-domain/my-endpoint",
    },
} as const;
```

The URL string **doubles as the TanStack Query cache key**.

---

### Step 3: Create Endpoint Function

[See endpoint.md](./references/endpoint.md)

**Summary**: Add function to `src/services/api/<domain>-ep.ts` that calls `httpService.get<ResponseType>()`.

```ts
export const getMyFeature = async () => {
    try {
        const response = await httpService.get<MyFeatureResponse>(
            QueryConst.myDomain.myEndpoint
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

---

### Step 4: Create MSW Handler

[See mock-handler.md](./references/mock-handler.md)

**Summary**: Add HTTP handler to `src/mocks/api/<domain>Handlers.ts`.

```ts
http.get(`${baseURL}/${QueryConst.myDomain.myEndpoint}`, () => {
    return HttpResponse.json(createMockMyFeature(), {
        status: HttpStatusCode.Ok,
    });
}),
```

Then create a factory in `src/mocks/fake-store/<domain>.ts` using `@faker-js/faker`:

```ts
export const createMockMyFeature = (): MyFeatureResponse => ({
    id: faker.string.uuid(),
    name: faker.company.name(),
    value: faker.number.int({ min: 0, max: 1000 }),
});
```

---

### Step 5: Create the Hook

[See hook.md](./references/hook.md)

**Summary**: Create `src/pages/<feature>/hooks/use-<feature>.ts`. This is the **single source of truth** for everything the component needs — server state, local state, form state, event handlers, derived values, mutations, side effects. The component file should be a pure render function that only calls this hook.

```ts
import { useState } from "react";
import { getMyFeature, updateMyFeature } from "@/services/api/my-domain-ep";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import QueryConst from "@/constants/query-constants";

export const useMyFeature = () => {
    const queryClient = useQueryClient();

    // Server state
    const { data, status, error } = useQuery({
        queryKey: [QueryConst.myDomain.myEndpoint],
        queryFn: getMyFeature,
    });

    // Local UI state
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Derived values
    const displayName = data?.name?.toUpperCase() ?? "—";

    // Handlers
    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);

    // Mutations
    const { mutate: save, isPending: isSaving } = useMutation({
        mutationFn: updateMyFeature,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QueryConst.myDomain.myEndpoint],
            });
            handleCloseDialog();
        },
    });

    return {
        data,
        status,
        error,
        isDialogOpen,
        displayName,
        isSaving,
        handleOpenDialog,
        handleCloseDialog,
        save,
    };
};
```

**Rule**: The component calls the hook and only renders. Every piece of logic — local state, handlers, derived values, mutations — belongs in the hook.

---

### Step 6: Create the Component (UI)

[See component.md](./references/component.md)

**Summary**: Create `src/pages/<feature>/components/<feature>.tsx`. One hook call, pure JSX — no logic in the component. Works for any shape: card, table, form, dialog, list, page section, etc.

```tsx
const MyFeature: FC = () => {
    // Everything comes from the hook — state, handlers, derived values
    const { data, status, error, handleEdit, isEditing } = useMyFeature();

    return (
        <div>
            {status === "pending" && <Skeleton className="h-8 w-full" />}
            {status === "error" && (
                <FailedMessage type="error" text={error?.message} />
            )}
            {status === "success" && data && (
                <div>
                    <span>{data.name}</span>
                    <Button onClick={handleEdit} disabled={isEditing}>
                        Edit
                    </Button>
                </div>
            )}
            {status === "success" && !data && (
                <FailedMessage type="no-data" text="No data available" />
            )}
        </div>
    );
};
```

**Four states**: `pending` (skeleton), `error` (FailedMessage), `success + data` (actual UI), `success + !data` (empty state).

---

### Step 7: Wire Up the Component

Create the page directory structure:

```
src/pages/my-feature/
  components/
    my-feature-card.tsx        ← export default MyFeatureCard
  hooks/
    use-my-feature.ts
  index.tsx                      ← re-export from my-feature-card
```

Then use the component in your page layout.

---

## Naming Conventions

| Concern                | Pattern                                     | Example                                     |
| ---------------------- | ------------------------------------------- | ------------------------------------------- |
| **Response type**      | `<Domain><Entity>Response`                  | `PrimaryMarketAreaResponse`                 |
| **Query constant key** | `<domain>: { <entity>: "domain/endpoint" }` | `analytics.primaryMarketArea`               |
| **Endpoint function**  | `get<Entity>`                               | `getPrimaryMarketArea()`                    |
| **MSW handler file**   | `<domain>Handlers.ts`                       | `analyticsHandlers.ts`                      |
| **Fake factory**       | `createMock<Entity>`                        | `createMockPrimaryMarketArea()`             |
| **Hook**               | `use<Entity>`                               | `usePrimaryMarketArea()`                    |
| **Component file**     | `<entity>.tsx`                              | `primary-market-area-card.tsx`              |
| **Component dir**      | `src/pages/<feature>/`                      | `src/pages/dashboard/contractor-dashboard/` |

---

## Tips & Gotchas

- **Query key alignment**: The URL in `QueryConst` is reused as the TanStack Query cache key — they must match exactly.
- **Error handling**: `handleApiError()` can return `undefined` (swallows on 401/403). Always handle `success && !data` state.
- **Register handlers in TWO places**: After creating your handler file, import and spread it in both `src/mocks/api/browser.ts` (dev Service Worker) and `src/mocks/api/server.ts` (Vitest/MSW node server). Missing either means mocks won't work in dev or tests respectively.
- **Mock mode**: When `VITE_API_BASE_URL` starts with `/` (e.g., `/api`), MSW auto-starts in dev via `browser.ts` — no real backend needed.
- **`@faker-js/faker`**: Imported as `fakerEN_IN` in mocks, provides realistic India-localized fake data.
- **Hook owns all logic**: State, handlers, derived values, mutations — everything except JSX belongs in the hook, not the component.

---

## Parametrized Queries (Filters, Pagination)

For queries that take `params` (filters, pagination, search), the pattern extends:

1. Accept `params` in the endpoint function
2. Pass to `httpService.get(..., { params })`
3. Use `queryKey: [QueryConst.domain.endpoint, params]` (include params in the cache key)
4. Accept `enabled` guard in `useQuery` for conditional fetching
5. Component handles refetch via hook exports

See reference implementations in `src/services/api/` for examples.

---

## Reference Implementation

Full working example: [primary-market-area](../../../../../../src/pages/dashboard/contractor-dashboard/components/primary-market-area-card.tsx)

- Hook: `use-primary-market-area.ts`
- Endpoint: `src/services/api/analytics-ep.ts` → `getPrimaryMarketArea`
- Types: `src/types/response/contractor-dashboard-response.ts`
- MSW handler: `src/mocks/api/analyticsHandlers.ts`
- Fake data: `src/mocks/fake-store/contractor-analytics.ts`
