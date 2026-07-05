import { config } from "@/lib/config";

import ResetPasswordForm from "./components/reset-password-form";

const ResetPasswordPage = () => {
    return (
        <>
            <title>{`Reset Password | ${config.env.APP_TITLE}`}</title>

            <div className="mb-6 space-y-2">
                <h1 className="text-xl font-bold tracking-tight">
                    Reset Password
                </h1>

                <p className="text-muted-foreground text-sm">
                    Please enter your new password below.
                </p>
            </div>

            <ResetPasswordForm />
        </>
    );
};

export default ResetPasswordPage;
