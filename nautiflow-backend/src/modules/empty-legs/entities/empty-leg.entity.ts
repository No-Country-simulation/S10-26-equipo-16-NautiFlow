import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Boat } from '../../lancheros/entities/boat.entity';

export enum EmptyLegStatus {
  AVAILABLE = 'AVAILABLE',
  ASSIGNED = 'ASSIGNED',
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

@Entity('empty_legs')
export class EmptyLeg {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Boat, { nullable: false })
  @JoinColumn({ name: 'lancha_id' })
  boat: Boat;

  @Column({ name: 'zona_origen', length: 150 })
  zonaOrigen: string;

  @Column({ name: 'zona_destino', length: 150 })
  zonaDestino: string;

  @Column({ name: 'hora_salida', type: 'timestamptz' })
  horaSalida: Date;

  @Column({
    type: 'enum',
    enum: EmptyLegStatus,
    default: EmptyLegStatus.AVAILABLE,
  })
  estado: EmptyLegStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
