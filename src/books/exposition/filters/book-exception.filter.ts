import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IsbnFormatException } from '../../domain/IsbnFormatException';
import { BookConflictException } from '../../application/exceptions/book.conflict.exception';
import { BookNotFoundException } from '../../application/exceptions/book.not-found.exception';

@Catch()
export class BookExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let body = {
      statusCode:
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      message: exception.message,
      path: request.url,
    };

    switch (exception.name) {
      case BadRequestException.name:
        body.statusCode = 422;
        break;
      case IsbnFormatException.name:
        body.statusCode = 422;
        break;
      case UnprocessableEntityException.name:
        break;
      case BookConflictException.name:
        body.statusCode = 422;
        break;
      case BookNotFoundException.name:
        break;
      default:
        if (exception! instanceof HttpException) {
          console.log(
            `Unhandled exception on '${request.url}' : '${exception.stack}' `,
          );
        }
    }

    response.status(body.statusCode).json(body);
  }
}
