import { LoggerService } from '@modules/logger/logger.service';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { errorCodeConstant } from '@shared/constants/error-code.constant';
import { ErrorDto } from '@shared/dtos/error.dto';
import { t } from '@shared/utils';
import type { Response } from 'express';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Catch(NotFoundException, EntityNotFoundError)
export class NotFoundExceptionFilter implements ExceptionFilter {
  /**
   * Logger
   * @param loggerService
   */
  constructor(private readonly loggerService: LoggerService) {}
  /**
   * Implement not found exception
   *
   * @param {HttpException} exception
   * @param {ArgumentsHost} host
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.NOT_FOUND;
    const code = errorCodeConstant.notFound;
    const message = t(`error.${code}`) || exception.message;
    const error: ErrorDto = {
      code,
      message,
      resource: this.isNotFoundException(exception) ? exception.message : null,
    };

    exception.message = message;
    this.loggerService.logErrorDetail(
      exception,
      errorCodeConstant.notFound,
      request,
    );
    response.status(status).json(error);
  }

  /**
   * Check error is not found
   *
   * @param exception
   *
   * @returns {NotFoundException}
   */
  private isNotFoundException(
    exception: unknown,
  ): exception is NotFoundException {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      exception instanceof NotFoundException
    );
  }
}
