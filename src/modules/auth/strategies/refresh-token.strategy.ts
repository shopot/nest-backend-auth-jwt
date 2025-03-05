import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWT_COOKIE_NAMES } from '../auth.constants';
import { JwtPayload } from '../types';

const extractJWT = (req: Request): null | string => {
    if (req.cookies && JWT_COOKIE_NAMES.refreshToken in req.cookies) {
        return req.cookies[JWT_COOKIE_NAMES.refreshToken] as string;
    }

    return null;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private configService: ConfigService) {
        super({
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromExtractors([extractJWT, ExtractJwt.fromAuthHeaderAsBearerToken()]),
            passReqToCallback: true,
            secretOrKey: configService.get<string>('JWT_REFRESH_SECRET')!,
        });
    }

    validate(req: Request, payload: JwtPayload) {
        const refreshToken = req.cookies.refresh as string;

        return { ...payload, refreshToken };
    }
}
