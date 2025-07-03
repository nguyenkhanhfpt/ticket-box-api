import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from '@database/entities/ticket.entity';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { EventModule } from '@modules/events/event.module';
import { EventService } from '@modules/events/event.service';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity]), EventModule],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule {}
