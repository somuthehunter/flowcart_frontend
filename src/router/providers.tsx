import { FC, PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

import { config } from "@/lib/config";
import queryClient from "@/lib/query-utils";
import { FeatureFlagProvider } from "@/contexts/feature-flag-context";
import { ConfirmationProvider } from "@/contexts/confirmation-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import TestModeBanner from "@/components/ui/test-mode-banner";

export const AppProviders: FC<PropsWithChildren> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
        <FeatureFlagProvider featureFlagSet={config.featureFlags}>
            <ThemeProvider attribute="class" defaultTheme="system">
                <NuqsAdapter>
                    <TooltipProvider delayDuration={0}>
                        <ConfirmationProvider>
                            {children}
                        </ConfirmationProvider>
                    </TooltipProvider>
                </NuqsAdapter>
            </ThemeProvider>
        </FeatureFlagProvider>
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster />
        <TestModeBanner />
    </QueryClientProvider>
);
