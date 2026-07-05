import { RouterProvider } from "react-router";

import AppLoading from "@/components/app-loading";

import { useApp } from "./hooks/use-app";

function App() {
    const { isAuthLoading, router } = useApp();

    if (isAuthLoading) {
        return <AppLoading />;
    }

    return <RouterProvider router={router} />;
}

export default App;
