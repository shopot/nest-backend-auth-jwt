import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '#modules/users';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
    controllers: [AuthController],
    imports: [JwtModule.register({ global: true }), UsersModule],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, ConfigService],
})
export class AuthModule {}
