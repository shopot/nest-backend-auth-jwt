export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    userId: string;
}

export interface JwtPayload {
    refreshToken?: string;
    sub?: number;
    username?: string;
}
