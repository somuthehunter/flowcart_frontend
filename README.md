# React Admin Portal Template

A generic, production-ready React admin portal template built with Vite. It provides a robust foundation for building modern web applications with authentication, role-based access control, and a mock backend out of the box.

## 🚀 Tech Stack

| Category           | Technology                                    |
| ------------------ | --------------------------------------------- |
| **Core**           | React 19, TypeScript 5.8, Vite 7              |
| **Styling**        | Tailwind CSS v4, shadcn/ui, Radix UI          |
| **State**          | Zustand v5 (app), nuqs (URL state)            |
| **Data Fetching**  | TanStack Query v5 (React Query)               |
| **Routing**        | React Router v7                               |
| **Forms**          | React Hook Form, Zod                          |
| **Animations**     | Framer Motion                                 |
| **HTTP Client**    | Axios                                         |
| **Mock Backend**   | MSW (Mock Service Worker) v2                  |
| **Testing**        | Vitest, Testing Library                        |
| **Code Quality**   | ESLint, Prettier, Husky, lint-staged           |

## 📦 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-org/your-repo.git
cd your-repo
pnpm install
```

### 2. Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```

| Variable                   | Description                      |
| -------------------------- | -------------------------------- |
| `VITE_APP_TITLE`           | Browser tab / app title          |
| `VITE_API_BASE_URL`        | API base URL (e.g. `/api`)       |
| `VITE_APP_DOMAIN_URL`      | Frontend URL for CORS / redirects|
| `VITE_MAPBOX_ACCESS_TOKEN` | Mapbox GL token (optional)       |

### 3. Start Development Server
```bash
pnpm dev
```

> When `VITE_API_BASE_URL` starts with `/`, the MSW service worker auto-starts and intercepts all API calls — **no backend needed**.

---

## 🏗️ Architecture Overview

