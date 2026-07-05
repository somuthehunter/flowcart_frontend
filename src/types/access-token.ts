export interface AccessToken {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
}

export type AccessTokenPayload = {
    id: string;
    given_name: string;
    family_name: string;
    email: string;
    phone_number: string;
    role_id: string;
    entity_id: string;
    user_type: string;
    profile_image_url: string;
    scp: string[];
    jti: string;
    exp: number;
    iss: string;
    aud: string;
};
