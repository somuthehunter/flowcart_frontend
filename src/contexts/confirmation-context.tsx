/* eslint-disable react-refresh/only-export-components */
"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import type { FC, PropsWithChildren, ReactNode } from "react";
import type {
    DefaultValues,
    FieldValues,
    Resolver,
    UseFormReturn,
} from "react-hook-form";

import type { AlertEventType } from "@/types/confirmation";
import ConfirmDialog from "@/components/confirm-dialog";
import FormArea from "@/components/form-area";
import { ButtonProps } from "@/components/ui/button";

export interface ConfirmationState {
    confirm: <Values extends FieldValues = FieldValues>(
        options?: ConfirmationProviderProps<Values>
    ) => Promise<unknown>;
}

export const ConfirmationContext = createContext<ConfirmationState | null>(
    null
);
ConfirmationContext.displayName = "ConfirmationContext";

export function useConfirmationContext() {
    const context = useContext(ConfirmationContext);
    if (!context)
        throw new Error(
            "ConfirmationContext must be used with ConfirmationProvider!"
        );
    return context;
}

export interface ConfirmationProviderProps<
    Values extends FieldValues = FieldValues,
> {
    title?: string;
    description?: ReactNode;
    content?:
        | React.ReactNode
        | null
        | ((form: UseFormReturn<Values, unknown, Values>) => React.ReactNode);
    confirmationText?: string;
    cancellationText?: string;
    allowClose?: boolean;
    hideCancelButton?: boolean;
    resetFormOnCompletetion?: boolean;
    buttonOrder?: [AlertEventType, AlertEventType];
    defaultValues?: Values;
    buttonStyling?: Partial<
        Record<AlertEventType, Pick<ButtonProps, "variant" | "size">>
    >;
    resolver?: Resolver<Values, unknown>;
}

type ConfirmActionFunc<T> = (value?: T) => void;
type RejectActionFunc = (reason?: unknown) => void;

export const ConfirmationProvider = <Values extends FieldValues = FieldValues>(
    props: PropsWithChildren<ConfirmationProviderProps<Values>>
) => {
    const { children, ...restProps } = props;
    // Store options as ConfirmationProviderProps<FieldValues> to allow for generic confirm usage
    const [options, setOptions] = useState<
        ConfirmationProviderProps<FieldValues>
    >({});
    const [resolveReject, setResolveReject] = useState<
        [ConfirmActionFunc<FieldValues>?, RejectActionFunc?]
    >([]);
    const [resolve, reject] = resolveReject;

    const confirm = useCallback(
        <T extends FieldValues = FieldValues>(
            options: ConfirmationProviderProps<T> = {}
        ) => {
            return new Promise((resolve, reject) => {
                setOptions(
                    options as unknown as ConfirmationProviderProps<FieldValues>
                );
                setResolveReject([resolve, reject]);
            });
        },
        []
    );

    const {
        title = "Confirmation",
        description = "",
        content = null,
        confirmationText = "Ok",
        cancellationText = "Cancel",
        allowClose = true,
        hideCancelButton = false,
        resetFormOnCompletetion = false,
        buttonOrder,
        defaultValues,
        buttonStyling,
        resolver,
    } = useMemo(() => ({ ...restProps, ...options }), [restProps, options]);

    const [form, setFormData] =
        useState<UseFormReturn<DefaultValues<Values>, unknown, undefined>>();

    const handleClose = useCallback(() => {
        setResolveReject([]);
        if (resetFormOnCompletetion) {
            // form.resetForm();
            form?.reset((state) => ({ ...state, ...form?.getValues() }));
        }
    }, [resetFormOnCompletetion, form]);

    const handleClick = useCallback(
        (event: AlertEventType) => {
            switch (event) {
                case "confirm":
                    if (resolve) {
                        if (form) {
                            form?.trigger();
                            if (form?.formState.isValid) {
                                resolve(form?.getValues() as Values);
                                handleClose();
                            }
                        } else {
                            resolve();
                            handleClose();
                        }
                    }
                    break;
                case "cancel":
                    if (reject) {
                        reject();
                        handleClose();
                    }
                    break;
                default:
                    break;
            }
        },
        [resolve, reject, handleClose, form]
    );

    const value = useMemo(() => ({ confirm }), [confirm]);
    return (
        <>
            <ConfirmationContext.Provider value={value}>
                {children}
            </ConfirmationContext.Provider>
            <ConfirmDialog
                buttonOrder={buttonOrder}
                title={title}
                description={description}
                cancellationText={cancellationText}
                confirmationText={confirmationText}
                open={resolveReject.length === 2}
                onClose={allowClose ? handleClose : undefined}
                onClick={handleClick}
                style={{ zIndex: 9999 }}
                hideCancelButton={hideCancelButton}
                hideCloseButton={!allowClose}
                buttonStyling={buttonStyling}>
                {defaultValues && resolver && content && (
                    <FormArea
                        defaultValues={defaultValues}
                        resolver={resolver as Resolver<FieldValues, unknown>}
                        onFormStateChange={(f) => {
                            setFormData(f as never);
                        }}
                        onFormUnMount={() => {
                            setFormData(undefined);
                        }}>
                        {content as never}
                    </FormArea>
                )}
            </ConfirmDialog>
        </>
    );
};

interface ConfirmationConsumerProps {
    children: (value: ConfirmationState | null) => ReactNode;
}

export const ConfirmationConsumer: FC<ConfirmationConsumerProps> = ({
    children,
}) => {
    return (
        <ConfirmationContext.Consumer>
            {(context) => {
                if (context === undefined) {
                    throw new Error(
                        "ConfirmationConsumer must be used within a ConfirmationProvider"
                    );
                }
                return children(context);
            }}
        </ConfirmationContext.Consumer>
    );
};
