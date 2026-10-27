import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Boat } from '../../boat-operators/entities/boat.entity';
import { Review } from '../../reviews/entities/review.entity';

export enum TripStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  origen: string;

  @Column({ type: 'varchar', length: 150 })
  destino: string;

  @Column({ type: 'timestamp' })
  fechaHoraSalida: Date;

  @Column({ type: 'int' })
  pasajeros: number;

  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.PENDING,
  })
  estado: TripStatus;

  @ManyToOne(() => Boat, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'boatId' })
  boat: Boat;

  @Column({ type: 'uuid', nullable: true })
  boatId: string;

  @OneToMany(() => Review, (review) => review.trip)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
