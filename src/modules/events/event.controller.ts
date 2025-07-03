import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { EventEntity } from '@database/entities/event.entity';
import { CreateEventDto } from './dtos/req/create.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getAllEvents(): Promise<EventEntity[]> {
    return this.eventService.getAllEvents();
  }

  @Post()
  async createEvent(
    @Body() createEventDto: CreateEventDto,
  ): Promise<EventEntity> {
    return this.eventService.createEvent(createEventDto);
  }
}
