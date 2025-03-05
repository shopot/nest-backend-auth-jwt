import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CookieOptions, Response } from 'express';

import { UsersService } from '#modules/users';

import { JWT_COOKIE_NAMES, SALT_OR_ROUNDS } from './auth.constants';
import { AuthDto } from './auth.dto';
import { AuthTokens } from './types';

const authCookieOptions: CookieOptions = {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
};

const clearCookieOptions = {
    signed: true,
    ...authCookieOptions,
};

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}
    clearAuthCookie(res: Response) {
        // Delete auth cookie and refresh cookie
        res.clearCookie(JWT_COOKIE_NAMES.accessToken, clearCookieOptions)
            .clearCookie(JWT_COOKIE_NAMES.refreshToken, clearCookieOptions)
            .clearCookie('userId', clearCookieOptions);
    }

    async getTokens(userId: string, username: string): Promise<AuthTokens> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username,
                },
                {
                    expiresIn: '15m',
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                }
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username,
                },
                {
                    expiresIn: '7d',
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                }
            ),
        ]);

        return {
            accessToken,
            refreshToken,
            userId,
        };
    }

    async getUserProfile(userId: string) {
        const { id, username } = await this.usersService.findOne({ id: userId });

        return { id, username };
    }

    async hashData(data: string) {
        const hash = await bcrypt.hash(data, SALT_OR_ROUNDS);

        return hash;
    }

    async logout(userId: string) {
        await this.usersService.update({ id: userId, refreshToken: 'undefined' });
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.usersService.findOne({ id: userId });

        if (!user || !user.refreshToken) {
            throw new ForbiddenException('Access Denied');
        }

        const refreshTokenMatch = await bcrypt.compare(user.refreshToken, refreshToken);

        if (!refreshTokenMatch) {
            throw new ForbiddenException('Access Denied');
        }

        const tokens = await this.getTokens(user.id, user.username);

        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    setAuthCookie(res: Response, authTokens: AuthTokens) {
        res.cookie('userId', authTokens.userId, authCookieOptions)
            .cookie(JWT_COOKIE_NAMES.accessToken, authTokens.accessToken, authCookieOptions)
            .cookie(JWT_COOKIE_NAMES.refreshToken, authTokens.refreshToken, authCookieOptions);
    }

    async signIn({ password, username }: AuthDto) {
        // Check if user exists
        const user = await this.usersService.findOne({ username });

        if (!user) {
            throw new BadRequestException('Incorrect username or password');
        }

        const passwordMatches = await bcrypt.compare(password, user.hash);

        if (!passwordMatches) {
            throw new BadRequestException('Incorrect username or password');
        }

        const tokens = await this.getTokens(user.id, user.username);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async signUp({ password, username }: AuthDto): Promise<AuthTokens> {
        // Check if user exists
        const userExists = await this.usersService.findOne({ username });

        if (userExists) {
            throw new BadRequestException('User already exists');
        }

        // Hash password
        const hash = await this.hashData(password);
        const newUser = await this.usersService.create({ hash, username });
        const tokens = await this.getTokens(newUser.id, newUser.username);

        await this.updateRefreshToken(newUser.id, tokens.refreshToken);

        return tokens;
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken);

        await this.usersService.update({
            id: userId,
            refreshToken: hashedRefreshToken,
        });
    }
}
