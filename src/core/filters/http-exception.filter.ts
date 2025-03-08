import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { isObject } from 'class-validator';
import { Request, Response } from 'express';

type ResponseData = {
    error: string | string[];
    path?: string;
    statusCode: HttpStatus;
    timestamp?: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();

        const response = ctx.getResponse<Response>();

        // const request = ctx.getRequest<Request>();

        const data: ResponseData = {
            error: 'Unknown error',
            // path: request.url,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            // timestamp: new Date().toISOString(),
        };

        if (exception instanceof HttpException) {
            data.statusCode = exception.getStatus();

            const exceptionResponse = exception.getResponse();

            if (isObject(exceptionResponse) && Object.hasOwn(exceptionResponse, 'message')) {
                data.error = exceptionResponse['message'] || exception.message;
            } else {
                data.error = exception.message;
            }
        }

        response.status(data.statusCode).json(data);
    }
}
