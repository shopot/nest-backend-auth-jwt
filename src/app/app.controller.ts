import { Controller, Get, HttpException, HttpStatus, UseGuards } from '@nestjs/common';

import { AccessTokenGuard } from '#modules/auth';

import { AppService } from './app.service';

@Controller('/api')
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('/hello')
    getHello() {
        throw new HttpException('This is a custom error', HttpStatus.BAD_REQUEST);
    }

    @Get('/protected')
    @UseGuards(AccessTokenGuard)
    getProtectedRoute(): string {
        return this.appService.getProtectedRoute();
    }

    @Get('/public')
    getPublicRoute(): string {
        return this.appService.getPublicRoute();
    }
}
