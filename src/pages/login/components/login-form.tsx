import { FC } from "react";
import { AlertCircle, Eye, EyeOff, LogIn } from "lucide-react";
import { Link } from "react-router";

import { AppButton, AppInput } from "@/components/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form } from "@/components/ui/form";

import { useLogin } from "../hooks/useLogin";

const LoginForm: FC = () => {
    const {
        formSchema,
        form,
        isPending,
        isPasswordVisible,
        handlePasswordVisibilityToggle,
        onFormSubmit,
    } = useLogin();

    return (
        <Form {...form}>
            <div className="mt-10 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back
                </h1>
                <p className="text-muted-foreground text-sm">
                    Sign in to your account
                </p>
            </div>

            <form
                className="space-y-2"
                onSubmit={form.handleSubmit(onFormSubmit)}>
                {form.formState.errors.root && (
                    <Alert variant="destructive">
                        <AlertCircle />
                        <AlertDescription>
                            {form.formState.errors.root?.message}
                        </AlertDescription>
                    </Alert>
                )}
                <div className="space-y-4">
                    <AppInput
                        size="lg"
                        {...formSchema.email}
                        placeholder="Enter your email address"
                        {...form.register("email", {
                            onChange: () => form.clearErrors("root"),
                        })}
                    />
                    <AppInput
                        size="lg"
                        {...formSchema.password}
                        placeholder="Enter your password"
                        {...form.register("password", {
                            onChange: () => form.clearErrors("root"),
                        })}
                        rightIcon={
                            <AppButton
                                type="button"
                                variant="ghost"
                                onClick={handlePasswordVisibilityToggle}
                                className="cursor-pointer">
                                {isPasswordVisible ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </AppButton>
                        }
                    />
                    <div className="text-right">
                        <Link
                            to="/forgot-password"
                            className="text-muted-foreground font-medium hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <AppButton
                    type="submit"
                    size="lg"
                    loading={isPending}
                    loadingText=" Signing in..."
                    className="mt-4 w-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                </AppButton>
            </form>
        </Form>
    );
};

export default LoginForm;
