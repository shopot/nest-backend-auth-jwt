import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import 'reflect-metadata';

import { AppModule } from '#app';

const DEFAULT_PORT = 3000;

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule, {
        cors: { maxAge: 9999, origin: true },
    });

    app.use(cookieParser());

    app.setGlobalPrefix('/api');

    await app.listen(process.env.PORT ?? DEFAULT_PORT);
};

void bootstrap();
