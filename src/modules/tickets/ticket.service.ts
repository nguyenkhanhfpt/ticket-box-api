import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dtos/req/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketEntity } from '@database/entities/ticket.entity';
import { Repository } from 'typeorm/repository/Repository';
import { EventService } from '@modules/events/event.service';
import { RedisService } from '@modules/redis/redis.service';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    private readonly eventService: EventService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Buy a ticket for an event
   * @param createTicketDto - Data transfer object for creating a ticket
   * @param buyWay - The way the ticket is being bought (e.g., 'web', 'app')
   * @returns {Promise<any>} - Returns a success message and the created ticket
   */
  async buyTicket(
    createTicketDto: CreateTicketDto,
    buyWay?: string,
  ): Promise<any> {
    try {
      switch (buyWay) {
        case 'redis':
          await this.redisValidateEvent(
            createTicketDto.eventId,
            createTicketDto.email,
          );
          break;
        default:
          await this.validateEvent(
            createTicketDto.eventId,
            createTicketDto.email,
          );
      }

      const ticket = this.ticketRepository.create({
        ...createTicketDto,
        code: Math.random().toString(36).substring(2, 15),
      });

      await this.ticketRepository.save(ticket);

      return { message: 'Ticket purchased successfully', data: ticket };
    } catch (error) {
      throw new BadRequestException(`Failed to buy ticket: ${error.message}`);
    }
  }

  /**
   * Validate the event before buying a ticket
   * @param eventId - The ID of the event to validate
   * @param email - The email of the user trying to buy a ticket
   * @throws {Error} - Throws an error if the event is not found, email
   * @returns {Promise<boolean>} - Returns true if the event is valid, otherwise throws an error
   */
  async validateEvent(eventId: number, email: string): Promise<boolean> {
    const event = await this.eventService.getEventById(eventId, ['limit']);
    if (!event) {
      throw new Error('Event not found');
    }

    const isEmailRegistered = await this.isEmailRegistered(eventId, email);
    if (isEmailRegistered) {
      throw new Error('Email is already registered for this event');
    }

    const numberOfTickets = await this.getNumberOfTickets(eventId);
    console.log('Number of tickets:', numberOfTickets, event.limit);

    if (event.limit <= numberOfTickets) {
      throw new Error('Event is fully booked');
    }

    return true;
  }

  /**
   * Validate the event before buying a ticket
   * @param eventId - The ID of the event to validate
   * @param email - The email of the user trying to buy a ticket
   * @throws {Error} - Throws an error if the event is not found, email
   * @returns {Promise<boolean>} - Returns true if the event is valid, otherwise throws an error
   */
  async redisValidateEvent(eventId: number, email: string): Promise<boolean> {
    const event = await this.eventService.getEventById(eventId, ['limit']);
    if (!event) {
      throw new Error('Event not found');
    }

    const isEmailRegistered = await this.isEmailRegistered(eventId, email);
    if (isEmailRegistered) {
      throw new Error('Email is already registered for this event');
    }

    const currentTickets =
      (await this.redisService.get<number>(`event:${eventId}`)) || 0;
    console.log('\n');
    console.log(
      '---Current tickets from Redis:',
      currentTickets,
      event.limit,
      email,
    );
    console.log('\n');

    // const redisLock = await this.redisService.createRedlock();

    // const lock = await redisLock.acquire(
    //   [`event:${eventId}:${currentTickets}`],
    //   3000,
    // );
    // const newCurrentTickets =
    //   (await this.redisService.get<number>(`event:${eventId}`)) || 0

    if (event.limit <= currentTickets) {
      throw new Error('Event is fully booked');
    }

    await this.redisService.set(`event:${eventId}`, currentTickets + 1);
    // await lock.release();

    return true;
  }

  /**
   * Get all tickets for a specific event
   * @param eventId - The ID of the event to get tickets for
   * @returns {Promise<TicketEntity[]>} - Returns an array of tickets for the event
   */
  async getNumberOfTickets(eventId: number): Promise<number> {
    const tickets = await this.ticketRepository.find({
      where: { eventId },
      select: ['id'],
    });

    return tickets.length;
  }

  /**
   * Check if an email is already registered for a specific event
   * @param eventId - The ID of the event to check
   * @param email - The email to check for registration
   * @returns {Promise<boolean>} - Returns true if the email is registered, otherwise false
   */
  async isEmailRegistered(eventId: number, email: string): Promise<boolean> {
    const ticket = await this.ticketRepository.findOne({
      where: { email, eventId },
      select: ['id'],
    });

    return !!ticket;
  }
}
