import { Controller, Get, UseGuards } from '@nestjs/common';

import { AccessTokenGuard } from '#modules/auth';

import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

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
