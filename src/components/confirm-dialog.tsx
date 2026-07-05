import type { PropsWithChildren, ReactNode } from "react";
import React from "react";

import type { AlertEventType } from "@/types/confirmation";

import { Button, ButtonProps } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";

interface ConfirmDialogProps {
    title?: string;
    description?: ReactNode;
    open?: boolean;
    onClose?: (open: boolean) => void;
    onClick?: (event: AlertEventType) => void;
    confirmationText?: string;
    cancellationText?: string;
    buttonOrder?: [AlertEventType, AlertEventType];
    hideCancelButton?: boolean;
    hideCloseButton?: boolean;
    buttonStyling?: Partial<
        Record<AlertEventType, Pick<ButtonProps, "variant" | "size">>
    >;
    style?: React.CSSProperties;
}

const ConfirmDialog = (props: PropsWithChildren<ConfirmDialogProps>) => {
    const {
        title,
        description,
        onClick,
        onClose,
        children,
        confirmationText = "Yes",
        cancellationText = "No",
        buttonOrder = ["confirm", "cancel"],
        hideCancelButton = false,
        hideCloseButton = false,
        buttonStyling = {
            confirm: { variant: "ghost", size: "sm" },
            cancel: { variant: "default", size: "sm" },
        },
        ...rest
    } = props;
    const handleClick = (event: AlertEventType) => () =>
        onClick?.call(this, event);
    return (
        <Dialog {...rest} onOpenChange={onClose}>
            <DialogContent
                className="max-w-[89vw] sm:max-w-[425px]"
                showCloseButton={!hideCloseButton}>
                <DialogHeader>
                    <DialogTitle>{title || "Confirmation"}</DialogTitle>
                    <DialogDescription>
                        {description || "Do you want to proceed?"}
                    </DialogDescription>
                </DialogHeader>
                {children && <div className="w-full">{children}</div>}
                <DialogFooter>
                    {buttonOrder.map((type) => {
                        if (type === "cancel") {
                            return (
                                !hideCancelButton && (
                                    <Button
                                        onClick={handleClick("cancel")}
                                        size={"sm"}
                                        key={type}
                                        {...buttonStyling?.[type]}>
                                        {cancellationText}
                                    </Button>
                                )
                            );
                        }
                        if (type === "confirm") {
                            return (
                                <Button
                                    onClick={handleClick("confirm")}
                                    variant="ghost"
                                    size={"sm"}
                                    key={type}
                                    {...buttonStyling?.[type]}>
                                    {confirmationText}
                                </Button>
                            );
                        }
                        return null;
                    })}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDialog;
