import { FC, PropsWithChildren } from "react";
import { Outlet } from "react-router";

import BrandLogo from "../protected-layout/components/brand-logo";
import { LeftPanel } from "./left-panel";

const PublicLayout: FC<PropsWithChildren> = () => {
    return (
        <div className="flex h-screen w-full">
            <div className="relative hidden flex-col overflow-hidden lg:flex lg:w-[60%]">
                <LeftPanel />
            </div>

            <div className="bg-background flex flex-1 items-center justify-center p-6">
                <div className="w-full max-w-md space-y-6">
                    {/* Mobile logo */}
                    <div className="mb-8 lg:hidden">
                        <BrandLogo isLink={false} />
                    </div>

                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default PublicLayout;
