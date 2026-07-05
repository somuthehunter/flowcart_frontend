---
name: table-with-filter-migration
description: "Migrate a hardcoded HTML table that has filter controls to the DataTable pattern using getColumns builder, a dedicated filter hook, lib/types.ts, useDataTable, and DataTable component. Use when: replacing a manual table that has filter controls alongside it, splitting filter state into a separate hook, wiring nuqs URL state for page-level filter tables, need a shared FilterProps type between filter component and data hook."
argument-hint: 'Page directory path (e.g., "src/pages/service-opportunities")'
user-invocable: true
---

# Table + Filter → DataTable Migration

## When to Use

- A page has both a data table **and** filter controls
- Filter state is inline in the page or data hook and needs extraction
- Filters on a standalone page use `useState` (should be `useQueryState` via nuqs)
- You need a shared `*FilterProps` type between the filter component and data hook

**Use `table-to-data-table` instead** when the table has no filter UI — pagination only.

**Not for** tables inside dialogs/sheets — those keep `useState` for filter state.

---

## Output File Map

| File                                      | Purpose                                                    |
| ----------------------------------------- | ---------------------------------------------------------- |
| `<page>/lib/get-columns.tsx`              | Column builder returning `ColumnDef<T>[]`                  |
| `<page>/lib/types.ts`                     | `*FilterProps` type inferred from filter hook              |
| `<page>/hooks/use-<feature>-filter.ts`    | All filter + pagination state and handlers                 |
| `<page>/hooks/use-<feature>.ts`           | Data fetching + `useDataTable`, accepts filter hook output |
| `<page>/components/<feature>-filters.tsx` | Filter UI — props destructured from `*FilterProps`         |

---

## Phase 1 — Audit

1. Read the existing table and filter components and identify:
    - Row data type (`T`)
    - All filter fields (name, type, current state owner)
    - Pagination state (page, perPage) and where it lives
    - Whether the table is on a standalone page or inside a dialog/sheet
2. Note which column has an actions dropdown (`id: "actions"`, `enableSorting: false`, pinned right).

---

## Phase 2 — Create `lib/get-columns.tsx`

**Location:** `src/pages/<feature>/lib/get-columns.tsx`

Rules:

- Return type is always `ColumnDef<T>[]`
- Accept a typed params object — never use closures over external state
- Actions column: `id: "actions"`, header right-aligned, `enableSorting: false`
- Conditional columns use spread: `...(shouldShowX ? [{ ... }] : [])`
- Use `DataTableCellContent` from `@/components/data-table` for overflow/truncation cells
- Use `CellContext<T, unknown>` for cells inside conditional spreads

```tsx
// src/pages/<feature>/lib/get-columns.tsx
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";

import { MyRowType } from "@/types/response/my-response";
import { DataTableCellContent } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ActionType = "view" | "edit" | "delete";

type GetColumnsParams = {
    shouldShowExtraCol: boolean;
    onAction: (type: ActionType, row: MyRowType) => void;
};

export const getColumns = ({
    shouldShowExtraCol,
    onAction,
}: GetColumnsParams): ColumnDef<MyRowType>[] => [
    {
        accessorKey: "fieldName",
        header: "Column Label",
        cell: ({ row }) => (
            <DataTableCellContent>
                {row.original.fieldName ?? "—"}
            </DataTableCellContent>
        ),
    },
    ...(shouldShowExtraCol
        ? [
              {
                  accessorKey: "conditionalField",
                  header: "Extra",
                  cell: ({ row }: CellContext<MyRowType, unknown>) =>
                      row.original.conditionalField ?? "—",
              },
          ]
        : []),
    {
        id: "actions",
        header: () => <div className="flex justify-end">Action</div>,
        cell: ({ row }) => (
            <div className="flex justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="text-primary h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => onAction("view", row.original)}>
                            View
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
        enableSorting: false,
    },
];
```

---

## Phase 3 — Create `lib/types.ts`

```ts
// src/pages/<feature>/lib/types.ts
import use<Feature>Filter from "../hooks/use-<feature>-filter";

export type <Feature>FilterProps = ReturnType<typeof use<Feature>Filter>;
```

> Only type exports — no runtime code.

---

