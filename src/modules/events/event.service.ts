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

  /**
   * Get all events
   * @returns {Promise<EventEntity[]>}
   */
  async getAllEvents(): Promise<EventEntity[]> {
    return this.eventRepository.find();
  }

  /**
   * Create a new event
   * @param {CreateEventDto} createEventDto - Data transfer object for creating an event
   * @returns {Promise<EventEntity>}
   */
  async createEvent(createEventDto: CreateEventDto): Promise<EventEntity> {
    const newEvent = this.eventRepository.create(createEventDto);

    return this.eventRepository.save(newEvent);
  }

  /**
   * Get an event by its ID
   * @param {number} id - The ID of the event
   * @param {Array<keyof EventEntity>} [select] - Optional fields to select
   * @returns {Promise<EventEntity>}
   */
  async getEventById(
    id: number,
    select?: (keyof EventEntity)[],
  ): Promise<EventEntity> {
    return this.eventRepository.findOne({
      where: { id },
      select,
    });
  }
}
