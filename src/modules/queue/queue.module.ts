import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DEFAULT_QUEUE_NAME } from '@shared/constants';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('app.queue.host'),
          port: configService.get('app.queue.port'),
          password: configService.get('app.queue.password'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: DEFAULT_QUEUE_NAME, // register a queue with the name 'default'
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
