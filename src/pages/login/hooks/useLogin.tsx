import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import * as z from "zod";

import QueryConst from "@/constants/query-constants";
import { AuthedRoutes } from "@/constants/route-constants";
import useAuth from "@/hooks/use-auth";
import { getRoleHome } from "@/lib/route-utils";
import { useAuthStore } from "@/stores/auth-store";

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(100),
});

type LoginFormType = z.infer<typeof loginSchema>;

export const useLogin = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const { signIn } = useAuth();
    const navigate = useNavigate();

    const form = useForm<LoginFormType>({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(loginSchema),
    });

    const formSchema = {
        email: {
            label: "Email Address",
            name: "email",
        },
        password: {
            label: "Password",
            name: "password",
            type: isPasswordVisible ? "text" : "password",
        },
    };

    const { mutate, isPending } = useMutation({
        mutationKey: [QueryConst.auth.login],
        mutationFn: signIn,
        onSuccess: () => {
            const user = useAuthStore.getState().user;
            if (user) {
                navigate(getRoleHome(user.role));
            } else {
                navigate(AuthedRoutes.home);
            }
        },
        onError: (err) => {
            form.setError("root", {
                message: err?.message,
                type: "onChange",
            });
        },
    });

    const onFormSubmit = (values: LoginFormType) => mutate(values);

    const handlePasswordVisibilityToggle = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    return {
        formSchema,
        isPasswordVisible,
        isPending,
        form,
        onFormSubmit,
        handlePasswordVisibilityToggle,
    };
};
