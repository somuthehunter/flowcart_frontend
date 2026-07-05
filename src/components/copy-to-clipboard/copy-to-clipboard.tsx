import { useCallback, useEffect, useState } from "react";
import { copyToClipBoard } from "@/lib/object-utils";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { AppButton } from "../form";

interface CopyToClipboardProps {
    copy?: string;
    size?: "sm" | "md" | "lg" | "icon";
    className?: string;
    copyTitle?: string;
    copiedTitle?: string;
}

const CopyToClipboard = (props: CopyToClipboardProps) => {
    const {
        copy,
        className,
        size = "icon",
        copyTitle = "Copy",
        copiedTitle = "Copied",
    } = props;
    const [isCopied, setIsCopied] = useState(false);
    const [open, setOpen] = useState(false); // 👈 manually control tooltip open/close

    useEffect(() => {
        if (!isCopied) return;

        // Show tooltip immediately after copying
        setOpen(true);

        const timeout = setTimeout(() => {
            setIsCopied(false);
            setOpen(false); // close tooltip after 2s
        }, 2000);

        return () => clearTimeout(timeout);
    }, [isCopied]);

    const onClick = useCallback(() => {
        if (copy) {
            copyToClipBoard(copy);
            setIsCopied(true);
        }
    }, [copy]);

    const getIconSize = () => {
        switch (size) {
            case "sm":
                return 14;
            case "lg":
                return 20;
            default:
                return 16;
        }
    };

    return (
        <Tooltip open={open} onOpenChange={setOpen}>
            <TooltipTrigger asChild>
                <AppButton
                    type="button"
                    variant="ghost"
                    size={size}
                    className={cn("shrink-0", className)}
                    onClick={onClick}
                    onMouseEnter={() => !isCopied && setOpen(true)} // show "Copy"
                    onMouseLeave={() => setOpen(false)} // hide when leaving
                >
                    {isCopied ? (
                        <Check className="text-primary" size={getIconSize()} />
                    ) : (
                        <Copy size={getIconSize()} />
                    )}
                </AppButton>
            </TooltipTrigger>
            <TooltipContent>
                <p>{isCopied ? copiedTitle : copyTitle}</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default CopyToClipboard;
