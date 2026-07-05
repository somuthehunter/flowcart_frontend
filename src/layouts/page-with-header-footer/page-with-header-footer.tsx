import { Children, PropsWithChildren, ReactElement, ReactNode } from "react";
import { Breakpoints } from "@/lib/breakpoints";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";
import flattenChildren from "react-keyed-flatten-children";

import { usePageRenderContext } from "@/contexts/page-render-context";
import useMediaQuery from "@/hooks/useMediaQuery";
import ErrorBoundary from "@/components/error-boundary";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface ClassNames {
    header?: string;
    body?: string;
    footer?: string;
}

export interface PageWithHeaderFooterProps {
    title?: string;
    description?: string | ReactNode;
    classes?: ClassNames;
    errorResetKeys?: unknown[];
    hideHeader?: boolean;
    onReset?: (...args: unknown[]) => void;
    maxWidth?:
        | "full"
        | "7xl"
        | "6xl"
        | "5xl"
        | "4xl"
        | "3xl"
        | "2xl"
        | "xl"
        | "lg";
}

const PageWithHeaderFooter = ({
    title,
    description,
    children,
    errorResetKeys,
    onReset,
    classes,
    maxWidth = "full",
    hideHeader = false,
}: PropsWithChildren<PageWithHeaderFooterProps>) => {
    const { pageRenderData } = usePageRenderContext();
    const isTab = useMediaQuery(Breakpoints.down("md"));
    const pageTitle =
        title ||
        pageRenderData?.title ||
        pageRenderData.pageHeader ||
        pageRenderData.name;

    const maxWidthClasses = {
        full: "max-w-full",
        "7xl": "max-w-7xl",
        "6xl": "max-w-6xl",
        "5xl": "max-w-5xl",
        "4xl": "max-w-4xl",
        "3xl": "max-w-3xl",
        "2xl": "max-w-2xl",
        xl: "max-w-xl",
        lg: "max-w-lg",
    };

    return (
        <>
            <title>{`${pageTitle} | ${config.env.APP_TITLE}`}</title>
            <div
                className={cn(
                    "mx-auto flex min-h-[98.2vh] w-full min-w-0 flex-col",
                    maxWidthClasses[maxWidth]
                )}>
                {!hideHeader && (
                    <div
                        className={cn(
                            "bg-card sticky top-0 z-20 flex min-h-14 items-start gap-2 px-6 py-3",
                            classes?.header
                        )}>
                        {isTab && <SidebarTrigger />}
                        <div className="flex min-h-8 grow flex-row flex-wrap items-center justify-between">
                            <div className="flex flex-col justify-center gap-1">
                                <div className="text-muted-foreground flex items-center gap-1.5 text-base font-medium">
                                    <span className="text-foreground">
                                        {pageTitle}
                                    </span>
                                </div>
                                {description && (
                                    <div className="text-muted-foreground text-xs font-normal">
                                        {description}
                                    </div>
                                )}
                            </div>
                            {flattenChildren(children, 1).find((child) => {
                                const item =
                                    child as ReactElement<PropsWithChildren>;

                                return item.type === HeaderActions;
                            })}
                        </div>
                    </div>
                )}
                <ErrorBoundary resetKeys={errorResetKeys} onReset={onReset}>
                    <div
                        className={cn(
                            "h-full min-h-0 min-w-0 p-6 pb-2",
                            classes?.body
                        )}>
                        {Children.map(children, (child) => {
                            const item =
                                child as ReactElement<PropsWithChildren>;

                            if (item?.type !== HeaderActions) return item;
                            return null;
                        })}
                    </div>
                </ErrorBoundary>
                <footer
                    className={cn(
                        "bg-background px-8 py-3 text-xs",
                        classes?.footer
                    )}>
                    Copyright © {new Date().getFullYear()}{" "}
                    {config.env.APP_TITLE} - All Rights Reserved.
                </footer>
            </div>
        </>
    );
};

interface HeaderActionsProps {
    className?: string;
}

const HeaderActions = ({
    children,
    className,
}: PropsWithChildren<HeaderActionsProps>) => {
    return <div className={cn("flex", className)}>{children}</div>;
};

export const PWHFHeaderActions = HeaderActions;

export default PageWithHeaderFooter;
