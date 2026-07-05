# Hardcoded Mock Endpoint Pattern

This is the alternative to MSW for returning mock data from endpoint functions during development. The real API call is written but bypassed via an early `return` statement inside the `try` block.

---

## The Pattern

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

---

## Rules

### 1. Early return goes inside `try`, as the very first statement

```ts
// ✅ Correct — inside try, first line
try {
    return mockServiceOpportunities;
    const response = await httpService.get(...)
}

// ❌ Wrong — before try (skips error handling wrapper)
return mockServiceOpportunities;
try {
    const response = await httpService.get(...)
}
```

Placing it inside `try` ensures the function signature is identical to the real implementation — same return type, same error handling wrapper.

### 2. Mock data is always imported from `src/mocks/fake-store/`

```ts
// ✅ Correct — imported from fake-store
import { mockServiceOpportunities } from "@/mocks/fake-store/opportunities";

// ❌ Wrong — inline definition in ep.ts
const mockData = [{ id: "1", ... }];
return mockData;
```

Fake-store is the single source of truth for all mock data. It's easier to update, reuse across tests, and find during cleanup.

### 3. The real code below the early return stays accurate

The lines after `return mockXxx;` are unreachable during development but **must be kept valid and correct** — they represent the production implementation. Don't delete them, don't stub them.

When the real API is ready, removing the `return mock;` line and its import is the only change needed.

---

## Fake Data Factory Pattern

Create in `src/mocks/fake-store/<domain>.ts`:

```ts
import { fakerEN_IN as faker } from "@faker-js/faker";

import { ServiceOpportunityResponse } from "@/types/response/opportunity-response";

// Factory function — generates a single random item
export const createMockServiceOpportunity = (): ServiceOpportunityResponse => ({
    id: faker.string.uuid(),
    address: faker.location.streetAddress(),
    estimatedValue: faker.number.int({ min: 500, max: 15000 }),
    severityScore: faker.number.int({ min: 1, max: 10 }),
    status: faker.helpers.arrayElement(["open", "pending", "closed"]),
});

// Pre-built array — used directly in the endpoint early return
export const mockServiceOpportunities = Array.from(
    { length: 10 },
    createMockServiceOpportunity
);
```

**Why export both?**

- `createMockServiceOpportunity` — used when you need a single item (e.g., detail endpoint, test overrides)
- `mockServiceOpportunities` — used directly in the endpoint early return (stable reference, no re-generation on every call)

---

## Parametrized vs Non-Parametrized

For endpoints that accept filters/pagination, the mock data is always the full dataset — params are ignored during hardcoded phase:

```ts
export const getServiceOpportunities = async (params: ServiceOpportunityFilter) => {
    try {
        return mockServiceOpportunities; // params ignored — mock returns full list
        const response = await httpService.get<ServiceOpportunityResponse[]>(
            QueryConst.opportunities.serviceList,
            { params } // ← params will be used once mock is removed
        );
        // ...
    }
};
```

This is intentional — the point is to unblock UI development, not simulate filtering.

---

## Mutation Endpoints (POST/PUT/DELETE)

For mutations, return a mock success response:

```ts
import { mockSubmittedLead } from "@/mocks/fake-store/leads";

export const submitLeadRequest = async (body: LeadRequestBody) => {
    try {
        return mockSubmittedLead; // ← hardcoded mock
        const response = await httpService.post<LeadRequestResponse>(
            QueryConst.leads.submit,
            body
        );
        if (response.status === HttpStatusCode.Created) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error);
    }
};
```

---

## Activating the Real API

When the backend endpoint is ready:

1. Delete the `return mockXxx;` line
2. Delete the import: `import { mockXxx } from "@/mocks/fake-store/..."`
3. No other changes needed — the real implementation is already written and correct

If you want to transition to MSW instead (for test coverage), follow the `prototype-to-feature-msw` skill's Phase 3 and use the existing factory functions from `fake-store/` — they're already compatible.
