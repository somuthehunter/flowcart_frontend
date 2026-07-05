import { useState } from "react";
import { resetPassword } from "@/services/api/auth-ep";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import * as z from "zod";

import QueryConst from "@/constants/query-constants";
import { NonAuthedRoutes } from "@/constants/route-constants";

const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

export const useResetPassword = () => {
    const navigate = useNavigate();

    const [token] = useQueryState("token");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<ResetPasswordSchemaType>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const toggleNewPassword = () => {
        setShowNewPassword((prev) => !prev);
    };

    const toggleConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const { mutate, isPending } = useMutation({
        mutationKey: [QueryConst.auth.resetPassword],
        mutationFn: (data: ResetPasswordSchemaType) =>
            resetPassword(token ?? "", data.newPassword),

        onSuccess: (response) => {
            toast.success(response?.message || "Password reset successfully");
            navigate(NonAuthedRoutes.login);
        },

        onError: (error) => {
            toast.error(error?.message || "Failed to reset password");
        },
    });

    const handleSubmit = form.handleSubmit((data) => {
        if (!token) {
            toast.error(
                "Your reset link has expired or is invalid. Please try the process again."
            );
            return;
        }

        mutate(data);
    });

    return {
        form,
        handleSubmit,
        isPending,
        showNewPassword,
        showConfirmPassword,
        toggleNewPassword,
        toggleConfirmPassword,
    };
};
