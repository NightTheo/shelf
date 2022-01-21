import {
    ArgumentsHost, BadRequestException,
    Catch,
    ExceptionFilter,
    HttpException, HttpStatus, UnprocessableEntityException
} from "@nestjs/common";
import { Request, Response } from 'express';

@Catch()
export class AddBookExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const httpStatus: number =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        let body = {
            statusCode: httpStatus,
            error: exception.name,
            timestamp: new Date().toISOString(),
            message: exception.message,
            path: request.url,
        }

        switch (exception.name) {
            case BadRequestException.name:
                const e = <BadRequestException> exception;
                body.statusCode = 422;
                body.error = UnprocessableEntityException.name;
                body.message = e.getResponse()["message"];
                break;
        }

        response
            .status(body.statusCode)
            .json(body);
    }

}