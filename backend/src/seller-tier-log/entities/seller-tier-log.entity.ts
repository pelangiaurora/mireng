import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
import { User } from '../../users/entities/user.entity';

@Entity('seller_tier_log')
export class SellerTierLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ name: 'store_id', nullable: true })
  storeId: string;

  @Column({ name: 'from_tier', type: 'varchar', length: 20, nullable: true })
  fromTier: string; // tier sebelumnya (null jika baru pertama)

  @Column({ name: 'to_tier', type: 'varchar', length: 20 })
  toTier: string; // tier baru

  @Column({ nullable: true, type: 'text' })
  reason: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'changed_by' })
  changedBy: User;

  @Column({ name: 'changed_by', nullable: true, type: 'uuid' })
  changedById: string;

  @Column({ name: 'is_auto', default: true })
  isAuto: boolean; // true = otomatis sistem, false = manual admin

  @Column({ name: 'notified_at', nullable: true, type: 'timestamp' })
  notifiedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
