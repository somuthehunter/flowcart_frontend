export type SignInResponse = {
    success: boolean;
    message: string | null;
    data: {
        merchant: any;
        accessToken: string;
        refreshToken: string;
    };
};

export type RefreshTokenResponse = {
    accessToken: string;
    refreshToken: string;
};
