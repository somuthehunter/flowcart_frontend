# Analyzing a Prototype Component

Before writing any code, read the prototype file thoroughly and build a structured understanding of what it does. This prevents over/under-decomposing the feature.

---

## What to Look For

### 1. Visual Sections

Scan the JSX return and identify distinct UI regions. Each region that is visually independent and logically cohesive is a **component candidate**.

Signals of a distinct section:

- Wrapped in its own container `<div>` / `<section>` with a comment or heading
- Separated by whitespace or `<Separator />` in the prototype
- A grid item that renders independently (e.g., a KPI card)
- A modal / dialog that can be open or closed

**Example** — `service-opportunities.tsx` sections:

```
┌─────────────────────────────┐
│ KPI summary cards (3x)      │ ← section 1
├─────────────────────────────┤
│ Filter bar (tabs + selects) │ ← section 2
├─────────────────────────────┤
│ Opportunities table         │ ← section 3
│   with pagination           │
├─────────────────────────────┤
│ Lead request modal          │ ← section 4 (overlay)
└─────────────────────────────┘
```

---

### 2. Data Shapes

For each section, identify what data it renders. The prototype's hardcoded `const mockData = [...]` arrays are **type blueprints** — derive `<Entity>Response` from these.

Look for:

- Top-level `const mock... = [{ ... }]` — these define the response array shape
- Inline hardcoded values (strings, numbers) rendered in JSX — these are individual fields
- Computed labels: `data.status === 'active' ? 'Active' : 'Inactive'` → field type is a union

**Example extraction:**

```ts
// Prototype hardcoded mock:
const mockOpportunities = [
    {
        id: "1",
        address: "123 Main St",
        estimatedValue: 1200,
        severity: 8,
        status: "open",
    },
];

// → Derived response type:
export type ServiceOpportunityResponse = {
    id: string;
    address: string;
    estimatedValue: number;
    severity: number;
    status: "open" | "pending" | "closed";
};
```

---

### 3. State Inventory

Scan all `useState` calls in the prototype and categorize each:

| Category             | Examples                                               | Where it lives                  |
| -------------------- | ------------------------------------------------------ | ------------------------------- |
| **Server data**      | `const [data, setData] = useState([])` filled by fetch | → TanStack Query in hook        |
| **Loading/error**    | `const [loading, setLoading] = useState(true)`         | → TanStack Query `status` field |
| **Filter/search**    | `const [search, setSearch] = useState("")`             | → Local state in filter hook    |
| **Pagination**       | `const [page, setPage] = useState(1)`                  | → Local state in table hook     |
| **Modal open/close** | `const [isOpen, setIsOpen] = useState(false)`          | → Local state in parent hook    |
| **Active tab**       | `const [tab, setTab] = useState("all")`                | → Local state in page hook      |
| **Selected row**     | `const [selected, setSelected] = useState(null)`       | → Local state in table hook     |

---

### 4. Data Fetching

Identify every `fetch()` / `useEffect` call:

- **What URL** is called? (maps to `QueryConst` entry)
- **What params** are sent? (maps to endpoint function param interface)
- **What dependency array** triggers refetch? (maps to TanStack Query cache key `[QueryConst.x.y, params]`)
- **What shape** does the response have? (maps to response type)

**Example:**

```ts
// Prototype:
useEffect(() => {
    fetch(`/api/opportunities/service?page=${page}&status=${filters.status}`)
        .then((r) => r.json())
        .then(setOpportunities);
}, [page, filters]);

// → Translates to:
// QueryConst.opportunities.serviceList = "opportunities/service-list"
// Params interface: { page: number; status?: string }
// queryKey: [QueryConst.opportunities.serviceList, { page, status }]
```

If the section renders **only hardcoded data** (no fetch), it still needs a response type if it will eventually come from an API. For now, the endpoint function can return the hardcoded data directly.

---

### 5. Interactions & Handlers

Find all event handlers and classify them:

| Handler                      | Lives in                                   |
| ---------------------------- | ------------------------------------------ |
| `onClick` that opens a modal | Parent hook: `handleOpenModal`             |
| `onClick` that navigates     | Hook: `handleNavigate` using `useNavigate` |
| Filter `onChange`            | Filter hook: `handleFilterChange`          |
| Table row click              | Table hook: `handleRowClick`               |
| Form `onSubmit`              | Form hook or mutation hook                 |
| Pagination prev/next         | Table hook: `handlePageChange`             |

---

## Output: Analysis Summary

After reading the prototype, write a short structured summary before starting implementation. Format:

```
Feature: <feature name>
Prototype file: .prototype/components/<file>.tsx

Sections:
  1. KPI cards — fetches from /api/xxx — 3 stat items
  2. Filter bar — local state (search, status filter) — no fetch
  3. Data table — fetches from /api/xxx with page+filters — paginated
  4. Lead modal — local open/close state — triggered from table row

State:
  - opportunities: server (fetch) → useQuery
  - page: local → useState in table hook
  - filters: local → useState in filter hook
  - isModalOpen: local → useState in parent hook or table hook

Response types needed:
  - ServiceOpportunityResponse (from mockOpportunities shape)
  - LeadRequestResponse (from modal submit)

Endpoints needed:
  - getServiceOpportunities(params) → QueryConst.opportunities.serviceList
  - submitLeadRequest(body) → QueryConst.leads.submit (mutation)
```

This summary is input to [decomposition.md](./decomposition.md).
