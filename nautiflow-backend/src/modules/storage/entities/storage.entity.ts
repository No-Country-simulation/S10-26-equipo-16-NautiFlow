import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('storage')
@Index(['entityType', 'entityId'])
export class Storage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  entityType: string;

  @Column({ type: 'uuid' })
  entityId: string;

  @Column({ type: 'varchar', length: 50 })
  fileType: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'varchar', length: 255 })
  publicId: string;

  @Column({ type: 'varchar', length: 20, default: 'image' })
  resourceType: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
