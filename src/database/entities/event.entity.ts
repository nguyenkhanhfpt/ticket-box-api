import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TicketEntity } from './ticket.entity';

@Entity({ name: 'events' })
export class EventEntity extends BaseEntity {
  @OneToMany(() => TicketEntity, (ticket) => ticket.event)
  tickets: TicketEntity[];

  @Column()
  title: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'limit' })
  limit: number;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time', nullable: true })
  endTime: Date;
}
