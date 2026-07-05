---
name: table-to-data-table
description: "Migrate a hardcoded HTML table (no filters) to the DataTable pattern using getColumns builder, useDataTable hook, and DataTable component. Use when: replacing a manual <table> / <TableHeader> / <TableRow> component with TanStack Table, table has pagination only with no filter controls, adding column definitions via getColumns builder. For tables WITH filter controls use table-with-filter-migration instead."
argument-hint: 'Page directory path (e.g., "src/pages/service-opportunities")'
user-invocable: true
---

# Table → DataTable Migration (No Filters)

## When to Use

- A component renders a table with manual `<TableHeader>` / `<TableRow>` / `<TableCell>` markup
- The table has **no filter controls** — pagination only
- Columns are defined inline without `ColumnDef[]`

**Use `table-with-filter-migration` instead** when the page also has filter controls.

---

## Output File Map

| File                            | Purpose                                            |
| ------------------------------- | -------------------------------------------------- |
| `<page>/lib/get-columns.tsx`    | Column builder function returning `ColumnDef<T>[]` |
| `<page>/hooks/use-<feature>.ts` | Data fetching + pagination + `useDataTable`        |

The page component is updated in-place — no new files needed beyond these two.

---

## Phase 1 — Audit

1. Read the current table component and identify:
    - Row data type (`T`)
    - Column headers and cell renderers
    - Pagination state (page, perPage) location
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

## Phase 3 — Update the Data Hook

Pagination state (`page`, `perPage`) lives inside the data hook — no separate filter hook needed.

```ts
// src/pages/<feature>/hooks/use-<feature>.ts
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { DEFAULT_PAGE_SIZE } from "@/constants/default-constants";
import QueryConst from "@/constants/query-constants";
import { useDataTable } from "@/hooks/useDataTable";
import { MyRowType } from "@/types/response/my-response";
import { getColumns, ActionType } from "../lib/get-columns";

const use<Feature> = () => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);

    const { data, status, error } = useQuery({
        queryKey: [QueryConst.<domain>.<endpoint>, { page, rowsPerPage }],
        queryFn: () => get<Feature>({ page, perPage: rowsPerPage }),
    });

    const handlePageChange = (page: number, perPage: number) => {
        setPage(page);
        setRowsPerPage(perPage);
    };

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
        page,
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

## Phase 4 — Update the Page Component

`DataTable` is used **directly in the page** — no separate table component.

```tsx
// src/pages/<feature>/<feature>-page.tsx
import { FC } from "react";

import PageWithHeaderFooter from "@/layouts/page-with-header-footer";
import { DataTable, DataTableSkeleton } from "@/components/data-table";
import FailedMessage from "@/components/failed-message";

import use<Feature> from "./hooks/use-<feature>";

const <Feature>Page: FC = () => {
    const { status, error, dataTable, isEmpty } = use<Feature>();

    return (
        <PageWithHeaderFooter title="..." description="...">
            <div className="space-y-4">
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

- [ ] `lib/get-columns.tsx` exports `getColumns` with typed params, no closures
- [ ] Actions column has `id: "actions"`, `enableSorting: false`, header right-aligned
- [ ] `columns` wrapped in `useMemo`, `onAction` wrapped in `useCallback`
- [ ] `useDataTable` has `initialColumnPinning: { right: ["actions"] }` when actions column exists
- [ ] `getRowId` uses a guaranteed non-null unique field
- [ ] Pagination state (`page`, `rowsPerPage`) lives in the data hook
- [ ] `isEmpty` derived in data hook (`status === "success" && items.length === 0`)
- [ ] `<DataTable>` rendered directly in page — no separate table component

---

## Common Pitfalls

**`onAction` not `useCallback`-wrapped** — Causes `columns` useMemo to re-run every render.

**Conditional columns with bare objects in spread** — Must annotate `({ row }: CellContext<T, unknown>)` or TypeScript won't infer the cell type.

**Forgetting `manualPagination`** — `useDataTable` already sets this internally. Do not add `getPaginationRowModel` again.

**`getRowId` returning undefined** — Use a guaranteed non-null field (e.g., UUID). Fallback to `String(index)` only as a last resort.
