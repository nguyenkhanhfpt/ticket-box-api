import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from '@database/entities/ticket.entity';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { EventModule } from '@modules/events/event.module';
import { RedisModule } from '@modules/redis';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity]), EventModule, RedisModule],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule {}
