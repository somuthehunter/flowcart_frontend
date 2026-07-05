import { useState } from "react";
import { changePassword } from "@/services/api/auth-ep";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ChangePasswordPayload } from "@/types/request/auth-request";

const changePasswordSchema = z
    .object({
        oldPassword: z.string().min(1, "The old password is required"),
        newPassword: z
            .string()
            .min(8, "The password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "The confirm password is required"),
    })
    .refine((d) => d.newPassword !== d.oldPassword, {
        message: "New password must be different",
        path: ["newPassword"],
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const useChangePassword = () => {
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const form = useForm<ChangePasswordPayload>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        mode: "onChange",
    });

    const mutation = useMutation({
        mutationKey: ["auth/password/set"],
        mutationFn: changePassword,
        onSuccess: () => {
            toast.success("Password changed successfully");
            form.reset();
        },
        onError: (err: unknown) => {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to change password";
            toast.error(message);
        },
    });

    return {
        form,
        submit: (payload: ChangePasswordPayload) => mutation.mutate(payload),
        isSubmitting: mutation.isPending,

        showOld,
        setShowOld,
        showNew,
        setShowNew,
        showConfirm,
        setShowConfirm,
    };
};
