# Vista

React 19 + TypeScript SPA. Package manager: **pnpm**. Node ≥ 20.

## Tech Stack

| Concern      | Library                                                   |
| ------------ | --------------------------------------------------------- |
| Routing      | react-router v7, `createBrowserRouter`                    |
| Server state | TanStack Query v5                                         |
| Client state | Zustand v5                                                |
| HTTP         | Axios v1 (singleton at `@/services/http-service`)         |
| UI           | Radix UI primitives + shadcn pattern (`@/components/ui/`) |
| Styling      | Tailwind CSS v4                                           |
| Forms        | react-hook-form v7 + Zod v4                               |
| Table        | @tanstack/react-table + @tanstack/react-virtual           |
| URL state    | nuqs v2                                                   |
| Toasts       | sonner v2                                                 |
| Icons        | lucide-react                                              |
| Animations   | framer-motion v12                                         |
| Web Workers  | comlink v4 (via vite-plugin-comlink)                      |
| Testing      | Vitest + @testing-library/react + MSW                     |

## Build & Test

```bash
pnpm install
pnpm dev            # dev server
pnpm build          # tsc -b && vite build
pnpm build:prod     # tsc && vite build --base=/app
pnpm test           # vitest
pnpm test:coverage  # vitest --coverage
pnpm lint           # eslint
```

## Architecture

```
src/
  router/         # createBrowserRouter + route config + guards
  pages/          # feature pages (each page = directory)
  components/     # shared components (ui/ = shadcn primitives)
  services/       # http-service + api/ endpoint functions
  stores/         # Zustand stores (auth, route)
  hooks/          # shared hooks
  lib/            # utilities, config, auth-interceptor
  constants/      # route paths, API URLs, app defaults
  types/          # shared TS interfaces and types
  contexts/       # React contexts (feature flags, confirmation, page render)
  mocks/          # MSW handlers + fake store (dev + test)
  workers/        # comlink web workers
```

**Bootstrap flow**: `main.tsx` → `AppProviders` (providers.tsx) → `App` (router/index.tsx) → `useApp()` → `verifyUser()` → `createBrowserRouter(routes)` → `RouterProvider`

**Auth flow**: `auth-store.signIn` → `auth-ep.login` → `jwt-decode` → set store. `auth-interceptor.ts` handles 401: pauses queue, calls `store.refreshToken()`, retries.

**Route access**: `useRouteStore` subscribes to `useAuthStore.user` → recomputes `RouteConfig[]` filtered by `guard.allowedRoles` → `ProtectedLayout` renders nav with filtered routes.

## Conventions

### Path Aliases

Always use `@/` — never relative paths.

```ts
// ✅
import { useAuthStore } from "@/stores/auth-store";

// ❌
import { useAuthStore } from "../../stores/auth-store";
```

### Constants

- All route paths → `AuthedRoutes` / `NonAuthedRoutes` / `PublicRoutes` in `@/constants/route-constants`
- All API URLs → `QueryConst` in `@/constants/query-constants`
- Never hardcode route strings or API URLs inline

### Pages

Each page is a directory with a thin `index.tsx` re-export:

```
src/pages/my-feature/
  index.tsx           ← export default MyFeaturePage (re-export only)
  my-feature-page.tsx ← actual FC
  components/         ← page-local components
  hooks/              ← page-local hooks
```

Page title pattern:

```tsx
<title>{`Page Name | ${config.env.APP_TITLE}`}</title>
```

### Routing

Use the builder functions from `@/lib/route-utils` — never raw `RouteObject`:

```tsx
import { defineAuthedRoute, suspendedComponent } from "@/lib/route-utils";

const MyPage = suspendedComponent(lazy(() => import("@/pages/my-feature")));

defineAuthedRoute({
    name: "My Feature",
    path: AuthedRoutes.myFeature,
    icon: <Icon className="h-4 w-4" />,
    Component: MyPage,
    guard: { allowedRoles: ["Distributor", "OEM"] },
});
```

Builders: `definePublicRoute`, `defineAuthedRoute`, `defineNonAuthedRoute`, `defineInvisibleRoute`, `defineLayoutRoute`.

User roles: `"SuperAdmin" | "OEM" | "Distributor" | "Contractor"`

The `guard` field is a discriminated union — use whichever fits:

```ts
guard: {
    allowedRoles: ["Admin"];
} // whitelist
guard: {
    exceptRoles: ["Viewer"];
} // blacklist
guard: {
    allowedScopes: "user.view";
} // scope-based
```

Boolean scope expressions via `@/lib/bool-utils`:

