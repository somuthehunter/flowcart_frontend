# Endpoint Functions

Add your data-fetching function to `src/services/api/<domain>-ep.ts`.

## File Location

```
src/services/api/<domain>-ep.ts
```

Domain examples: `analytics-ep.ts`, `user-ep.ts`, `contractor-ep.ts`

## Pattern (No Parameters)

For simple GET requests with no query parameters:

```ts
import { getErrorString, handleApiError } from "@/lib/object-utils";
import httpService from "@/services/http-service";
import { HttpStatusCode } from "axios";

import { PrimaryMarketAreaResponse } from "@/types/response/contractor-dashboard-response";
import QueryConst from "@/constants/query-constants";

export const getPrimaryMarketArea = async () => {
    try {
        const response = await httpService.get<PrimaryMarketAreaResponse>(
            QueryConst.analytics.primaryMarketArea
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

## Key Parts

| Part                                    | Purpose                                                                        |
| --------------------------------------- | ------------------------------------------------------------------------------ |
| `httpService.get<ResponseType>(...)`    | Typed GET request; Axios returns `response.data` unwrapped into `ResponseType` |
| `response.status === HttpStatusCode.Ok` | Check for HTTP 200 — project convention                                        |
| `getErrorString(response)`              | Formats error messages from non-2xx responses                                  |
| `handleApiError(error)`                 | Logs to structured logging (Seq); may return `undefined` on 401/403            |
| `return response.data`                  | Unwraps and returns just the data, not the Axios response object               |

## Error Handling

- **`handleApiError`** is called in the catch block and logs the error
- On 401 (Unauthorized), the **auth interceptor** pauses the request queue, refreshes the token, and retries
- The function doesn't throw after `handleApiError` — it returns `undefined` implicitly (which the hook handles as `status: "error"`)

## Imports Required

```ts
import { getErrorString, handleApiError } from "@/lib/object-utils";
import httpService from "@/services/http-service";
import { HttpStatusCode } from "axios";

import { PrimaryMarketAreaResponse } from "@/types/response/contractor-dashboard-response";
import QueryConst from "@/constants/query-constants";
```

## Naming Convention

- `get<Entity>` for GET requests: `getPrimaryMarketArea`, `getUserProfile`
- `create<Entity>` for POST: `createContractor`
- `update<Entity>` for PUT: `updateUserProfile`
- `delete<Entity>` for DELETE: `deleteContractor`

## Pattern (With Parameters)

For queries with filters, pagination, search, etc.:

```ts
import { PageParams } from "@/types/request/common-request";
import { ServerPaginatedData } from "@/types/response/common-response";

// ✅ Extend PageParams — never redeclare rowsPerPage / pageNumber inline
export type ListContractorsParams = PageParams & {
    search?: string;
};

export const listContractors = async (params?: ListContractorsParams) => {
    try {
        const response = await httpService.get<
            ServerPaginatedData<ContractorResponse>
        >(
            QueryConst.contractors.list,
            { params } // ← Pass params here
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

Then in your hook's `queryKey`, include the params:

```ts
useQuery({
    queryKey: [QueryConst.contractors.list, params], // ← Include params in cache key
    queryFn: () => listContractors(params),
});
```

This ensures TanStack Query caches different param combinations separately.

## Next Steps

- [Create MSW handler](./mock-handler.md)
- [Create hook](./hook.md)
