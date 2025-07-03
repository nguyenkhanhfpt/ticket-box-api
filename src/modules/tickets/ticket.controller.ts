import { Body, Controller, Post } from '@nestjs/common';
import { CreateTicketDto } from './dtos/req/create.dto';
import { TicketService } from './ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  async buyTicket(@Body() createTicketDto: CreateTicketDto): Promise<any> {
    return this.ticketService.buyTicket(createTicketDto);
  }
}
