import { useState } from "react";
import { forgotPassword } from "@/services/api/auth-ep";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useCountdown } from "@/hooks/useCountDown";


const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

export const useForgotPassword = () => {
    const [mailSent, setMailSent] = useState(false);

    const [countdown, { startCountdown }] = useCountdown({
        countStart: 60,
    });

    const emailForm = useForm<ForgotPasswordSchemaType>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (data: ForgotPasswordSchemaType) =>
            forgotPassword(data.email),

        onSuccess: (response) => {
            toast.success(response?.message || "Reset password mail sent");
            setMailSent(true);
            startCountdown();
        },

        onError: (error) => {
            toast.error(error?.message || "Failed to send reset mail");
        },
    });

    const handleSubmit = emailForm.handleSubmit((data) => {
        if (mailSent && countdown > 0) return;
        mutate(data);
    });

    return {
        emailForm,
        handleSubmit,
        isPending,
        mailSent,
        countdown,
    };
};
