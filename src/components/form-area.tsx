import { useEffect, type ReactNode } from "react";
import type {
    DefaultValues,
    FieldValues,
    Resolver,
    UseFormReturn,
} from "react-hook-form";
import { useForm } from "react-hook-form";

interface FormAreaProps<Values extends FieldValues = FieldValues> {
    defaultValues: DefaultValues<Values>;
    resolver: Resolver<Values>;
    children: ReactNode | ((form: UseFormReturn<Values>) => ReactNode);
    onFormStateChange: (form: UseFormReturn<Values>) => void;
    onFormUnMount: () => void;
}

const FormArea = <Values extends FieldValues = FieldValues>({
    defaultValues,
    resolver,
    children,
    onFormStateChange,
    onFormUnMount,
}: FormAreaProps<Values>) => {
    const form = useForm<Values>({
        resolver,
        defaultValues,
        mode: "onChange",
    });

    useEffect(() => {
        onFormStateChange(form);
        return () => {
            onFormUnMount();
        };
    }, [form.formState.isValid]);

    if (typeof children === "function") return children(form);

    return children;
};

export default FormArea;
