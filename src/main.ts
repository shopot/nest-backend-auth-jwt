import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import * as cookieParser from 'cookie-parser';

import { AppModule } from '#app';

const DEFAULT_PORT = 3000;
const DEFAULT_COOKIE_SECRET = 'b97d8c15094058cb';

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule, {
        cors: { maxAge: 9999, origin: true },
    });

    const configService: ConfigService = app.get<ConfigService>(ConfigService);

    const cookieSecret = configService.get<string>('COOKIE_SECRET') ?? DEFAULT_COOKIE_SECRET;

    app.use(cookieParser(cookieSecret));

    app.setGlobalPrefix('/api');

    const port = configService.get<number>('PORT') ?? DEFAULT_PORT;

    await app.listen(port, () => {
        console.log(`Server started on http://127.0.0.1:${port}`);
    });
};

void bootstrap();
