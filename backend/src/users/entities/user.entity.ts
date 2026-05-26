import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true, name: 'date_of_birth', type: 'date' })
  dateOfBirth: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ default: 'buyer' })
  role: string;

  @Column({ name: 'kyc_status', default: 'unverified' })
  kycStatus: string;

  @Column({ name: 'kyc_document', nullable: true })
  kycDocument: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // ─── FASE 1: Progressive KYC ──────────────────────────────────────
  @Column({ name: 'kyc_verified', nullable: true, default: false })
  kycVerified: boolean;

  @Column({ name: 'kyc_verified_at', nullable: true, type: 'timestamp' })
  kycVerifiedAt: Date;

  @Column({ name: 'kyc_verified_by', nullable: true, type: 'uuid' })
  kycVerifiedBy: string;

  @Column({ name: 'withdraw_blocked', nullable: true, default: false })
  withdrawBlocked: boolean;

  @Column({
    name: 'seller_reg_status',
    type: 'varchar',
    length: 20,
    nullable: true,
    default: 'none',
  })
  sellerRegStatus: string; // 'none' | 'pending' | 'approved' | 'rejected'

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