### High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser                                                        │
│                                                                 │
│  index.html ─▶ main.tsx                                         │
│                  │  1. Start MSW (if mock mode)                  │
│                  │  2. Initialize logger                         │
│                  │  3. Configure Axios interceptors              │
│                  │  4. Render <App />                            │
│                  ▼                                               │
│  ┌──────────────────────────────────────┐                       │
│  │  router/index.tsx (App)              │                       │
│  │  ├── Verify user session             │                       │
│  │  ├── Compute routes (Zustand)        │                       │
│  │  └── <RouterProvider router={...} /> │                       │
│  └─────────────┬────────────────────────┘                       │
│                ▼                                                 │
│  ┌──────────────────────────────────────┐                       │
│  │  router/providers.tsx (AppProviders) │                       │
│  │  ├── QueryClientProvider             │                       │
│  │  ├── FeatureFlagProvider             │                       │
│  │  ├── ThemeProvider                   │                       │
│  │  ├── NuqsAdapter                     │                       │
│  │  ├── TooltipProvider                 │                       │
│  │  └── ConfirmationProvider            │                       │
│  └─────────────┬────────────────────────┘                       │
│                ▼                                                 │
│  ┌──────────────────────────────────────┐                       │
│  │  Layouts ──▶ Pages ──▶ Components    │                       │
│  └──────────────────────────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
react-admin-template/
├── .github/                    # GitHub templates & CI
│   ├── workflows/              #   GitHub Actions (deploy-staging.yml)
│   ├── TEMPLATE_SETUP.md       #   Post-clone checklist
│   ├── pull_request_template.md
│   └── copilot-instructions.md
│
├── public/                     # Static assets & MSW service worker
│
├── src/
│   ├── main.tsx                # ── Entry point (MSW init, Axios interceptors, render)
│   │
│   ├── router/                 # ── Routing Layer
│   │   ├── index.tsx           #   App shell (session check → RouterProvider)
│   │   ├── providers.tsx       #   Global provider tree (Query, Theme, Flags, etc.)
│   │   ├── store.ts            #   Zustand store — reactive route computation
│   │   ├── guards/             #   Route guards
│   │   │   ├── auth-route.tsx  #     Requires authentication + RBAC check
│   │   │   ├── non-auth-route.tsx #  Requires unauthenticated (login/register)
│   │   │   └── unprotected-routes.tsx # No auth requirement
│   │   ├── routes/             #   Route definitions
│   │   │   ├── index.tsx       #     Master route tree (layouts + guards)
│   │   │   ├── protected-routes.tsx # Authed routes (Dashboard, Users, Settings)
│   │   │   └── public-routes.tsx    # Non-authed routes (Login, Forgot Password)
│   │   └── hooks/              #   Router-specific hooks (useApp)
│   │
│   ├── layouts/                # ── Layout Components
│   │   ├── root/               #   Root layout (wraps AppProviders)
│   │   ├── protected-layout/   #   Sidebar + header chrome for authed pages
│   │   ├── public-layout/      #   Layout for login / public pages
│   │   └── page-with-header-footer/ # Reusable page shell with header/footer
│   │
│   ├── pages/                  # ── Page Components (one dir per route)
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── forgot-password/
│   │   ├── profile/
│   │   ├── users/
│   │   ├── settings/
│   │   ├── not-found/
│   │   └── wip/                #   Work-in-progress placeholder page
│   │
│   ├── components/             # ── Shared Components
│   │   ├── ui/                 #   shadcn/ui primitives (50+ components)
│   │   │   ├── button.tsx, input.tsx, dialog.tsx, ...
│   │   │   ├── sidebar.tsx     #     App sidebar component
│   │   │   ├── data-table (→ data-table/)
│   │   │   └── typography/     #     Typography components
│   │   ├── data-table/         #   Advanced data table system
│   │   │   ├── data-table.tsx  #     Core table with sorting, filtering, pagination
│   │   │   ├── infinite-data-table.tsx # Infinite scroll variant
│   │   │   ├── data-table-filter-menu.tsx
│   │   │   ├── data-table-sort-list.tsx
│   │   │   └── ...             #     (19 table sub-components)
│   │   ├── form/               #   Form building blocks
│   │   ├── error-boundary/     #   App-level error boundary
│   │   ├── loading/            #   Loading skeletons & spinners
│   │   ├── cards/              #   Card components
│   │   ├── copy-to-clipboard/
│   │   ├── navigation-link/
│   │   └── suspended-page/     #   Suspense wrapper for lazy-loaded pages
│   │
│   ├── hooks/                  # ── Custom Hooks
│   │   ├── use-auth.ts         #   Auth state accessor
│   │   ├── useGuard.ts         #   RBAC guard (role + scope checking)
│   │   ├── useDataTable.ts     #   Data table state management
│   │   ├── useDebounce.ts      #   Debounced values
│   │   ├── useMediaQuery.ts    #   Responsive breakpoint detection
│   │   ├── useMobile.ts        #   Mobile viewport detection
│   │   ├── usePagination.ts    #   Pagination state
│   │   ├── useFeatureFlag.ts   #   Feature flag checking
│   │   ├── useConfirm.ts       #   Confirmation dialog trigger
│   │   ├── useRowLoadingState.ts # Row-level loading state for tables
│   │   ├── use-callback-ref.ts
│   │   ├── use-debounced-callback.ts
│   │   ├── use-intersection-observer.ts
│   │   └── use-infinite-scroll-observer.tsx
│   │
│   ├── stores/                 # ── Zustand State Stores
│   │   └── auth-store.ts       #   Authentication state (sign in/out, token refresh)
│   │
│   ├── services/               # ── Service Layer
│   │   ├── http-service.ts     #   Axios instance wrapper (auth token injection)
│   │   ├── auth-service.ts     #   Auth helpers (JWT decode, login/logout state)
│   │   ├── storage-service.ts  #   LocalStorage abstraction
│   │   └── api/                #   Endpoint functions
│   │       ├── auth-ep.ts      #     Login, logout, refresh
│   │       ├── user-ep.ts      #     User CRUD
│   │       ├── role-ep.ts      #     Role management
│   │       └── scope-ep.ts     #     Scope management
│   │
│   ├── mocks/                  # ── MSW Mock Backend
│   │   ├── api/                #   Request handlers
│   │   │   ├── browser.ts      #     MSW browser worker setup
│   │   │   ├── server.ts       #     MSW server setup (for tests)
│   │   │   ├── authHandlers.ts #     Auth API mocks (login, refresh, JWT signing)
│   │   │   └── authMiddleware.ts #   Auth middleware for protected mock endpoints
│   │   ├── fake-store/         #   In-memory data (seeded with Faker)
│   │   │   └── users.ts        #     Test users with roles & credentials
│   │   └── json/               #   Static JSON fixtures
│   │
│   ├── types/                  # ── TypeScript Type Definitions
│   │   ├── types.ts            #   Core types (UserRoles, enums, etc.)
│   │   ├── route-config.ts     #   Route configuration type
│   │   ├── route-guard.ts      #   Route guard discriminated union
│   │   ├── account-user.ts     #   Authenticated user shape
│   │   ├── access-token.ts     #   JWT payload type
│   │   ├── user-scopes.ts      #   Granular permission scopes
│   │   ├── feature-flags.ts    #   Feature flag keys
│   │   ├── data-table.ts       #   Data table configuration types
│   │   ├── request/            #   API request DTOs
│   │   └── response/           #   API response DTOs
│   │
│   ├── lib/                    # ── Utility Functions
│   │   ├── config.ts           #   Centralized env config + feature flags
│   │   ├── route-utils.tsx     #   Route helpers (defineAuthedRoute, etc.)
│   │   ├── route-computations.tsx # Route tree → RouteObject[] conversion
│   │   ├── bool-utils.ts       #   Boolean expression evaluator (for scope guards)
│   │   ├── filter-utils.ts     #   Data filtering utilities
│   │   ├── format.ts           #   Date/number/string formatters
│   │   ├── object-utils.ts     #   Deep merge, pick, omit, diff
│   │   ├── log-utils.ts        #   Remote logging (Seq)
│   │   ├── cookie-utils.ts     #   Cookie read/write
│   │   ├── image-utils.ts      #   Image processing helpers
│   │   ├── phone-number-utils.ts # Phone number formatting (libphonenumber)
│   │   └── ...
│   │
│   ├── contexts/               # ── React Contexts
│   │   ├── confirmation-context.tsx  # Global confirmation dialog
│   │   ├── feature-flag-context.tsx  # Feature flag provider
│   │   └── page-render-context.tsx   # Page metadata (title, breadcrumbs)
│   │
│   ├── constants/              # ── Global Constants
│   │   ├── route-constants.ts  #   Route path definitions
│   │   ├── query-constants.ts  #   TanStack Query keys
│   │   ├── cookie-constants.ts #   Cookie key names
│   │   ├── default-constants.ts#   App defaults
│   │   └── theme-constants.ts  #   Theme configuration
│   │
│   ├── config/                 # ── Configuration
│   │   └── data-table.ts       #   Default data table settings
│   │
│   ├── styles/                 # ── Global CSS (Tailwind entry)
│   ├── assets/                 # ── Static assets (images, fonts)
│   ├── workers/                # ── Web Workers (via Comlink)
│   └── tests/                  # ── Test setup & utilities
│       └── setup.ts
│
├── eslint.config.js            # ESLint flat config
├── prettier.config.cjs         # Prettier + import sorting
├── vite.config.ts              # Vite + plugins (SWC, Tailwind, Comlink, polyfills)
├── vitest.config.ts            # Vitest (jsdom, coverage)
├── tsconfig.json               # TypeScript project references
├── components.json             # shadcn/ui config
├── CONTRIBUTING.md             # Contribution guidelines
└── package.json
```

---

## 🔐 Authentication & RBAC

The template includes a comprehensive Auth system and RBAC (Role-Based Access Control) setup. By default, it uses MSW to intercept API calls and provide fake JWTs.

### Auth Flow

```
Login Page ──▶ authHandlers (MSW) ──▶ JWT signed & returned
                                          │
                                          ▼
                                     auth-store.ts
                                     ├── Decode JWT → AccountUser
                                     ├── Set isAuthenticated = true
                                     └── Inject token into Axios
                                          │
                                          ▼
                                     route-store.ts
                                     └── Recompute routes for user's role
                                          │
                                          ▼
                                     RouterProvider re-renders
