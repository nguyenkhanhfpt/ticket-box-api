import { Global, Module } from '@nestjs/common';
import { loggerOptionsConstant } from './logger.constant';
import { WinstonModule } from 'nest-winston';

import { LoggerService } from './logger.service';

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [],
      useFactory: () => loggerOptionsConstant,
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
