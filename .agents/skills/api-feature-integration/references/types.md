# Response Types

Define your API response shape in `src/types/response/` as a TypeScript interface or type.

## File Location

```
src/types/response/<domain>-response.ts
```

Domain examples: `contractor-dashboard-response.ts`, `user-response.ts`, `analytics-response.ts`

## Pattern

```ts
export type PrimaryMarketAreaResponse = {
    totalHouseholds: number;
    totalAnnualGoal: number;
};
```

## Rules

- **Export as `type`** (not `interface`) — aligns with project convention
- **Named `<Entity>Response`** — e.g., `PrimaryMarketAreaResponse`, `UserProfileResponse`
- **Grouped by domain** — all analytics responses in `analytics-response.ts`, etc.
- **Typed explicitly** — no `any`, all fields have concrete types
- **Optional fields marked with `?`** — only if the API can omit them
- **Paginated responses** — always use the shared wrappers from `@/types/response/common-response.ts`; never redeclare pagination fields inline

## Paginated Response Types

When the API returns a paginated list, wrap the item type in the appropriate common generic — never define `totalPages`, `pageNumber`, `nextCursor`, etc. manually.

**Offset / server-paginated** (uses `rowsPerPage` / `pageNumber`):

```ts
import { ServerPaginatedData } from "@/types/response/common-response";

export type MyItemResponse = {
    id: string;
    name: string;
};

// The endpoint returns ServerPaginatedData<MyItemResponse> directly — no extra wrapper needed.
```

Endpoint type parameter: `httpService.get<ServerPaginatedData<MyItemResponse>>(...)`

**Cursor-paginated** (uses `nextCursor` / `previousCursor`):

```ts
import { CursorPaginatedData } from "@/types/response/common-response";

export type MyItemResponse = {
    id: string;
    name: string;
};

// Endpoint type parameter: httpService.get<CursorPaginatedData<MyItemResponse>>(...)
```

## Example with Optional Fields

```ts
export type UserProfileResponse = {
    id: string;
    name: string;
    email: string;
    avatar?: string; // Optional field
    metadata?: Record<string, unknown>;
};
```

## Using the Type

In endpoint functions, import and use as a type parameter:

```ts
import { PrimaryMarketAreaResponse } from "@/types/response/contractor-dashboard-response";

const response = await httpService.get<PrimaryMarketAreaResponse>(
    QueryConst.analytics.primaryMarketArea
);
```

In hooks and components:

```ts
import { PrimaryMarketAreaResponse } from "@/types/response/contractor-dashboard-response";

// Optional: extend for local use
type Props = {
    data: PrimaryMarketAreaResponse;
};
```

## Next Steps

- [Add query constant](./query-constants.md)
- [Create endpoint function](./endpoint.md)
