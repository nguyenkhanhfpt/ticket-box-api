import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from '@database/entities/event.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CreateEventDto } from './dtos/req/create.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async getAllEvents() {
    return this.eventRepository.find();
  }

  async createEvent(createEventDto: CreateEventDto): Promise<EventEntity> {
    const newEvent = this.eventRepository.create(createEventDto);

    return this.eventRepository.save(newEvent);
  }
}
