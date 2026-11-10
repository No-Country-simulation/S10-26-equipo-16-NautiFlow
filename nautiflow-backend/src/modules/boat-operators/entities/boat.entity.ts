import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoatOperator } from './boat-operator.entity';

@Entity('boats')
export class Boat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombreEmbarcacion: string; // Ej: "Delta Express I"

  @Column({ type: 'int' })
  capacidad: number; // Ej: 5 pasajeros (clave para el buscador del admin)

  @Column('simple-array')
  zonaCobertura: string[];

  @Column({ type: 'varchar', nullable: true })
  seguroUrl: string; // URL del comprobante de seguro de la lancha

  @Column({ type: 'varchar', length: 255, nullable: true })
  seguroPublicId: string | null;

  @Column({ type: 'text', nullable: true })
  fotosUrl: string;

  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'::jsonb" })
  fotos: Array<{ url: string; publicId: string }>;

  @Column({ type: 'boolean', default: true })
  activa: boolean; // Para saber si está disponible en la flota general

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  promedioCalificaciones: number;

  @ManyToOne(() => BoatOperator, (boatOperator) => boatOperator.boats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lancheroId' })
  boatOperator: BoatOperator;

  @Column({ name: 'lancheroId' })
  boatOperatorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
