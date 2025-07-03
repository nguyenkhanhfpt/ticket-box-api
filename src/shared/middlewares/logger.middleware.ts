import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CLS_ID, ClsServiceManager } from 'nestjs-cls';
import { v4 } from 'uuid';
import { LoggerConstant } from '@modules/logger/logger.constant';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  /**
   * Handles the incoming request and logs the request details.
   *
   * @param req The incoming request object.
   * @param res The outgoing response object.
   * @param next The next function to call in the middleware chain.
   */
  use(req: Request, res: Response, next: NextFunction) {
    if (LoggerConstant.blacklistPath.includes(req.originalUrl)) {
      return next();
    }

    const cls = ClsServiceManager.getClsService();

    const callback = async () => {
      try {
        const requestId = v4();
        this.logger.log(`${req.method}: #${req.originalUrl}`, {
          requestId,
          resource: 'API APP',
        });

        cls.set(CLS_ID, requestId);

        next();
      } catch (e) {
        next(e);
      }
    };
    const runner = cls.run.bind(cls);

    runner(callback);
  }
}
