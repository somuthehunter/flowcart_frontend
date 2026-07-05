import { useEffect } from "react";
import { Breakpoints } from "@/lib/breakpoints";
import { getRole } from "@/lib/object-utils";
import { useLocation } from "react-router";

import useAuth from "@/hooks/use-auth";
import useFeatureFlag from "@/hooks/useFeatureFlag";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useSidebar } from "@/components/ui/sidebar";

import { SideNavBarProps } from "../models/side-nav-bar-props";

export default function useNavbar(props: SideNavBarProps) {
    const location = useLocation();
    const { open } = useSidebar();
    const isTab = useMediaQuery(Breakpoints.down("md"));
    const { user } = useAuth();
    const isNotificationsEnabled = useFeatureFlag("NOTIFICATIONS");
    const darkModeEnabled = useFeatureFlag("DARK_MODE");

    const { onMobileClose, openMobileNav } = props;
    const shouldBeCollapsed = !isTab;

    useEffect(() => {
        if (openMobileNav && onMobileClose) {
            onMobileClose();
        }
    }, [location.pathname]);

    const toggleCollapse = () => {};

    const getName = () =>
        user?.firstName && user?.lastName
            ? `${user?.firstName} ${user?.lastName}`
            : user?.firstName
              ? user?.firstName
              : "unknown";

    return {
        isTab,
        toggleCollapse,
        shouldBeCollapsed,
        user,
        getName,
        getRole,
        darkModeEnabled,
        isNotificationsEnabled,
        open,
    };
}
