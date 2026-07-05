const QueryConst = {
    auth: {
        login: "auth/login",
        register: "auth/register",
        refreshToken: "auth/refresh",
        logout: "auth/logout",
        profile: "auth/profile",
        changePassword: "auth/change-password",
        forgotPassword: "auth/forgot-password",
        resetPassword: "auth/reset-password",
    },

    user: {
        list: "iam/users",
        create: "iam/users",
        update: "iam/users/:userId",
    },

    role: {
        list: "iam/role-list",
        suggestions: "iam/role-suggestion",
        details: "iam/role/:roleId",
        create: "iam/role",
        update: "iam/role/:roleId",
        delete: "iam/role/:roleId",
    },
    scope: {
        suggestions: "iam/scope-suggestion",
    },
    aiAgent: {
        config: "configuration/ai-agent",
    },
    channels: {
        ownedNumbers: "configuration/channels/phone-numbers",
        availableNumbers: "configuration/channels/phone-numbers/available",
        buyNumber: "configuration/channels/phone-numbers/buy",
        socialConnections: "configuration/channels/social-connections",
        connectSocial: "configuration/channels/social-connections/connect",
        disconnectSocial:
            "configuration/channels/social-connections/disconnect",
        settings: "configuration/channels/settings",
        usageStats: "configuration/channels/usage-stats",
    },
    integrations: {
        list: "configuration/integrations",
        categories: "configuration/integrations/categories",
        connect: "configuration/integrations/connect",
        disconnect: "configuration/integrations/disconnect",
    },
    widget: {
        settings: "configuration/widget",
        forms: "configuration/lead-forms",
    },
    escalation: {
        settings: "configuration/escalation",
        teamMembers: "configuration/team-members",
    },
    dealers: {
        list: "management/list",
        create: "management/create",
        update: "management/update/:dealerId",
        details: "management/details/:dealerId",
    },
    inventory: {
        currentStock: "inventory/stock",
        updateMinMax: "inventory/stock/:id",
        purchase: "inventory/purchase",
        adjust: "inventory/adjust",
        history: "inventory/history",
        ledger: "inventory/ledger",
    },
    products: {
        list: "products",
        create: "products",
        update: "products/:id",
        delete: "products/:id",
        scan: "products/scan",
        exportLabels: "products/export/labels",
        exportCatalog: "products/export/catalog",
        exportExcel: "products/export/excel",
    },
    categories: {
        list: "categories",
        create: "categories",
        update: "categories/:id",
        delete: "categories/:id",
    },
    billing: {
        list: "bills",
        create: "bills",
        details: "bills/:id",
    }
};
export default QueryConst;
