import { Environment } from '@shared/enums/environment.enum';
import { WinstonModuleOptions } from 'nest-winston';
import { format, transports } from 'winston';

export const LoggerConstant = {
  logTypes: ['error', 'info', 'query', 'warn'],
  level: {
    info: 'info',
    fatal: 'fail',
    error: 'error',
    warn: 'warn',
    debug: 'debug',
  },
  queryPrefix: 'Query: ',
  parameterPrefix: ' -- Params: ',
  queryContext: 'QueryContext',
  queryLogLevelsDev: ['log', 'warn', 'query', 'schema', 'migration'],
  success: 'Complete 200 OK',
  blacklistPath: ['/api/v1/health'],
  errorMessages: {
    400: 'Completed 400',
    500: 'Completed 500',
    401: 'Completed 401',
    403: 'Completed 403',
    404: 'Completed 404',
    422: 'Completed 422',
  },
};

const loggerFormatWithoutColor = format.printf((log): string => {
  const { context, ...rest } = log;

  const {
    requestId,
    functionName,
    resource,
    errorCode,
    caller,
    userAgent,
    path,
  } =
    (context as {
      requestId: any;
      functionName: any;
      resource: any;
      errorCode: any;
      caller: any;
      userAgent: any;
      path: any;
    }) || {};

  delete rest.stack;

  return JSON.stringify({
    ...rest,
    function: functionName,
    caller,
    requestId,
    resource,
    errorCode,
    userAgent,
    path,
  });
});

export const loggerOptionsConstant: WinstonModuleOptions = {
  silent: process.env.NODE_ENV === Environment.TEST,
  transports: [
    new transports.Console({
      format: format.combine(format.timestamp(), loggerFormatWithoutColor),
    }),
  ],
  level: process.env.NODE_ENV !== Environment.LOCAL ? 'info' : 'debug',
};
