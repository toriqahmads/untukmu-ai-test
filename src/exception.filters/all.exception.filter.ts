import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      code: status,
      success: false,
      message:
        exception instanceof HttpException
          ? typeof exception.getResponse() === 'string'
            ? {}
            : exception.getResponse()['message']
          : 'Internal Server Error',
    };

    response.status(status).json(errorResponse);
  }
}
