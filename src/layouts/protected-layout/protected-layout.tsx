import { FC } from "react";
import { Outlet } from "react-router";

/**
 * Thin auth shell — no sidebar or nav here.
 * Each portal (DealerLayout, AdminLayout) handles its own chrome.
 * AuthRoute guards on each child route handle auth + role enforcement.
 */
const ProtectedLayout: FC = () => {
    return <Outlet />;
};

export default ProtectedLayout;