```

### Automatic Token Refresh

The Axios response interceptor in `main.tsx` handles 401 errors by:
1. Queuing failed requests
2. Calling `refreshToken()` on the auth store
3. Replaying all queued requests with the new token

### Test Credentials
All test accounts share the same password: `strong-password`

| Account     | Email                    | Role      | Access         |
| ----------- | ------------------------ | --------- | -------------- |
| **Admin**   | `admin@template.com`     | `Admin`   | Full access    |
| **Manager** | `manager@template.com`   | `Manager` | Management     |
| **Viewer**  | `viewer@template.com`    | `Viewer`  | Read-only      |

### Route Guards

Routes are protected via a **discriminated union** guard system that supports both role-based and scope-based access:

```tsx
// src/types/route-guard.ts
type RouteGuard =
    | { allowedRoles: UserRoles[] }   // Whitelist
    | { exceptRoles: UserRoles[] }    // Blacklist
    | { allowedScopes: ... }          // Scope-based
```

#### Protecting Routes

```tsx
// src/router/routes/protected-routes.tsx
defineAuthedRoute({
    name: "Settings",
    path: "/settings",
    Component: SettingsPage,
    guard: {
        allowedRoles: ["Admin"], // Only Admins can access
    },
})
```

#### Checking Access in Components

```tsx
import useGuard from "@/hooks/useGuard";

