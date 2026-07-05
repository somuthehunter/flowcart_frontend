export type SignInRequest = {
    email: string;
    password: string;
};

export type RespondNewPasswordPayload = {
    username: string;
    newPassword: string;
};

export type ChangePasswordPayload = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};
