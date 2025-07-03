import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EventEntity } from './event.entity';
import { TicketStatus } from '@shared/enums';

@Entity({ name: 'tickets' })
export class TicketEntity extends BaseEntity {
  @ManyToOne(() => EventEntity, (event) => event.tickets)
  @JoinColumn({ name: 'event_id' })
  event: EventEntity;

  @Column()
  email: string;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'event_id' })
  eventId: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.UNUSED,
  })
  status: TicketStatus;
}
