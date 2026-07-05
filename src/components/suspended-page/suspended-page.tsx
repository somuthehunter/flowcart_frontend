import { FC, PropsWithChildren, ReactNode, Suspense } from "react";

import AppLoading from "../app-loading";

type SuspendedPageProps = PropsWithChildren & {
    loadingComponent?: ReactNode;
    loadingText?: string;
};
const SuspendedPage: FC<SuspendedPageProps> = ({
    loadingComponent,
    loadingText,
    children,
}) => (
    <Suspense
        fallback={
            loadingComponent ?? (
                <AppLoading loadingText={loadingText ?? "Loading..."} />
            )
        }>
        {children}
    </Suspense>
);

export default SuspendedPage;
