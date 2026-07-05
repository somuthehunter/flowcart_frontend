import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./router";
import ErrorBoundary from "./components/error-boundary";
import { bootstrap } from "./lib/bootstrap";

await bootstrap();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </StrictMode>
);
