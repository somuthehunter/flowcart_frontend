# Component Decomposition

Using the analysis from [analysis.md](./analysis.md), decide how many components to create and which need their own hook.

---

## The Core Rule

> **A component needs its own hook if it has ANY of:**
> - Data fetching (server state via TanStack Query)
> - Local UI state (`useState`)
> - Event handlers (`handleXxx`)
> - Derived computed values computed from data or state

If a section is purely display — no state, no handlers, no data — it can be inlined in the page or made a pure stateless component with no hook.

---

## Decision Table

For each section identified in analysis, apply this:

| Question | Yes → | No → |
|----------|-------|------|
| Does it fetch data? | Needs a hook (useQuery) | Continue |
| Does it have local state? | Needs a hook (useState) | Continue |
| Does it have event handlers? | Needs a hook | Continue |
| Does it compute derived values from data? | Needs a hook | No hook needed — pure render |

---

## Granularity Guidelines

**Too coarse** — a single component for the whole page is the prototype monolith pattern. Don't do this.

**Too fine** — a hook per button is over-engineering. Group related state and handlers by logical section.

**Right granularity:**

| Pattern | Guidance |
|---------|---------|
| KPI / stat cards | Usually one component + one hook that fetches all card data |
| Filter bar | One component + one hook (manages filter state, exposes `filters` and `handleFilterChange`) |
| Data table + pagination | One component + one hook (fetches data with params, manages `page`, `pageSize`, `handlePageChange`, `handleRowClick`) |
| Modal (dialog) | The **open/close state** lives in the hook that triggers it (e.g., table hook). The modal itself is a separate component — but it shares the parent hook via prop drilling or a shared hook call |
| Static header / title section | No component needed — inline JSX in the page FC |
| Tab bar (navigation only) | Can be inlined in the page FC, with `activeTab` + `handleTabChange` in the page-level hook |

---

## Output: Decomposition Plan

After applying the decision table, produce a file plan:

```
src/pages/service-opportunities/
  index.tsx
  service-opportunities-page.tsx      ← page layout, no hook needed (pure composition)
  components/
    kpi-cards.tsx                      ← needs hook (fetches data)
    opportunity-filters.tsx            ← needs hook (local filter state)
    opportunity-table.tsx              ← needs hook (fetches + pagination + row select)
    lead-request-modal.tsx             ← no own hook (state lives in opportunity-table hook)
  hooks/
    use-kpi-cards.ts
    use-opportunity-filters.ts
    use-opportunity-table.ts
```

---

## Common Patterns from Prototype Components

### Pattern: fetch + filter + pagination (e.g., `service-opportunities.tsx`)

```
Prototype: one useState for data, one for loading, one for page, one for filters, one useEffect
→ Decompose into:
  - use-opportunity-filters.ts     (filter state, handleFilterChange)
  - use-opportunity-table.ts       (useQuery with filters as params, page state, pagination handlers)
  Both hooks called from their respective .tsx files
  Table hook consumes filters from filter hook via shared state or prop
```

**Tip**: If the table needs the filter values, the table hook can accept `filters` as a parameter:

```ts
// use-opportunity-table.ts
const useOpportunityTable = (filters: OpportunityFilters) => {
    const { data, status, error } = useQuery({
        queryKey: [QueryConst.opportunities.serviceList, filters],
        queryFn: () => getServiceOpportunities(filters),
    });
    // ...
};

// opportunity-table.tsx calls:
// const { filters } = useOpportunityFilters();
// const { data, ... } = useOpportunityTable(filters);
```

---

### Pattern: hardcoded data + client-side filter (e.g., `distributor-contractor-view.tsx`)

```
Prototype: hardcoded mockContractors[], useState for search/filter, filtered via .filter()
→ Decompose into:
  - use-contractor-list.ts    (useQuery fetching contractors; derived filteredContractors = data?.filter(...))
  - use-contractor-filters.ts OR inline filter state in use-contractor-list.ts if simple
```

When there's only one filter and one dataset, consolidating into a single hook is fine.

---

### Pattern: purely static / hardcoded display (e.g., `oem-dashboard.tsx`)

```
Prototype: no fetch, no state — maps over hardcoded arrays
→ Even if currently static, create endpoint + hook for each section
  The endpoint returns the hardcoded data for now (or MSW does), but the architecture is ready
  Never leave hardcoded data in the component or hook — it belongs in fake-store
```

---

### Pattern: multiple tabs each with different data (e.g., tabbed views)

```
Prototype: Tabs component, each tab has its own fetch
→ Each tab's content = separate component + hook
  Tab switching state lives in the page-level hook or the nearest shared parent hook
```

---

## Anti-patterns to Avoid

| Anti-pattern | Fix |
|-------------|-----|
| One giant page-level hook that owns all state for all sub-components | Split by section — each component owns its own hook |
| Logic in the `.tsx` file (useState, useEffect, handlers) | Move to the `.ts` hook |
| Passing raw data props down from page to components | Each component fetches its own data via its hook |
| Prop drilling more than 2 levels | Rethink decomposition — the child probably needs its own hook |
| Modal open state in the modal component | Open state lives in the hook of the component that triggers it |
