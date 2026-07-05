import { RouteConfig } from "@/types/route-config";

export interface SideNavBarProps {
    onMobileClose: () => void;
    openMobileNav: boolean;
    routes: RouteConfig[];
    basePath: string;
    logoHref?: string;
}
