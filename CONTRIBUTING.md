# Contributing Guide

Thank you for considering contributing to this React Admin Portal Template! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Convention](#commit-message-convention)
- [Code Style & Linting](#code-style--linting)
- [Project Conventions](#project-conventions)
- [Adding New Features](#adding-new-features)
- [Pull Request Process](#pull-request-process)

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20.x
- **pnpm** (package manager)

### Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/<your-fork>/react-admin-template.git
cd react-admin-template

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local

# 4. Start the dev server
pnpm dev
```

> The template uses MSW (Mock Service Worker) for API mocking, so no external backend is required during development.

---

## Development Workflow

### Available Scripts

| Command              | Description                          |
| -------------------- | ------------------------------------ |
| `pnpm dev`           | Start development server             |
| `pnpm dev:host`      | Start dev server exposed on network  |
| `pnpm build`         | TypeScript check + production build  |
| `pnpm test`          | Run tests with Vitest                |
| `pnpm test:ui`       | Run tests with Vitest UI             |
| `pnpm test:coverage` | Run tests with coverage report       |
| `pnpm lint`          | Lint all files with ESLint           |
| `pnpm lint:fix`      | Auto-fix lint issues                 |
| `pnpm preview`       | Preview production build on port 5173|

### Pre-commit Hooks

This project uses **Husky** + **lint-staged** to automatically lint staged `.js`, `.ts`, `.jsx`, `.tsx` files before every commit. You don't need to set this up manually — it configures itself via the `prepare` script.

---

## Branch Naming Convention

Use the following format:

```
<type>/<short-description>
```

| Type        | Use Case                        |
| ----------- | ------------------------------- |
| `feature/`  | New features                    |
| `fix/`      | Bug fixes                       |
| `refactor/` | Code refactoring                |
| `docs/`     | Documentation changes           |
| `chore/`    | Dependency updates, CI changes  |
| `test/`     | Adding or updating tests        |

**Examples:**
- `feature/user-settings-page`
- `fix/auth-token-refresh`
- `refactor/route-guard-logic`

---

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

**Types:** `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `perf`, `ci`

**Examples:**
```
feat(auth): add remember me checkbox to login form
fix(router): prevent redirect loop on expired session
refactor(hooks): simplify useGuard return type
docs(readme): update project structure section
```

---

## Code Style & Linting

### Formatting

- **Prettier** handles formatting (see `prettier.config.cjs`)
- **4 spaces** indentation
- **Double quotes** for strings and JSX
- **Trailing commas** (`es5`)
- **LF** line endings
- Import sorting is handled automatically by `@ianvs/prettier-plugin-sort-imports`

### Linting

- **ESLint** with a comprehensive ruleset (TypeScript, React, React Hooks, import resolution)
- Warnings for `@typescript-eslint/no-unused-vars` and `@typescript-eslint/no-explicit-any`
- Run `pnpm lint` to check, `pnpm lint:fix` to auto-fix

### Path Aliases

All imports should use the `@/` path alias instead of relative paths:

```tsx
// ✅ Good
import { useAuthStore } from "@/stores/auth-store";

// ❌ Avoid
import { useAuthStore } from "../../../stores/auth-store";
```

---

## Project Conventions

### Component Structure

Each page or complex component should be a **directory** with its own sub-components:

```
src/pages/settings/
├── index.tsx              # Main page component (default export)
├── components/
│   ├── settings-form.tsx
│   └── settings-card.tsx
└── hooks/                 # (optional) page-specific hooks
    └── use-settings.ts
```

### Hooks

- Custom hooks live in `src/hooks/` (global) or co-located inside feature folders
- Prefix all hooks with `use` (e.g., `useGuard`, `useDataTable`)

### Types

- Shared types go in `src/types/`
- Component-specific types should be co-located with the component

### Services & API Layer

- All HTTP calls go through `src/services/http-service.ts` (Axios wrapper)
- Endpoint functions are defined in `src/services/api/` (e.g., `auth-ep.ts`, `user-ep.ts`)
- Data fetching in components uses **TanStack Query** hooks

### State Management

- **Zustand** stores live in `src/stores/`
- Use `subscribeWithSelector` and `devtools` middleware for observability
- URL state uses **nuqs** (type-safe search params)

### UI Components

- Base UI primitives are in `src/components/ui/` (shadcn/ui + Radix UI)
- Composite/reusable components go in `src/components/`
- Do **not** modify shadcn/ui primitives directly — extend them via composition

---

## Adding New Features

### Adding a New Page

1. Create a directory under `src/pages/<page-name>/` with an `index.tsx` default export
2. Add a route in `src/router/routes/protected-routes.tsx` (or `public-routes.tsx`):

```tsx
const MyPage = suspendedComponent(lazy(() => import("@/pages/my-page")));

defineAuthedRoute({
    name: "My Page",
    path: "/my-page",
    icon: <SomeIcon className="h-4 w-4" />,
    Component: MyPage,
    guard: {
        allowedRoles: ["Admin", "Manager"], // optional
    },
})
```

3. Add the route path to `src/constants/route-constants.ts`

### Adding a New API Endpoint

1. Create the endpoint function in `src/services/api/<domain>-ep.ts`
2. Add request/response types in `src/types/request/` and `src/types/response/`
3. Add an MSW handler in `src/mocks/api/` to mock the endpoint during development
4. Add fake data generation in `src/mocks/fake-store/` if needed

### Adding a New Zustand Store

1. Create `src/stores/<store-name>.ts`
2. Use `devtools` and `subscribeWithSelector` middleware
3. Define action names as constants for devtools tracing:

```tsx
const STORE = "my-store";
const Actions = {
    doSomething: `${STORE}/doSomething`,
} as const;
```

### Adding a New Role or Scope

1. Update `UserRoles` in `src/types/types.ts`
2. Update `UserScopes` in `src/types/user-scopes.ts`
3. Update mock users in `src/mocks/fake-store/users.ts`
4. Update default scopes in `src/mocks/api/authHandlers.ts`

---

## Pull Request Process

1. **Create a branch** from `main` using the [branch naming convention](#branch-naming-convention)
2. **Make your changes** following the conventions above
3. **Self-review** your code before opening a PR
4. **Ensure**:
   - `pnpm lint` passes with no errors
   - `pnpm build` succeeds
   - Mock APIs are added for any new endpoints
5. **Open a PR** using the [PR template](/.github/pull_request_template.md) and fill in all sections
6. **Request a review** from a maintainer

### PR Checklist

- [ ] I have performed a self-review of my code
- [ ] I maintain the linting standards
- [ ] I have added mock APIs for my code
- [ ] Breaking changes are flagged in the PR description
- [ ] New types are defined in `src/types/`
- [ ] New pages follow the directory convention

---

## Questions?

If you have questions or need help, open a [GitHub Discussion](https://github.com/your-org/react-admin-template/discussions) or reach out to a maintainer.
