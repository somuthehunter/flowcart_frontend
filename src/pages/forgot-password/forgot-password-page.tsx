import { config } from "@/lib/config";

import ForgotPasswordForm from "./components/forgot-password-form";

const ForgotPasswordPage = () => {
    return (
        <>
            <title>{`Forgot Password | ${config.env.APP_TITLE}`}</title>

            <div className="mt-10 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Forgot Password
                </h1>
                <p className="text-muted-foreground text-sm">
                    Enter your email and we’ll send you a reset link
                </p>
            </div>

            <ForgotPasswordForm />
        </>
    );
};

export default ForgotPasswordPage;
