// These routes can't be open if the user is authed.
export const NonAuthedRoutes = {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    setNewPassword: "/set-new-password",
    resetPassword: "/reset-password/:hash?",
};

export const AuthedRoutes = {
    home: "/dashboard",
    account: "/account",
    checkout: "/checkout",
    orders: "/orders",
    customers: "/customers",
    users: {
        index: "/users",
        roles: "roles",
    },
    roles: {
        index: "/roles",
    },
    changePassword: "/change-password",
    configuration: {
        index: "/settings",
        aiAgents: "ai-agents",
        widget: "widget",
        settings: "settings",
        channels: "channels",
        integrations: "integrations",
    },
    inventory: "/inventory",
    products: "/products",
    categories: "/categories",
    staff: "/staff",
    reports: "/reports",
};

export const PublicRoutes = {
    billing: "/account/billing",
};

export const AdminRoutes = {
    dashboard: "/admin/dashboard",
    health: "/admin/system-health",
    subscriptions: "/admin/subscriptions",
    plans: "/admin/plans",
    users: "/admin/users",
    support: "/admin/support",
    auditLog: "/admin/audit-log",
    configuration: "/admin/platform-settings",
    merchants: {
        list: "/admin/merchants",
        create: "/admin/merchants/create",
        update: "/admin/merchants/update/:merchantId",
        details: "/admin/merchants/:merchantId",
    },
};
