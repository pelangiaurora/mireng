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

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column({ name: 'seller_id' })
  sellerId: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  banner: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  province: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  village: string;

  @Column({ nullable: true, type: 'text' })
  address: string;

  @Column({ nullable: true, name: 'postal_code' })
  postalCode: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true, name: 'operating_hours', type: 'jsonb' })
  operatingHours: object;

  @Column({ name: 'holiday_mode', default: false })
  holidayMode: boolean;

  @Column({ nullable: true, name: 'holiday_note' })
  holidayNote: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'kyc_document', nullable: true })
  kycDocument: string;

  @Column({ type: 'numeric', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ name: 'total_sales', default: 0 })
  totalSales: number;

  @Column({ name: 'total_reviews', default: 0 })
  totalReviews: number;

  // ─── FASE 1: Seller Type & Store Type ─────────────────────────────
  @Column({
    name: 'seller_type',
    type: 'varchar',
    length: 20,
    default: 'digital',
  })
  sellerType: string; // 'physical' | 'digital'

  @Column({
    name: 'store_type',
    type: 'varchar',
    length: 20,
    default: 'personal',
  })
  storeType: string; // 'personal' | 'umkm' | 'official'

  // ─── FASE 1: Tier System ──────────────────────────────────────────
  @Column({
    name: 'seller_tier',
    type: 'varchar',
    length: 20,
    default: 'regular',
  })
  sellerTier: string; // 'regular' | 'star' | 'star_plus' | 'top' | 'official'

  @Column({ name: 'tier_progress', default: 0 })
  tierProgress: number;

  @Column({ name: 'badge_visible', default: true })
  badgeVisible: boolean;

  // ─── FASE 1: Verifikasi ───────────────────────────────────────────
  @Column({
    name: 'verif_status',
    type: 'varchar',
    length: 20,
    default: 'unverified',
  })
  verifStatus: string; // 'unverified' | 'pending' | 'approved' | 'rejected' | 'suspended' | 'banned'

  @Column({ name: 'verif_docs', nullable: true, type: 'jsonb' })
  verifDocs: object;

  @Column({ name: 'verif_note', nullable: true, type: 'text' })
  verifNote: string;

  @Column({ name: 'verif_reviewed_at', nullable: true, type: 'timestamp' })
  verifReviewedAt: Date;

  @Column({ name: 'verif_reviewed_by', nullable: true, type: 'uuid' })
  verifReviewedBy: string;

  // ─── FASE 1: Tier Metrics ─────────────────────────────────────────
  @Column({ name: 'total_transactions', default: 0 })
  totalTransactions: number;

  @Column({
    name: 'avg_rating',
    type: 'numeric',
    precision: 3,
    scale: 2,
    default: 0,
  })
  avgRating: number;

  @Column({
    name: 'response_rate',
    type: 'numeric',
    precision: 5,
    scale: 2,
    default: 0,
  })
  responseRate: number;

  @Column({
    name: 'complaint_rate',
    type: 'numeric',
    precision: 5,
    scale: 2,
    default: 0,
  })
  complaintRate: number;

  @Column({
    name: 'active_since',
    nullable: true,
    type: 'timestamp',
    default: () => 'now()',
  })
  activeSince: Date;

  // ─── FASE 4: Raja Ongkir ──────────────────────────────────────────
  @Column({ name: 'rajaongkir_destination_id', nullable: true, length: 20 })
  rajaongkirDestinationId: string;

  @Column({
    name: 'active_couriers',
    type: 'jsonb',
    default: ['jne', 'jnt', 'pos', 'anteraja'],
  })
  activeCouriers: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
