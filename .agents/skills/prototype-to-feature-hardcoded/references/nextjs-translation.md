# Next.js → Vite/React Translation

Reference for converting Next.js-specific patterns in prototype components to their React/Vite equivalents used in this project.

---

## File-Level Changes

| Next.js | This App |
|---------|---------|
| `"use client";` at top of file | Remove — not applicable in Vite. All components are client-side. |
| `"use server";` | Remove — no server components. |
| Default export wrapped in `export default function Page()` | `const MyPage: FC = () => ...` + `export default MyPage` |

---

## Routing

| Next.js | This App |
|---------|---------|
| `import { useRouter } from "next/navigation"` | `import { useNavigate } from "react-router"` |
| `const router = useRouter()` | `const navigate = useNavigate()` |
| `router.push("/some-path")` | `navigate(AuthedRoutes.someFeature)` |
| `router.back()` | `navigate(-1)` |
| `import Link from "next/link"` | `import { Link } from "react-router"` |
| `<Link href="/path">` | `<Link to={AuthedRoutes.xxx}>` |
| String route literals `"/service-opportunities"` | `AuthedRoutes.serviceOpportunities` from `@/constants/route-constants` |
| `usePathname()` | `import { useLocation } from "react-router"; const { pathname } = useLocation()` |
| `useSearchParams()` | `import { useNuqsAdapter } from "nuqs"; ...` or `import { useSearchParams } from "react-router"` — prefer `nuqs` for typed URL state |

---

## Images & Media

| Next.js | This App |
|---------|---------|
| `import Image from "next/image"` | Remove; use `<img>` or a project image component |
| `<Image src={...} alt={...} width={...} height={...} />` | `<img src={...} alt={...} className="..." />` |

---

## Data Fetching

| Next.js Prototype Pattern | This App |
|--------------------------|---------|
| `fetch('/api/endpoint')` in `useEffect` | TanStack Query `useQuery({ queryKey, queryFn })` in the hook |
| `const [data, setData] = useState([]); fetch(...).then(setData)` | `const { data, status, error } = useQuery(...)` |
| `const [loading, setLoading] = useState(true)` | `status === "pending"` from `useQuery` |
| `const [error, setError] = useState(null)` | `status === "error"` + `error` from `useQuery` |
| Manual `URLSearchParams` for query string | Pass `params` object to `httpService.get(url, { params })` — Axios serializes automatically |
| `try { const r = await fetch(...); const d = await r.json() } catch (e) {}` | Endpoint function with `handleApiError(error)` in catch |
| Next.js API route `/api/xxx` path | Map to real backend path via `QueryConst` — confirm path with backend team |

---

## State Management

| Next.js Prototype Pattern | This App |
|--------------------------|---------|
| Multiple `useState` calls for server data + loading + error | Single `useQuery` covers data + status + error |
| Global state via React Context in prototype | Zustand store (`useMyStore`) if truly global; local `useState` in hook if page-scoped |
| `useEffect` for side effects on state change | Keep `useEffect` in the hook (not the component) if still needed; prefer TanStack Query for data sync |

---

## Toast / Notifications

| Next.js Prototype | This App |
|------------------|---------|
| `import { useToast } from "@/hooks/use-toast"` | `import { toast } from "sonner"` |
| `toast({ title: "...", description: "..." })` | `toast.success("...")` / `toast.error("...")` |

---

## Styling & UI Components

| Next.js | This App |
|---------|---------|
| `className="..."` | Same — Tailwind classes carry over as-is |
| shadcn/ui imports from `@/components/ui/...` | Same component names, same path pattern — check `src/components/ui/` for available components |
| `cn()` from `@/lib/utils` | Same — `cn()` from `@/lib/utils` |
| Radix UI primitives | Same — already in use via shadcn |
| `lucide-react` icons | Same — same import |

---

## Environment Variables

| Next.js | This App |
|---------|---------|
| `process.env.NEXT_PUBLIC_XXX` | `config.env.XXX` from `@/lib/config` (never access `import.meta.env` directly) |

---

## Types & Imports

| Next.js | This App |
|---------|---------|
| Relative imports `../../components/...` | Always use `@/` alias — `@/components/...` |
| `import type { FC } from "react"` | Same |
| `"next/font"`, `"next/head"` | Not applicable — remove |
| `<Head><title>...</title></Head>` | `<title>{`Page | ${config.env.APP_TITLE}`}</title>` inline in page JSX |

---

## Full Conversion Checklist

When porting a prototype file, go through each item:

- [ ] Remove `"use client"` / `"use server"`
- [ ] Replace `next/link` → `react-router` `Link`
- [ ] Replace `next/navigation` `useRouter` → `react-router` `useNavigate`
- [ ] Replace string route literals → `AuthedRoutes` constants
- [ ] Replace `fetch()` + `useEffect` → TanStack Query hook
- [ ] Replace `next/image` `Image` → `<img>`
- [ ] Replace `process.env.NEXT_PUBLIC_*` → `config.env.*`
- [ ] Replace `useToast` from prototype → `toast` from `sonner`
- [ ] Replace relative imports → `@/` aliases
- [ ] Replace `<Head><title>` → inline `<title>` in FC return
- [ ] Remove all hardcoded mock data from components — move to `src/mocks/fake-store/`
- [ ] Move all state and handlers out of `.tsx` into `.ts` hook files
