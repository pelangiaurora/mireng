import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('platform_settings')
export class PlatformSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({
    name: 'data_type',
    type: 'varchar',
    length: 20,
    default: 'string',
  })
  dataType: string; // 'string' | 'boolean' | 'number' | 'json'

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updater: User;

  @Column({ name: 'updated_by', nullable: true, type: 'uuid' })
  updatedBy: string;
}