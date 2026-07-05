import { FC } from "react";
import { Eye, EyeOff, RefreshCcw } from "lucide-react";

import { AppButton, AppInput } from "@/components/form";
import { Form } from "@/components/ui/form";

import { useResetPassword } from "../hooks/use-reset-password";

const ResetPasswordForm: FC = () => {
    const {
        form,
        handleSubmit,
        isPending,
        showNewPassword,
        showConfirmPassword,
        toggleNewPassword,
        toggleConfirmPassword,
    } = useResetPassword();

    return (
        <Form {...form}>
            <form className="space-y-5" onSubmit={handleSubmit}>
                <AppInput
                    size="lg"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    label="New Password"
                    placeholder="Enter new password"
                    className="w-full"
                    rightIcon={
                        <AppButton
                            type="button"
                            variant="ghost"
                            onClick={toggleNewPassword}
                            className="cursor-pointer px-2">
                            {showNewPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </AppButton>
                    }
                />
                <AppInput
                    size="lg"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    label="Confirm Password"
                    placeholder="Confirm new password"
                    className="w-full"
                    rightIcon={
                        <AppButton
                            type="button"
                            variant="ghost"
                            onClick={toggleConfirmPassword}
                            className="cursor-pointer px-2">
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </AppButton>
                    }
                />
                <AppButton
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isPending}>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    {isPending ? "Resetting..." : "Reset Password"}
                </AppButton>
            </form>
        </Form>
    );
};

export default ResetPasswordForm;
