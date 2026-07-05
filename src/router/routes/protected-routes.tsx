import { lazy } from "react";
import {
    defineAuthedRoute,
    defineInvisibleRoute,
    defineLayoutRoute,
    suspendedComponent,
} from "@/lib/route-utils";
import {
    Activity,
    Bot,
    Building2,
    FileText,
    LayoutDashboard,
    Settings,
    Shield,
    Users,
    Package,
    Box,
    Tags,
    Receipt
} from "lucide-react";

import { RouteConfig } from "@/types/route-config";
import { AdminRoutes, AuthedRoutes } from "@/constants/route-constants";
import AdminLayout from "@/layouts/admin-layout";
import MerchantLayout from "@/layouts/merchant-layout";

import { configurationRoutes } from "./configurations-routes";

const AccountPage = suspendedComponent(lazy(() => import("@/pages/profile")));
const DashboardPage = suspendedComponent(
    lazy(() => import("@/pages/dashboard"))
);
const UsersPage = suspendedComponent(
    lazy(() => import("@/pages/user-management/users"))
);
const RolesPage = suspendedComponent(
    lazy(() => import("@/pages/user-management/roles"))
);
const MerchantPage = suspendedComponent(
    lazy(() => import("@/pages/merchant-management/merchant-list"))
);
const MerchantOnboardingPage = suspendedComponent(
    lazy(() => import("@/pages/merchant-management/onboarding"))
);
const MerchantDetailsPage = suspendedComponent(
    lazy(() => import("@/pages/merchant-management/details"))
);
const InventoryPage = suspendedComponent(
    lazy(() => import("@/pages/inventory"))
);
const ProductsPage = suspendedComponent(
    lazy(() => import("@/pages/products"))
);
const CategoriesPage = suspendedComponent(
    lazy(() => import("@/pages/categories"))
);
const CheckoutPage = suspendedComponent(
    lazy(() => import("@/pages/checkout"))
);

const WIPPage = suspendedComponent(lazy(() => import("@/pages/wip")));

