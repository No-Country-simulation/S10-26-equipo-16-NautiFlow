import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Boat } from './boat.entity';

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

@Entity('lancheros')
export class BoatOperator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  telefono: string;

  @Column({ type: 'varchar', length: 30 })
  licenciaUrl: string;

  @Column({ type: 'varchar', nullable: true })
  antecedentesPenalesUrl: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  estadoVerificacion: VerificationStatus;

  @OneToMany(() => Boat, (boat) => boat.boatOperator, { cascade: true })
  boats: Boat[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
