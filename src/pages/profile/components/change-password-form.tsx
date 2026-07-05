import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { AppButton, AppInput } from "@/components/form";
import { Form } from "@/components/ui/form";

import { useChangePassword } from "../hooks/use-change-password";

const ChangePasswordForm = () => {
    const {
        form,
        submit,
        isSubmitting,
        showOld,
        setShowOld,
        showNew,
        setShowNew,
        showConfirm,
        setShowConfirm,
    } = useChangePassword();

    return (
        <Form {...form}>
            <form
                className="flex flex-col gap-3"
                onSubmit={form.handleSubmit(submit)}>
                <AppInput
                    name="oldPassword"
                    label="Current Password"
                    type={showOld ? "text" : "password"}
                    placeholder="Enter your old password"
                    rightIcon={
                        <AppButton
                            type="button"
                            variant="ghost"
                            onClick={() => setShowOld((v) => !v)}>
                            {showOld ? (
                                <EyeClosedIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </AppButton>
                    }
                />

                <AppInput
                    name="newPassword"
                    label="New Password"
                    type={showNew ? "text" : "password"}
                    placeholder="Enter your new password"
                    rightIcon={
                        <AppButton
                            type="button"
                            variant="ghost"
                            onClick={() => setShowNew((v) => !v)}>
                            {showNew ? (
                                <EyeClosedIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </AppButton>
                    }
                />

                <AppInput
                    name="confirmPassword"
                    label="Confirm New Password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your new password"
                    rightIcon={
                        <AppButton
                            type="button"
                            variant="ghost"
                            onClick={() => setShowConfirm((v) => !v)}>
                            {showConfirm ? (
                                <EyeClosedIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </AppButton>
                    }
                />

                <AppButton
                    type="submit"
                    loading={isSubmitting}
                    className="mt-2 w-full">
                    Submit
                </AppButton>
            </form>
        </Form>
    );
};

export default ChangePasswordForm;
