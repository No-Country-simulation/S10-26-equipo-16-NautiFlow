import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Boat } from './boat.entity';

// Enum para el estado de verificación requerido por el panel admin
export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

@Entity('lancheros')
export class Lanchero {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  telefono: string; // Crucial para que el admin lo contacte por WhatsApp

  // URLs de los documentos subidos (almacenados en Cloudinary, Supabase o S3)
  @Column({ type: 'varchar', length: 30 })
  licenciaUrl: string;

  @Column({ type: 'varchar', nullable: true })
  antecedentesPenalesUrl: string;

  // Estado que cambia el Administrador en el Panel de Verificación
  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  estadoVerificacion: VerificationStatus;

  @OneToMany(() => Boat, (boat) => boat.lanchero, { cascade: true })
  boats: Boat[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
