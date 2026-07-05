import React from "react";
import { getFullBrandLogo } from "@/lib/image-utils";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

import { AuthedRoutes } from "@/constants/route-constants";

export interface BrandLogoProps {
    minimal?: boolean;
    className?: string;
    classes?: {
        root?: string;
        container?: string;
    };
    isLink?: boolean;
    href?: string;
    fullLogoType?: "normal" | "white";
    badge?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({
    minimal = false,
    className,
    isLink = true,
    href = AuthedRoutes.home,
    fullLogoType = "white",
    classes,
    badge,
}) => {
    const content = (
        <div
            className={cn(
                "my-0 overflow-hidden transition-[height] duration-300 ease-in-out",
                minimal ? "h-10 w-8" : "h-14 w-full",
                classes?.container
            )}>
            <img
                alt="Brand Logo"
                className={cn(
                    "h-full w-full",
                    minimal ? "object-cover" : "object-contain",
                    "filter-[drop-shadow(0_0_1px_rgba(255,255,255,0.9))_drop-shadow(0_0_2px_rgba(255,255,255,0.4))]"
                )}
                src={getFullBrandLogo(minimal ? "minimal" : fullLogoType)}
            />
        </div>
    );
    return (
        <div className={cn("brand-logo", className, classes?.root)}>
            {isLink ? (
                <Link className="no-underline" to={href}>
                    {content}
                </Link>
            ) : (
                content
            )}
            {badge && !minimal && (
                <span className="text-accent mt-0.5 block text-center text-[9px] font-bold tracking-[0.2em] uppercase">
                    {badge}
                </span>
            )}
        </div>
    );
};

export default BrandLogo;
