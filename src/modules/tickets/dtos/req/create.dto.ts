import { TicketEntity } from '@database/entities/ticket.entity';
import { TicketStatus } from '@shared/enums/app.enum';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTicketDto {
  public static readonly resource = TicketEntity.name;

  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  code: string;

  @IsNotEmpty()
  eventId: number;

  status: TicketStatus = TicketStatus.UNUSED;
}
