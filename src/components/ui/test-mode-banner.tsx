import React from "react";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";

type Corner = "top-right" | "top-left" | "bottom-right" | "bottom-left";

interface TestModeBannerProps {
    position?: Corner;
    label?: string;
    className?: string;
}

const cornerWrapperStyles: Record<Corner, string> = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
};

const rotationStyles: Record<Corner, string> = {
    "top-left": "-rotate-45 -translate-x-[35%] -translate-y-[35%]",
    "top-right": "rotate-45 translate-x-[35%] -translate-y-[35%]",
    "bottom-left": "rotate-45 -translate-x-[35%] translate-y-[35%]",
    "bottom-right": "-rotate-45 translate-x-[35%] translate-y-[35%]",
};

const TestModeBanner: React.FC<TestModeBannerProps> = ({
    position = "top-left",
    label = "Test Mode",
    className,
}) => {
    if (!config.featureFlags.TEST_MODE_BANNER) return null;

    return (
        <div
            className={cn(
                "pointer-events-none fixed z-9999 aspect-square w-52 overflow-hidden",
                cornerWrapperStyles[position],
                className
            )}
            aria-hidden="true"
            role="presentation">
            <div
                className={cn(
                    "absolute inset-0 flex items-center justify-center",
                    rotationStyles[position]
                )}>
                <span className="bg-yellow-500/80 px-16 py-1 text-xs font-bold tracking-wider whitespace-nowrap text-black uppercase shadow-lg">
                    {label}
                </span>
            </div>
        </div>
    );
};

export default TestModeBanner;
