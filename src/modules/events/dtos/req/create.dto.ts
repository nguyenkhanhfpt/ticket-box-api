import { EventEntity } from '@database/entities/event.entity';
import { IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  public static readonly resource = EventEntity.name;

  @IsNotEmpty()
  title: string;

  description: string;

  @IsNotEmpty()
  limit: number;

  @IsNotEmpty()
  startTime: Date;

  endTime: Date;
}
