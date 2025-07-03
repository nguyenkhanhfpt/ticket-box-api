import { Inject, Injectable, Logger } from '@nestjs/common';
import { parse } from '@shared/utils/node-stack-trace.util';
import axios from 'axios';
import { Request } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class LoggerService {
  /**
   * LoggerService constructor.
   *
   * @param {Logger} logger - The logger instance.
   * @param {ClsService} cls - The ClsService instance.
   */
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly cls: ClsService,
  ) {}

  /**
   * Logs a message.
   * @param level
   * @param error
   * @param errorCode
   * @param req
   * @private
   */
  private logDetail(
    level: 'log' | 'error',
    error: Error,
    errorCode: string,
    req?: Request,
  ): void {
    const traceArr = parse(error) || [];
    const trace = traceArr.find((t) => t.functionName && t.methodName) || {};

    const logData = {
      path: req?.path,
      functionName: trace.functionName,
      caller: `${trace.fileName}:${trace.lineNumber}:${trace.columnNumber}`,
      requestId: this.cls.getId(),
      resource: 'APP API',
      errorCode,
    };

    let message = error.message;

    if (axios.isAxiosError(error)) {
      message = `${message} and ${error.response?.data?.message}. Response data: ${JSON.stringify(error.response?.data || {})}`;
    }

    this.logger[level](message, '', logData);
  }

  /**
   * Logs the request details.
   * @param req
   * @param error
   * @param errorCode
   */
  logRequestDetail(req: Request, error: Error, errorCode: string): void {
    this.logDetail('log', error, errorCode, req);
  }

  /**
   * Logs the error details.
   * @param error
   * @param errorCode
   * @param req
   */
  logErrorDetail(error: Error, errorCode: string, req?: Request): void {
    this.logDetail('error', error, errorCode, req);
  }

  /**
   * Logs the info details.
   * @param message
   */
  logInfo(message: any): void {
    this.logger.log(message);
  }

  /**
   * Logs the warn details.
   * @param message
   */
  logWarn(message: any): void {
    this.logger.warn(message);
  }

  /**
   * Logs the debug details.
   * @param message
   */
  logDebug(message: any): void {
    this.logger.debug(message);
  }

  /**
   * Logs the error details.
   * @param message
   */
  logError(message: any): void {
    this.logger.error(message);
  }
}
