import { Home } from "lucide-react";

import PageWithHeaderFooter from "@/layouts/page-with-header-footer";
import { AppLink } from "@/components/form";

function WIP() {
    return (
        <PageWithHeaderFooter>
            <div className="flex h-full flex-col items-center justify-center">
                <h1 className="text-slate-600">Coming Soon</h1>
                <AppLink to="/" icon={<Home />}>
                    Go to Home
                </AppLink>
            </div>
        </PageWithHeaderFooter>
    );
}

export default WIP;
