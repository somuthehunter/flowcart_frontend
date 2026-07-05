import { FC } from "react";
import { getFullBrandLogo } from "@/lib/image-utils";

type AppLoadingProps = {
    loadingText?: string;
};
const AppLoading: FC<AppLoadingProps> = ({
    loadingText = " Loading your workspace",
}) => {
    return (
        <div className="from-background via-background to-muted/20 flex h-screen w-full items-center justify-center bg-linear-to-br">
            <div className="animate-in fade-in flex flex-col items-center gap-6 duration-300">
                <div className="relative">
                    <div className="border-primary/20 border-t-primary absolute inset-0 animate-spin rounded-full border-4" />
                    <img
                        src={getFullBrandLogo("minimal")}
                        alt="Brand Logo"
                        className="h-20 w-20 object-contain p-3"
                    />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground text-sm font-medium">
                        {loadingText}
                    </p>
                    <div className="flex gap-1">
                        <span className="bg-primary h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.3s]" />
                        <span className="bg-primary h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.15s]" />
                        <span className="bg-primary h-1.5 w-1.5 animate-bounce rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppLoading;
