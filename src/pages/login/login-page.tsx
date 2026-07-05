import { FC } from "react";
import { config } from "@/lib/config";

import LoginForm from "./components/login-form";

const LoginPage: FC = () => {
    return (
        <>
            <title>{`Login | ${config.env.APP_TITLE}`}</title>
            <LoginForm />
        </>
    );
};

export default LoginPage;
