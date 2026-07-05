# Query Constants

Add a URL/cache-key constant to `src/constants/query-constants.ts` under the appropriate domain.

## File Location

```
src/constants/query-constants.ts
```

## Pattern

The URL string **doubles as the TanStack Query cache key**, so it must be globally unique within the app.

```ts
const QueryConst = {
    analytics: {
        primaryMarketArea: "analytics/primary-market-area",
        propertyTrends: "analytics/property-trends",
        // ...
    },
    users: {
        profile: "users/profile",
        roles: "users/roles",
        // ...
    },
} as const;
```

## Rules

- **Domain-keyed object** — group related endpoints under a domain (e.g., `analytics`, `users`, `contractors`)
- **Kebab-case URLs** — e.g., `"analytics/primary-market-area"`, not `primaryMarketArea` or `PrimaryMarketArea`
- **Matches backend path** — the string is used directly in `httpService.get(QueryConst.domain.endpoint)`
- **`as const`** — enables TypeScript literal type inference for the entire object
- **Re-export default** — `export default QueryConst;` at the bottom of the file

## Example: Adding a New Endpoint

If you're adding a feature for "contractor metrics", add it to the existing domain or create a new one:

```ts
const QueryConst = {
    analytics: {
        primaryMarketArea: "analytics/primary-market-area",
        contractorMetrics: "analytics/contractor-metrics", // ← NEW
    },
} as const;
```

## Export

At the bottom of `query-constants.ts`:

```ts
export default QueryConst;
```

Then import in your endpoint and hook:

```ts
import QueryConst from "@/constants/query-constants";

// In endpoint function
const response = await httpService.get(QueryConst.analytics.contractorMetrics);

// In hook
useQuery({
    queryKey: [QueryConst.analytics.contractorMetrics],
    queryFn: getContractorMetrics,
});
```

## URL Alignment for MSW

In your MSW handler, construct the full URL by prepending the API base:

```ts
const baseURL = config.env.API_BASE_URL; // e.g., "http://api.local" or "/api"
http.get(`${baseURL}/${QueryConst.analytics.contractorMetrics}`, () => {
    // handler
});
```

The constant is used in both places — endpoint + MSW — ensuring perfect alignment.

## Next Steps

- [Create endpoint function](./endpoint.md)
- [Create MSW handler](./mock-handler.md)
