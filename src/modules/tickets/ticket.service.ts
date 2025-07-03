import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dtos/req/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketEntity } from '@database/entities/ticket.entity';
import { Repository } from 'typeorm/repository/Repository';
import { EventService } from '@modules/events/event.service';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    private readonly eventService: EventService, // Assuming EventService is used for some operations
  ) {}

  async getNumberOfTickets(eventId: number): Promise<number> {
    const tickets = await this.ticketRepository.find({
      where: { eventId },
      select: ['id'],
    });

    return tickets.length;
  }

  /**
   * Validate the event before buying a ticket
   * @param eventId - The ID of the event to validate
   * @returns {Promise<boolean>} - Returns true if the event is valid, otherwise throws an error
   */
  async validateEvent(eventId: number): Promise<boolean> {
    const event = await this.eventService.getEventById(eventId, ['limit']);
    if (!event) {
      throw new Error('Event not found');
    }

    const numberOfTickets = await this.getNumberOfTickets(eventId);
    console.log('Number of tickets:', numberOfTickets, event.limit);

    if (event.limit <= numberOfTickets) {
      throw new Error('Event is fully booked');
    }

    return true;
  }

  /**
   * Buy a ticket for an event
   * @param createTicketDto - Data transfer object for creating a ticket
   * @returns {Promise<any>} - Returns a success message and the created ticket
   */
  async buyTicket(createTicketDto: CreateTicketDto): Promise<any> {
    const isValid = await this.validateEvent(createTicketDto.eventId);
    if (!isValid) {
      throw new Error('Invalid event');
    }

    const ticket = this.ticketRepository.create({
      ...createTicketDto,
      code: Math.random().toString(36).substring(2, 15),
    });
    await this.ticketRepository.save(ticket);

    return { message: 'Ticket purchased successfully', data: ticket };
  }
}