## Phase 4 — Create the Filter Hook

**Page-level** (standalone page) → `useQueryStates` from nuqs with typed parsers.
**Dialog/sheet** → `useState`.

### Page-level skeleton

Declare a `filterParsers` object **outside** the hook so it can be reused for server-side loaders or serializers. Each key maps to a nuqs parser with a `.withDefault()` — this gives you typed values directly (no manual `Number(page)` coercions) and allows a single atomic setter.

```ts
// src/pages/<feature>/hooks/use-<feature>-filter.ts
import { useCallback } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { DEFAULT_PAGE_SIZE } from "@/constants/default-constants";

const filterParsers = {
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
    // one entry per filter field — string fields use null for "not set":
    field1: parseAsString,
    field2: parseAsString,
};

const use<Feature>Filter = () => {
    const [{ page, perPage, field1, field2 }, setFilters] =
        useQueryStates(filterParsers);

    // page & perPage are already typed numbers — no manual conversion needed

    const handlePageChange = (page: number, perPage: number) => {
        setFilters({ page, perPage }); // atomic: single URL history entry
    };

    const handleFilterChange = useCallback(
        (name: "field1" | "field2", value: string | null) => {
            // atomic: reset page + update filter in one URL push
            setFilters({ page: 1, [name]: value });
        },
        [setFilters]
    );

    const resetFilters = () => {
        setFilters(null); // clears all keys managed by this hook
    };

    return {
        pageNumber: page,
        rowsPerPage: perPage,
        handlePageChange,
        handleFilterChange,
        resetFilters,
        field1,
        field2,
    };
};

export default use<Feature>Filter;
```

### Dialog/sheet variant — swap nuqs for useState

```ts
const [page, setPage] = useState(1);
const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);
const [field1, setField1] = useState<string | null>(null);

const handlePageChange = (page: number, perPage: number) => {
    setPage(page);
    setPerPage(perPage);
};

const handleFilterChange = useCallback(
    (name: "field1", value: string | null) => {
        setPage(1); // always reset page
        if (name === "field1") setField1(value);
    },
    []
);

const resetFilters = () => {
    setPage(1);
    setPerPage(DEFAULT_PAGE_SIZE);
    setField1(null);
};
```

---

## Phase 5 — Create the Data Hook

```ts
// src/pages/<feature>/hooks/use-<feature>.ts
import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import QueryConst from "@/constants/query-constants";
import { useDataTable } from "@/hooks/useDataTable";
import { MyRowType } from "@/types/response/my-response";
import { getColumns, ActionType } from "../lib/get-columns";
import { <Feature>FilterProps } from "../lib/types";

const use<Feature> = (filters: <Feature>FilterProps) => {
    const { pageNumber, rowsPerPage, handlePageChange, field1, field2 } = filters;

    const { data, status, error } = useQuery({
        queryKey: [
            QueryConst.<domain>.<endpoint>,
            { pageNumber, rowsPerPage, field1, field2 },
        ],
        queryFn: () =>
            get<Feature>({ page: pageNumber, perPage: rowsPerPage, field1, field2 }),
    });

    const handleRowAction = useCallback(
        (type: ActionType, row: MyRowType) => {
            // handle actions
        },
        []
    );

    const columns = useMemo(
        () =>
            getColumns({
                shouldShowExtraCol: false, // derive from user/context as needed
                onAction: handleRowAction,
            }),
        [handleRowAction]
    );

    const dataTable = useDataTable({
        columns,
        data: data?.items ?? [],
        totalRows: data?.total ?? 0,
        page: pageNumber,
        rowsPerPage,
        onPageChange: handlePageChange,
        initialColumnPinning: { right: ["actions"] },
        getRowId: (row) => row.id,
    });

    const isEmpty = status === "success" && (data?.items?.length ?? 0) === 0;

    return { dataTable, status, error, isEmpty };
};

export default use<Feature>;
```

---

## Phase 6 — Create the Filter Component

Props are destructured directly from `<Feature>FilterProps`. The page spreads the filter hook return with `{...filters}` — no wrapper prop object.

