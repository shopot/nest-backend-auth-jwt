import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { isObject } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(private readonly logger: Logger) {}

    use(req: Request, res: Response, next: NextFunction): void {
        const { body, method, originalUrl } = req;

        const start = Date.now();
        const hasBody = isObject(body);

        res.on('finish', () => {
            const { statusCode } = res;
            const duration = Date.now() - start;

            this.logger.log(
                `${method} ${originalUrl} ${statusCode} - ${duration}ms${hasBody ? ` - Body: ${JSON.stringify(body)}` : ``}`
            );
        });

        next();
    }
}
