import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    NotAcceptableException,
    UnprocessableEntityException
} from "@nestjs/common";

@Catch(HttpException)
export class AddBookExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): any {
        throw new NotAcceptableException("aaa");
    }

}