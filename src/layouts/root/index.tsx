import { Outlet } from "react-router";
import { AppProviders } from "@/router/providers";

const RootLayout = () => {
    return (
        <AppProviders>
            <Outlet />
        </AppProviders>
    );
};

export default RootLayout;
