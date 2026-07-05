/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    FC,
    PropsWithChildren,
    ReactNode,
    useContext,
    useMemo,
} from "react";
import { useMatches } from "react-router";

import { PageRenderData } from "@/types/page-render-data";

export interface PageRenderContextState {
    pageRenderData: PageRenderData;
    crumbs: { label: string; pathname: string }[];
}

export const PageRenderContext = createContext<PageRenderContextState | null>(
    null
);
PageRenderContext.displayName = "PageRenderContext";

export function usePageRenderContext() {
    const context = useContext(PageRenderContext);
    if (!context)
        throw new Error(
            "PageRenderContext must be used with PageRenderProvider!"
        );
    return context;
}

interface PageRenderProviderProps {
    pageRenderData: PageRenderData;
}

export const PageRenderProvider: FC<
    PropsWithChildren<PageRenderProviderProps>
> = (props) => {
    const { children, pageRenderData } = props;
    const matches = useMatches();

    const crumbs = matches
        .filter((m) => (m.handle as { crumb: string })?.crumb)
        .map((m) => ({
            label: (m.handle as { crumb: string }).crumb,
            pathname: m.pathname,
        }));
        
    const value = useMemo(
        () => ({ pageRenderData, crumbs }),
        [crumbs, pageRenderData]
    );
    return (
        <PageRenderContext.Provider value={value}>
            {children}
        </PageRenderContext.Provider>
    );
};

interface PageRenderConsumerProps {
    children: (value: PageRenderContextState | null) => ReactNode;
}

export const PageRenderConsumer: FC<PageRenderConsumerProps> = ({
    children,
}) => {
    return (
        <PageRenderContext.Consumer>
            {(context) => {
                if (context === undefined) {
                    throw new Error(
                        "PageRenderConsumer must be used within a PageRenderProvider"
                    );
                }
                return children(context);
            }}
        </PageRenderContext.Consumer>
    );
};
