# Two-File Components

Follow the angular-like two-file pattern: `<name>.tsx` (UI only) + `use-<name>.ts` (all logic).

This applies to **any** kind of component — cards, pages, tables, forms, dialogs, lists, drawers, full-page views, etc. The pattern is the same regardless of shape.

## File Structure

```
src/pages/<feature>/
  components/
    my-feature.tsx           ← UI only (render, no logic)
  hooks/
    use-my-feature.ts        ← All state, handlers, derived values, queries, mutations
  index.tsx                    ← Page entry point / re-export
```

## Core Rule

The `.tsx` file only:

1. Calls the hook once — `const { ... } = useMyFeature()`
2. Returns JSX

No `useState`, `useEffect`, `useMemo`, event handler definitions, or query calls inside the component.

---

## Four Async Render States

Whenever the component depends on async data, always handle all four:

```tsx
{status === "pending" && <Skeleton ... />}
{status === "error" && <FailedMessage type="error" text={error?.message} />}
{status === "success" && data && <div>{/* actual UI */}</div>}
{status === "success" && !data && <FailedMessage type="no-data" text="No data available" />}
```

The `success && !data` case covers when `handleApiError()` silently returns `undefined` (e.g., on expired token).

---

## Component Shapes & Examples

### Data Display (any container — card, panel, section)

```tsx
import { FC } from "react";

import FailedMessage from "@/components/failed-message";
import { Skeleton } from "@/components/ui/skeleton";

import useMyFeature from "../hooks/use-my-feature";

export const MyFeature: FC = () => {
    const { data, status, error } = useMyFeature();

    return (
        <div>
            {status === "pending" && <Skeleton className="h-8 w-full" />}
            {status === "error" && (
                <FailedMessage type="error" text={error?.message} />
            )}
            {status === "success" && data && <span>{data.name}</span>}
            {status === "success" && !data && (
                <FailedMessage type="no-data" text="No data available" />
            )}
        </div>
    );
};
```

### Interactive Component (buttons, actions)

```tsx
export const ContractorActions: FC = () => {
    const { data, status, error, handleDelete, isDeleting, handleEdit } =
        useContractorActions();

    return (
        <div>
            {status === "pending" && <Skeleton className="h-10 w-full" />}
            {status === "error" && (
                <FailedMessage type="error" text={error?.message} />
            )}
            {status === "success" && data && (
                <div className="flex gap-2">
                    <Button onClick={handleEdit}>Edit</Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}>
                        Delete
                    </Button>
                </div>
            )}
            {status === "success" && !data && (
                <FailedMessage type="no-data" text="No contractor found" />
            )}
        </div>
    );
};
```

### Form Component

```tsx
export const EditProfileForm: FC = () => {
    const { form, handleSubmit, isPending } = useEditProfileForm();

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save"}
                </Button>
            </form>
        </Form>
    );
};
```

### Table / List Component

```tsx
export const ContractorTable: FC = () => {
    const { data, status, error, table, pagination, handleRowClick } =
        useContractorTable();

    return (
        <div className="space-y-4">
            {status === "pending" && <Skeleton className="h-64 w-full" />}
            {status === "error" && (
                <FailedMessage type="error" text={error?.message} />
            )}
            {status === "success" && data && (
                <>
                    <DataTable table={table} onRowClick={handleRowClick} />
                    <Pagination {...pagination} />
                </>
            )}
            {status === "success" && !data && (
                <FailedMessage type="no-data" text="No contractors found" />
            )}
        </div>
    );
};
```

### Dialog / Modal Component

```tsx
export const ConfirmDeleteDialog: FC = () => {
    const { isOpen, handleClose, handleConfirm, isDeleting, targetName } =
        useConfirmDeleteDialog();

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete {targetName}?</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isDeleting}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
```

---

## Props

Define a props interface when the component accepts external inputs:

```tsx
interface MyFeatureProps {
    id: string;
    className?: string;
}

const MyFeature: FC<MyFeatureProps> = ({ id, className }) => {
    const { data, status, error } = useMyFeature(id); // pass id into hook

    return <div className={cn("base", className)}>...</div>;
};
```

Pass external props **into the hook** — never use them directly in JSX for logic.

---

## Component Rules

- **No `useState`** — all state lives in the hook
- **No event handler definitions** — all handlers come from the hook
- **No `useMemo` / `useCallback`** — derived values computed in the hook
- **No query/mutation calls** — only through the hook
- **No inline logic** — no ternary business logic, no conditional imports
- **Use `@/` imports** — never relative paths (`../../`)
- **Use `cn()`** for class merging (from `@/lib/utils`)

---

## Large Component Split

If >200 lines, split the implementation into a separate file:

```
my-feature.tsx             ← thin re-export only
my-feature-component.tsx   ← actual FC implementation
```

`my-feature.tsx`:

```tsx
export { MyFeature as default } from "./my-feature-component";
```

---

## Page-Level Re-export

`src/pages/<feature>/index.tsx`:

```tsx
export { default } from "./my-feature-page";
```

Then in routing:

```ts
const MyPage = suspendedComponent(lazy(() => import("@/pages/my-feature")));

defineAuthedRoute({
    name: "My Feature",
    path: AuthedRoutes.myFeature,
    Component: MyPage,
    guard: { allowedRoles: ["Distributor"] },
});
```

---

## Styling

```tsx
<div className={cn("base-classes", className)} {...props} />
```

Use Tailwind classes directly — no CSS modules, no inline styles.

## Type Props

If the component accepts props, define them:

```tsx
interface MyFeatureProps {
    className?: string;
    onRefresh?: () => void;
}

const MyFeature: FC<MyFeatureProps> = ({ className, onRefresh }) => {
    // ...
};
```

## Next Steps

Done! Your feature is complete. To use:

1. Import the component in your page
2. Render it
3. The hook will fetch data automatically
4. All states (loading, error, success) are handled
