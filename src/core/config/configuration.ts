import { safeParseInt } from '../utils';

export const configuration = () => ({
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? 'jwt_access_secret',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? 'jwt_refresh_secret',
    port: safeParseInt(process.env.PORT, 3000),
});
