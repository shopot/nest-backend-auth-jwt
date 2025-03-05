import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './guards';

@Controller('/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(200)
    @Post('/signin')
    async signin(@Body() authDto: AuthDto, @Res({ passthrough: true }) res: Response) {
        const authTokens = await this.authService.signIn(authDto);

        this.authService.setAuthCookie(res, authTokens);

        const data = await this.authService.getUserProfile(authTokens.userId);

        return { data, message: 'ok', statusCode: 200 };
    }

    @Get('/whoami')
    @UseGuards(AccessTokenGuard)
    async whoami(@Req() req: Request) {
        const userId = (req.cookies.userId as string) || '';

        const data = await this.authService.getUserProfile(userId);

        return { data, message: 'ok', statusCode: 200 };
    }
}