const MyComponent = () => {
    const { hasRole, hasScopes } = useGuard();

    if (!hasRole("Admin")) {
        return null; // Hide from non-admins
    }

    return <button>Delete System</button>;
};
```

---

## 🧩 Key Architectural Patterns

### Reactive Route Computation

Routes are computed by a **Zustand store** (`router/store.ts`) that subscribes to auth state changes. When a user logs in or out, the route tree is recomputed to include or exclude guarded routes — the `RouterProvider` re-renders with the new route set.

### Service Layer

```
Component  ──▶  TanStack Query hook  ──▶  services/api/*-ep.ts  ──▶  http-service.ts (Axios)
                                                                        │
                                                                   MSW intercepts (dev)
                                                                   Real backend (prod)
```

### Feature Flags

Feature flags are defined in `src/lib/config.ts` and consumed via context:

```tsx
import useFeatureFlag from "@/hooks/useFeatureFlag";

const { isEnabled } = useFeatureFlag("DARK_MODE");
```

Built-in flags: `DARK_MODE`, `COLOR_MODE_DETECTOR`, `NOTIFICATIONS`, `TEST_MODE_BANNER`

### Boolean Expression Guards

Scope guards support complex boolean expressions (AND, OR, NOT) via `src/lib/bool-utils.ts`:

```tsx
guard: {
    allowedScopes: { AND: ["user.view", { OR: ["admin.user", "admin.manager"] }] }
}
```

---

## 📋 Customizing for a New Project

After creating a new repository from this template, follow the setup checklist in [`.github/TEMPLATE_SETUP.md`](.github/TEMPLATE_SETUP.md).

**Quick summary:**
1. Update `package.json` name and `index.html` title
2. Define your roles in `src/types/types.ts` and scopes in `src/types/user-scopes.ts`
3. Update mock users in `src/mocks/fake-store/users.ts`
4. Define your routes in `src/router/routes/protected-routes.tsx`
5. Remove the `TEMPLATE_SETUP.md` file

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines, coding conventions, and the PR process.

---

## 📄 License

This project is provided as a template and may be used and modified freely for internal or commercial projects.