export const protectedRoutes: RouteConfig[] = [
    // ─── Merchant portal (pathless layout group) ───────────────────────────────
    defineLayoutRoute({
        Component: MerchantLayout,
        routes: [
            defineAuthedRoute({
                name: "Dashboard",
                path: AuthedRoutes.home,
                icon: <LayoutDashboard className="h-4 w-4" />,
                Component: DashboardPage,
                guard: { allowedRoles: ["Merchant Owner", "Store Manager", "Platform Admin"] },
            }),
            defineAuthedRoute({
                name: "Checkout",
                path: AuthedRoutes.checkout,
                icon: <Receipt className="h-4 w-4" />,
                Component: CheckoutPage,
                guard: { allowedRoles: ["Merchant Owner", "Store Manager", "Cashier", "Platform Admin"] },
            }),
            defineAuthedRoute({
                name: "Orders",
                path: AuthedRoutes.orders,
                icon: <FileText className="h-4 w-4" />,
                Component: WIPPage,
                guard: { allowedRoles: ["Merchant Owner", "Store Manager", "Cashier", "Platform Admin"] },
            }),
            defineAuthedRoute({
                name: "Customers",
                path: AuthedRoutes.customers,
                icon: <Users className="h-4 w-4" />,
                Component: WIPPage,
                guard: { allowedRoles: ["Merchant Owner", "Store Manager", "Platform Admin"] },
            }),
            defineAuthedRoute({
                name: "Products",
                path: AuthedRoutes.products,
                icon: <Box className="h-4 w-4" />,
                Component: ProductsPage,
                guard: { allowedRoles: ["Merchant Owner", "Store Manager", "Platform Admin"] },
            }),
            defineAuthedRoute({
                name: "Categories",
                path: AuthedRoutes.categories,
                icon: <Tags className="h-4 w-4" />,
                Component: CategoriesPage,
                guard: { allowedRoles: ["Merchant Owner", "Store Manager", "Platform Admin"] },
            }),
            defineAuthedRoute({
                name: "Inventory",
                path: AuthedRoutes.inventory,
                icon: <Package className="h-4 w-4" />,
                Component: InventoryPage,
                guard: { allowedRoles: ["Merchant Owner", "Store Manager", "Platform Admin"] },
            }),
            defineAuthedRoute({
                name: "Staff",
                path: AuthedRoutes.staff,
                icon: <Shield className="h-4 w-4" />,
                Component: WIPPage,
                guard: { allowedRoles: ["Merchant Owner", "Platform Admin"] },
            }),
            defineAuthedRoute({
                name: "Reports",
                path: AuthedRoutes.reports,
                icon: <Activity className="h-4 w-4" />,
                Component: WIPPage,
                guard: { allowedRoles: ["Merchant Owner", "Store Manager", "Platform Admin"] },
            }),
            defineAuthedRoute({
                name: "Settings",
                path: AuthedRoutes.configuration.index,
                icon: <Settings className="h-4 w-4" />,
                Component: WIPPage,
                guard: { allowedRoles: ["Merchant Owner", "Platform Admin"] },
            }),
        ],
    }),

    // ─── Admin portal (pathless layout group) ────────────────────────────────
    defineLayoutRoute({
        Component: AdminLayout,
        routes: [
            defineAuthedRoute({
                name: "Dashboard",
                path: AdminRoutes.dashboard,
                icon: <LayoutDashboard className="h-4 w-4" />,
                Component: WIPPage,
                guard: { allowedRoles: ["Platform Admin"] },
            }),
            defineAuthedRoute({
                name: "Merchants",
                path: AdminRoutes.merchants.list,
                icon: <Building2 className="h-4 w-4" />,
                Component: MerchantPage,
                guard: { allowedRoles: ["Platform Admin"] },
            }),
            defineInvisibleRoute(
                defineAuthedRoute({
                    name: "Create Merchant",
                    path: AdminRoutes.merchants.create,
                    Component: MerchantOnboardingPage,
                    guard: { allowedRoles: ["Platform Admin"] },
                })
            ),
            defineInvisibleRoute(
                defineAuthedRoute({
                    name: "Merchant Details",
                    path: AdminRoutes.merchants.details,
                    Component: MerchantDetailsPage,
                    guard: { allowedRoles: ["Platform Admin"] },
                })
            ),
            defineAuthedRoute({
                name: "Subscriptions",
                path: AdminRoutes.subscriptions,
                icon: <FileText className="h-4 w-4" />,
                Component: WIPPage,
                guard: { allowedRoles: ["Platform Admin"] },
            }),
            defineAuthedRoute({
                name: "Plans",
                path: AdminRoutes.plans,
                icon: <Box className="h-4 w-4" />,
                Component: WIPPage,
                guard: { allowedRoles: ["Platform Admin"] },
            }),
            defineAuthedRoute({
                name: "Users",
                path: AdminRoutes.users,
                icon: <Users className="h-4 w-4" />,
                Component: UsersPage,
                guard: { allowedRoles: ["Platform Admin"] },
            }),
            defineAuthedRoute({
                name: "Support",
                path: AdminRoutes.support,
                icon: <Activity className="h-4 w-4" />,
                Component: WIPPage,
                guard: { allowedRoles: ["Platform Admin"] },
            }),
            defineAuthedRoute({
                name: "Audit Logs",
                path: AdminRoutes.auditLog,
                icon: <FileText className="h-4 w-4" />,
                Component: WIPPage,
                guard: { allowedRoles: ["Platform Admin"] },
            }),
            defineAuthedRoute({
                name: "System Health",
                path: AdminRoutes.health,
                icon: <Activity className="h-4 w-4" />,
                Component: WIPPage,
                guard: { allowedRoles: ["Platform Admin"] },
            }),
            defineAuthedRoute({
                name: "Platform Settings",
                path: AdminRoutes.configuration,
                icon: <Settings className="h-4 w-4" />,
                Component: WIPPage,
                guard: { allowedRoles: ["Platform Admin"] },
            }),
        ],
    }),

    // ─── Shared invisible routes (no portal layout) ───────────────────────────
    defineInvisibleRoute(
        defineAuthedRoute({
            name: "Account",
            path: AuthedRoutes.account,
            Component: AccountPage,
            title: "Account",
        })
    ),
];