```tsx
// src/pages/<feature>/components/<feature>-filters.tsx
import { <Feature>FilterProps } from "../lib/types";

export const <Feature>Filters = ({
    handleFilterChange,
    resetFilters,
    field1,
    field2,
}: <Feature>FilterProps) => {
    // render filter UI — no state here
};
```

---

## Phase 7 — Update the Page Component

`DataTable` is used **directly in the page** — no separate table component. The page owns status branching and spreads the filter hook return into the filter component.

```tsx
// src/pages/<feature>/<feature>-page.tsx
import { FC } from "react";

import PageWithHeaderFooter from "@/layouts/page-with-header-footer";
import { DataTable, DataTableSkeleton } from "@/components/data-table";
import FailedMessage from "@/components/failed-message";

import { <Feature>Filters } from "./components/<feature>-filters";
import use<Feature> from "./hooks/use-<feature>";
import use<Feature>Filter from "./hooks/use-<feature>-filter";

const <Feature>Page: FC = () => {
    const filters = use<Feature>Filter();
    const { status, error, dataTable, isEmpty } = use<Feature>(filters);

    return (
        <PageWithHeaderFooter title="..." description="...">
            <div className="space-y-6">
                <Feature>Filters {...filters} />

                {status === "pending" && <DataTableSkeleton columnCount={5} />}

                {status === "success" && !isEmpty && (
                    <div className="mx-auto w-full">
                        <DataTable table={dataTable.table} />
                    </div>
                )}

                {isEmpty && (
                    <FailedMessage type="no-data" text="No records found" />
                )}

                {status === "error" && (
                    <FailedMessage
                        type="error"
                        text={error?.message ?? "Failed to load data"}
                    />
                )}
            </div>
        </PageWithHeaderFooter>
    );
};

export default <Feature>Page;
```

---

## Checklist

- [ ] `lib/get-columns.tsx` — typed params, no closures, actions column pinned right
- [ ] `lib/types.ts` — only `ReturnType<typeof useXxxFilter>`, no runtime code
- [ ] Page-level filter hook uses `useQueryStates` with `filterParsers` object; dialog/sheet uses `useState`
- [ ] `filterParsers` declared **outside** the hook — `parseAsInteger.withDefault` for page/perPage, `parseAsString` for string fields
- [ ] `handleFilterChange` calls `setFilters({ page: 1, [name]: value })` — atomic reset + filter in one URL push
- [ ] `handlePageChange` calls `setFilters({ page, perPage })` — single atomic URL entry
- [ ] `resetFilters` calls `setFilters(null)` — clears all managed keys at once
- [ ] All filter fields exposed from filter hook return
- [ ] All filter fields present in `useQuery` `queryKey` array
- [ ] `columns` wrapped in `useMemo`, `onAction` wrapped in `useCallback`
- [ ] `useDataTable` has `initialColumnPinning: { right: ["actions"] }` when actions column exists
- [ ] `getRowId` uses a guaranteed non-null unique field
- [ ] Filter component destructures from `<Feature>FilterProps` — no local state
- [ ] Page spreads filter hook return into filter component with `{...filters}`
- [ ] `isEmpty` derived in data hook, not in page

---

## Common Pitfalls

**`useQueryStates` / `useQueryState` on dialog table** — nuqs writes to the URL, causing navigation/re-render. Dialog-scoped tables must use `useState`.

**Multiple individual `useQueryState` calls per filter** — Each separate setter call pushes a distinct URL history entry. A filter change that also resets the page produces two history entries and two re-renders. Use `useQueryStates` so `setFilters({ page: 1, field: value })` is a single atomic update.

**`filterParsers` declared inside the hook** — Declaring it inside the hook body causes a new object reference every render, breaking nuqs memoisation. Always declare it at module scope.

**Filter fields missing from `queryKey`** — Every field passed to `queryFn` must also be in `queryKey`, otherwise TanStack Query won't refetch on filter change.

**`handleFilterChange` not resetting page** — Always include `page: 1` in the `setFilters` call inside `handleFilterChange`, otherwise stale paginated results appear after a filter change.

**`onAction` not `useCallback`-wrapped** — Causes `columns` useMemo to re-run every render.

**Conditional columns with bare objects in spread** — Must annotate `({ row }: CellContext<T, unknown>)` or TypeScript won't infer the cell type.
