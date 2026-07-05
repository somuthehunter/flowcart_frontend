import { useMemo } from "react";
import { constructPath } from "@/lib/route-utils";

import { RouteConfig } from "@/types/route-config";

import { NavGroup } from "./nav-group";
import { NavItem } from "./nav-item";

export interface NavTreeProps {
    routes: RouteConfig[];
    basePath: string;
    l1Route?: boolean;
}

export default function NavTree({ routes, basePath, l1Route }: NavTreeProps) {
    const filterRoutes = (routes: RouteConfig[]) =>
        routes.filter((route) => !route.bypassDisplay);

    const items = useMemo(() => {
        return filterRoutes(routes || []);
    }, [routes]);

    return (
        <>
            {items.map((item, index) => {
                if (item.isLayout) {
                    const visibleChildren = filterRoutes(item.routes || []);
                    // Skip entirely if the section has no visible children
                    if (visibleChildren.length === 0) return null;

                    const isSectionGroup =
                        item.name && item.name !== "Layout" && !item.Component;

                    return (
                        <div
                            key={index}
                            className={
                                isSectionGroup ? "mt-4 first:mt-0" : undefined
                            }>
                            {isSectionGroup && (
                                <p className="text-sidebar-foreground/50 mb-1 px-2 text-[10px] font-semibold tracking-widest uppercase group-data-[collapsible=icon]:hidden">
                                    {item.name}
                                </p>
                            )}
                            <NavTree
                                routes={item.routes || []}
                                basePath={basePath}
                                l1Route={l1Route}
                            />
                        </div>
                    );
                }

                if (
                    !item.routes ||
                    item.routes.length === 0 ||
                    item.bypassDisplayChildren
                ) {
                    return (
                        <NavItem
                            key={index}
                            item={item}
                            basePath={constructPath(item.path, basePath)}
                            isParentL1={l1Route}>
                            {item.icon}
                            {item.name}
                        </NavItem>
                    );
                }
                return (
                    <NavGroup
                        key={index}
                        item={item}
                        basePath={basePath}
                        isParentL1={l1Route}>
                        <NavTree
                            routes={item.routes || []}
                            basePath={constructPath(item.path, basePath)}
                        />
                    </NavGroup>
                );
            })}
        </>
    );
}
