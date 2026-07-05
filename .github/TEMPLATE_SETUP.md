# Template Setup Guide

When you create a new repository from this template, follow this checklist to adapt it to your specific project needs.

## 1. Project Configuration
- [ ] Open `package.json` and change the `"name": "react-admin-template"` to your specific project name.
- [ ] Rename the title inside `index.html` (if you want to hardcode it) or update `VITE_APP_TITLE` in `.env.example`.
- [ ] Copy `.env.example` to `.env.local` to set up your local development environment.

## 2. Types & Roles
- [ ] **Define Roles**: Open `src/types/types.ts` and modify `UserRoles` to match your application's domain objects (e.g., `"SuperAdmin" | "Admin" | "Customer"`).
- [ ] **Define UserTypes**: Update the `UserType` enum in `src/types/response/user-response.ts` to reflect the roles.
- [ ] **Define Scopes**: Open `src/types/user-scopes.ts` and update the `UserScopes` type with the scopes you will actually use.
- [ ] **Update Route Utility**: If you changed the generic admin roles, update `defineRouteWithCommonAdminRole` in `src/lib/route-utils.tsx`.

## 3. Mock Data
- [ ] Open `src/mocks/fake-store/users.ts` and update the test users to map to your new roles.
- [ ] Open `src/mocks/api/authHandlers.ts` to update the default scopes granted upon login.

## 4. Housekeeping
- [ ] Define the actual routes for your application in `src/router/routes/protected-routes.tsx` and `src/router/routes/public-routes.tsx`.
- [ ] (Optional) Delete `src/pages/users` and `src/pages/settings` if you do not want these example pages as your foundation.
- [ ] Remove this file!
