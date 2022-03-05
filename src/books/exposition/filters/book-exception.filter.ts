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
import { IsbnFormatException } from '../../../shared/isbn/isbn-format.exception';
import { BookConflictException } from '../../application/exceptions/book.conflict.exception';
import { BookNotFoundException } from '../../application/exceptions/book.not-found.exception';
import { BookCoverNotFoundException } from '../../application/exceptions/book-cover.not-found.exception';
import { FileFormatException } from '../../../shared/files/file-format.exception';

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
      case IsbnFormatException.name:
      case BookConflictException.name:
      case BookCoverNotFoundException.name:
      case FileFormatException.name:
      case UnprocessableEntityException.name:
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
