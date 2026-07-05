import { FC } from "react";
import { ChevronLeft, MailCheck, RotateCcw } from "lucide-react";
import { Link } from "react-router";

import { AppButton, AppInput } from "@/components/form";
import { Form } from "@/components/ui/form";

import { useForgotPassword } from "../hooks/use-forgot-password";

const ForgotPasswordForm: FC = () => {
    const { emailForm, isPending, mailSent, handleSubmit, countdown } =
        useForgotPassword();

    return (
        <div className="space-y-6">
            {mailSent && (
                <div className="bg-card border-success/70 rounded-lg border p-4">
                    <div className="flex items-start gap-3">
                        <MailCheck className="text-success mt-0.5 h-5 w-5" />

                        <div>
                            <p className="text-success text-sm font-medium">
                                We have sent you an email to reset your
                                password. Please check your inbox.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <Form {...emailForm}>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <AppInput
                        size="lg"
                        name="email"
                        label="Email Address"
                        placeholder="john.doe@example.com"
                        className="w-full"
                    />

                    <AppButton
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isPending || (mailSent && countdown > 0)}>
                        {!isPending && <RotateCcw className="mr-2 h-4 w-4" />}
                        {isPending
                            ? "Sending..."
                            : !mailSent
                              ? "Send Reset Link"
                              : countdown > 0
                                ? `Resend in ${countdown}s`
                                : "Resend Reset Link"}
                    </AppButton>
                </form>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">
                        Remember Password?
                    </span>

                    <Link
                        to="/login"
                        className="text-primary flex items-center font-medium hover:underline">
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Back to Login
                    </Link>
                </div>
            </Form>
        </div>
    );
};

export default ForgotPasswordForm;
