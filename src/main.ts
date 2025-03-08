import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { isObject } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { WinstonModule } from 'nest-winston';

import { AppModule } from '#app';
import { winstonLogger } from '#core/config';
import { HttpExceptionFilter } from '#core/filters';

const DEFAULT_PORT = 3000;
const DEFAULT_COOKIE_SECRET = 'b97d8c15094058cb';

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule, {
        cors: { maxAge: 9999, origin: true },
        logger: WinstonModule.createLogger({
            instance: winstonLogger,
        }),
    });

    const configService: ConfigService = app.get<ConfigService>(ConfigService);

    const cookieSecret = configService.get<string>('COOKIE_SECRET') ?? DEFAULT_COOKIE_SECRET;

    app.use(cookieParser(cookieSecret));

    app.useGlobalFilters(new HttpExceptionFilter());

    // unhandledRejection & uncaughtException
    const logger = app.get(Logger);

    process.on('unhandledRejection', (reason, promise) => {
        logger.error(
            `Unhandled Rejection at: ${
                isObject(promise) ? JSON.stringify(promise) : String(promise)
            } reason: ${(reason as any) || String(reason)}`
        );
    });

    process.on('uncaughtException', (err, origin) => {
        logger.error(`Caught exception: ${isObject(err) ? JSON.stringify(err) : err} - Exception origin: ${origin}`);
    });

    const port = configService.get<number>('PORT') ?? DEFAULT_PORT;

    await app.listen(port, () => {
        console.log(`Server started on http://127.0.0.1:${port}`);
    });
};

void bootstrap();
