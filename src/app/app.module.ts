import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configuration } from '#core/config';
import { AuthModule } from '#modules/auth';
import { UsersModule } from '#modules/users';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    controllers: [AppController],
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
        }),
        AuthModule,
        UsersModule,
    ],
    providers: [AppService],
})
export class AppModule {}
