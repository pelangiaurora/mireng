import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('seller_applications')
export class SellerApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({
    name: 'seller_type_requested',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  sellerTypeRequested: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({ name: 'marketplace_links', nullable: true, type: 'jsonb' })
  marketplaceLinks: object;

  @Column({ name: 'estimated_products', nullable: true })
  estimatedProducts: number;

  @Column({ name: 'estimated_revenue', nullable: true, type: 'bigint' })
  estimatedRevenue: number;

  @Column({ name: 'experience_years', nullable: true })
  experienceYears: number;

  @Column({ name: 'document_ktp', type: 'text' })
  documentKtp: string;

  @Column({ name: 'document_support', nullable: true, type: 'text' })
  documentSupport: string;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({
    name: 'submitted_at',
    nullable: true,
    type: 'timestamp',
    default: () => 'now()',
  })
  submittedAt: Date;

  @Column({ name: 'reviewed_at', nullable: true, type: 'timestamp' })
  reviewedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewed_by' })
  reviewer: User;

  @Column({ name: 'reviewed_by', nullable: true, type: 'uuid' })
  reviewedBy: string;

  @Column({ name: 'admin_notes', nullable: true, type: 'text' })
  adminNotes: string;

  @Column({ name: 'rejection_reason', nullable: true, type: 'text' })
  rejectionReason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
