import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWT_COOKIE_NAMES } from '../auth.constants';
import { JwtPayload } from '../types';

type AccessJwtPayload = Omit<JwtPayload, 'refreshToken'>;

const extractJWT = (req: Request): null | string => {
    if (req.cookies && JWT_COOKIE_NAMES.accessToken in req.cookies) {
        return req.cookies[JWT_COOKIE_NAMES.accessToken] as string;
    }

    return null;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private configService: ConfigService) {
        super({
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromExtractors([extractJWT, ExtractJwt.fromAuthHeaderAsBearerToken()]),
            secretOrKey: configService.get<string>('JWT_ACCESS_SECRET')!,
        });
    }

    validate(payload: AccessJwtPayload) {
        return payload;
    }
}
