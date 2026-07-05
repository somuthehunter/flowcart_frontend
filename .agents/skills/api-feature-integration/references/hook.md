# Component Hooks

Create a hook in `src/pages/<feature>/hooks/use-<feature>.ts`. This is the **single source of truth** for everything the component needs — server state, local state, handlers, derived values, mutations, side effects. The component file is a pure render function; this hook owns all the logic.

## File Location

```
src/pages/<feature>/hooks/use-<feature>.ts
```

Examples: `src/pages/dashboard/contractor-dashboard/hooks/use-primary-market-area.ts`

## Core Rule

> If it's not a JSX `return`, it belongs in the hook.

This includes:

- **Server state** — TanStack Query `useQuery` / `useMutation`
- **Local UI state** — `useState` (dialogs, toggles, selections, pagination)
- **Derived values** — computed from data (formatted strings, totals, filtered lists)
- **Event handlers** — `handleClick`, `handleSubmit`, `handleSelect`, etc.
- **Form state** — `useForm`, field values, validation, submit handler
- **Side effects** — `useEffect` that syncs or reacts to state changes
- **Mutations** — POST/PUT/DELETE + cache invalidation
- **URL/search params** — `nuqs` hooks
- **Auth checks** — `useGuard`, `useAuthStore` reads

## Minimal Pattern (Read-only, No Params)

For simple GET with no local state:

```ts
import { getPrimaryMarketArea } from "@/services/api/analytics-ep";
import { useQuery } from "@tanstack/react-query";

import QueryConst from "@/constants/query-constants";

const usePrimaryMarketArea = () => {
    const { data, status, error } = useQuery({
        queryKey: [QueryConst.analytics.primaryMarketArea],
        queryFn: getPrimaryMarketArea,
    });
    return { data, status, error };
};

export default usePrimaryMarketArea;
```

## Full Pattern (Local State + Handlers + Mutation)

```ts
import { useState } from "react";
import {
    getContractorDetail,
    updateContractor,
} from "@/services/api/contractor-ep";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { UpdateContractorParams } from "@/types/response/contractor-response";
import QueryConst from "@/constants/query-constants";

const useContractorDetail = (id: string) => {
    const queryClient = useQueryClient();

    // Server state
    const { data, status, error } = useQuery({
        queryKey: [QueryConst.contractors.detail, id],
        queryFn: () => getContractorDetail(id),
        enabled: !!id,
    });

    // Local UI state
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState<"info" | "history">("info");

    // Derived values
    const fullName = data ? `${data.firstName} ${data.lastName}` : "";
    const isVerified = data?.status === "verified";

    // Handlers
    const handleOpenEdit = () => setIsEditOpen(true);
    const handleCloseEdit = () => setIsEditOpen(false);
    const handleTabChange = (tab: "info" | "history") => setSelectedTab(tab);

    // Mutation
    const { mutate: update, isPending: isUpdating } = useMutation({
        mutationFn: (params: UpdateContractorParams) =>
            updateContractor(id, params),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QueryConst.contractors.detail, id],
            });
            toast.success("Contractor updated");
            handleCloseEdit();
        },
        onError: (err) => {
            toast.error(err.message ?? "Update failed");
        },
    });

    return {
        // server state
        data,
        status,
        error,
        // local state
        isEditOpen,
        selectedTab,
        // derived
        fullName,
        isVerified,
        // handlers
        handleOpenEdit,
        handleCloseEdit,
        handleTabChange,
        // mutation
        update,
        isUpdating,
    };
};

export default useContractorDetail;
```

## TanStack Query Key Parts

| Part                                             | Purpose                                                                         |
| ------------------------------------------------ | ------------------------------------------------------------------------------- |
| `queryKey: [QueryConst.domain.endpoint]`         | Cache key for no-param queries                                                  |
| `queryKey: [QueryConst.domain.endpoint, params]` | Cache key for parametrized queries (different params = different cache entries) |
| `queryFn: getFn`                                 | No-param: pass reference directly                                               |
| `queryFn: () => getFn(params)`                   | With params: wrap in arrow function                                             |

## Parametrized Queries

```ts
const useListContractors = (params?: ListContractorsParams) => {
    const { data, status, error } = useQuery({
        queryKey: [QueryConst.contractors.list, params], // ← params in cache key
        queryFn: () => listContractors(params),
    });
    return { data, status, error };
};
```

## Conditional Fetching

```ts
const useContractorDetail = (id?: string) => {
    const { data, status, error } = useQuery({
        queryKey: [QueryConst.contractors.detail, id],
        queryFn: () => getContractorDetail(id),
        enabled: !!id, // Don't fetch until id is available
    });
    return { data, status, error };
};
```

## Form State

When the component has a form, the hook owns the form:

```ts
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    name: z.string().min(1, "Required"),
    email: z.string().email(),
});
type FormValues = z.infer<typeof schema>;

const useMyForm = () => {
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { name: "", email: "" },
    });

    const { mutate: submit, isPending } = useMutation({
        mutationFn: createEntity,
        onSuccess: () => form.reset(),
    });

    const handleSubmit = form.handleSubmit((values) => submit(values));

    return { form, handleSubmit, isPending };
};
```

The component just spreads `form` into `<Form>` and calls `handleSubmit` — zero logic in JSX.

## What Belongs in the Hook vs Component

| Concern                                        | Hook | Component |
| ---------------------------------------------- | ---- | --------- |
| `useQuery` / `useMutation`                     | ✅   | ❌        |
| `useState`                                     | ✅   | ❌        |
| `useEffect`                                    | ✅   | ❌        |
| `useForm`                                      | ✅   | ❌        |
| Event handlers (`onClick`, `onSubmit`)         | ✅   | ❌        |
| Derived values (formatted, filtered)           | ✅   | ❌        |
| `useGuard`, `useAuthStore`                     | ✅   | ❌        |
| Conditional rendering (`status === "pending"`) | ❌   | ✅        |
| JSX / markup                                   | ❌   | ✅        |
| Tailwind classes                               | ❌   | ✅        |

## Naming Convention

- `use<Entity>` for singular: `usePrimaryMarketArea`, `useUserProfile`
- `use<Entity>List` for list views: `useContractorList`, `useUserList`
- Name matches the component it drives: `PrimaryMarketAreaCard` → `usePrimaryMarketAreaCard` (or `usePrimaryMarketArea` for simple cases)

## Cache Time

Project uses TanStack Query defaults (staleTime: 0, gcTime: 5 min). Override explicitly when needed:

```ts
useQuery({
    queryKey: [...],
    queryFn: ...,
    staleTime: 5 * 60 * 1000,
});
```

## Next Steps

- [Create component](./component.md)
