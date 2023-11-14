// api-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpException } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(errno: number, message: string, status: HttpStatus) {
    super({ errno, message }, status);
  }
}

@Catch(ApiException)
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: ApiException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { errno, message } = exception.getResponse() as {
      errno: number;
      message: string;
    };

    response.status(exception.getStatus()).json({
      errno,
      errmsg: message,
    });
  }
}
