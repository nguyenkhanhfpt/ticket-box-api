import { LoggerService } from '@modules/logger/logger.service';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { errorCodeConstant } from '@shared/constants/error-code.constant';
import { BaseErrorDto } from '@shared/dtos/base-error.dto';
import { t } from '@shared/utils';
import type { Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter
  implements ExceptionFilter<HttpException>
{
  /**
   * Logger
   * @param loggerService
   */
  constructor(private readonly loggerService: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.UNAUTHORIZED;
    const code = errorCodeConstant.unauthorized;
    const message = t(`error.${code}`);
    const error: BaseErrorDto = {
      code,
      message,
    };

    exception.message = message;
    this.loggerService.logErrorDetail(
      exception,
      errorCodeConstant.unauthorized,
    );
    response.status(status).json(error);
  }
}