```ts
guard: {
    allowedScopes: {
        AND: ["user.view", { OR: ["admin.user", "admin.manager"] }],
    },
}
```

### Services / API

Data flow: `Component` → `TanStack Query hook` → `src/services/api/*-ep.ts` → `http-service.ts` (Axios) → MSW (dev) / real backend (prod)

Endpoint functions live in `src/services/api/<domain>-ep.ts`. Pattern:

```ts
export const getMyData = async (params: MyParams) => {
    try {
        const response = await httpService.get<MyResponseType>(
            QueryConst.myDomain.endpoint,
            { params }
        );
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
        throw new Error(getErrorString(response));
    } catch (error) {
        handleApiError(error); // from @/lib/object-utils
    }
};
```

- Use `HttpStatusCode` enum from axios
- Error handling: `handleApiError` + `getErrorString` from `@/lib/object-utils`
- Auth endpoints bypass the 401 interceptor

### Zustand Stores

```ts
const STORE = "myStore";
const Actions = {
    doSomething: `${STORE}/doSomething`,
} as const;

export const useMyStore = create<MyState>()(
    subscribeWithSelector(
        devtools(
            (set) => ({
                // state + actions
                set({ ... }, false, Actions.doSomething);
            }),
            { name: STORE, enabled: config.env.MODE !== "production" }
        )
    )
);
```

- `devtools` enabled only in non-production
- Named actions: `"store/actionName"` string constants
- `subscribeWithSelector` when other stores need to react to state slices

### Components

Shared components: `src/components/`. UI primitives (shadcn): `src/components/ui/`.

Props interface + `cn()` for class merging + Radix primitives pattern:

```tsx
interface MyComponentProps {
    className?: string;
}

const MyComponent = ({ className, ...props }: MyComponentProps) => (
    <div className={cn("base-classes", className)} {...props} />
);
```

### Hooks (RBAC / Guards)

Component-level access control via `useGuard`:

```tsx
const { hasAccess, shouldShow, disabled } = useGuard({
    allowedRoles: ["Distributor"],
    allowedScopes: or("scope:read", "scope:write"), // @/lib/bool-utils
    custom: ({ user }) => someCheck(user),
});
```

Feature flags via `useFeatureFlag(key: FeatureFlags)`.

### Forms

react-hook-form + Zod. Always define schema with `z.object({...})` first, infer the type:

```tsx
const schema = z.object({ email: z.string().email() });
type FormValues = z.infer<typeof schema>;

const form = useForm<FormValues>({ resolver: zodResolver(schema) });
```

### Testing

- Vitest globals are enabled — no need to import `describe`/`it`/`expect`
- MSW handlers in `src/mocks/api/` grouped by domain
- Use `@faker-js/faker` (import as `fakerEN_IN`) for fake data in handlers
- `@/workers` is auto-mocked in the test setup — do not import workers directly in tests
- `server.use(...)` for per-test handler overrides; `server.resetHandlers()` runs after each test automatically

### Code Style

- Prettier: double quotes, 4-space indent, semicolons, trailing commas (ES5)
- Import order (enforced by prettier-plugin-sort-imports): React → third-party → `@/` types/constants/hooks/components → local `./`
- TypeScript strict mode — no `any`, no `// @ts-ignore` without a comment explaining why
- ESLint flat config — `no-array-index-key` disabled (project-intentional)

## Environment Variables

All via `import.meta.env`, accessed through `config.env` from `@/lib/config`:

| Variable                            | Purpose                    |
| ----------------------------------- | -------------------------- |
| `VITE_APP_TITLE`                    | App title string           |
| `VITE_API_BASE_URL`                 | Backend API base URL       |
| `VITE_APP_DOMAIN_URL`               | Frontend domain            |
| `VITE_LOG_API_KEY` / `VITE_LOG_URL` | Seq structured logging     |
| `VITE_MAPBOX_ACCESS_TOKEN`          | Mapbox maps                |
| `VITE_VERCEL_ENV`                   | Environment mode detection |

Never access `import.meta.env` directly — always go through `config.env`.

**MSW mock mode**: When `VITE_API_BASE_URL` starts with `/` (e.g. `/api`), the MSW service worker auto-starts in dev and intercepts all API calls — no real backend needed.

## Feature Flags

Toggled by `VITE_VERCEL_ENV` / `MODE`. All flags are `false` in production:

```ts
DARK_MODE | COLOR_MODE_DETECTOR | NOTIFICATIONS | TEST_MODE_BANNER;
```

Consume via `useFeatureFlag("FLAG_NAME")`.
