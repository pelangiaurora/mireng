import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
import { User } from '../../users/entities/user.entity';

@Entity('store_verifications')
export class StoreVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ name: 'store_id', nullable: true })
  storeId: string;

  @Column({ name: 'seller_type', type: 'varchar', length: 20 })
  sellerType: string;

  @Column({ name: 'store_type', type: 'varchar', length: 20 })
  storeType: string;

  @Column({ name: 'document_ktp', nullable: true, type: 'text' })
  documentKtp: string;

  @Column({ name: 'document_selfie', nullable: true, type: 'text' })
  documentSelfie: string;

  @Column({ name: 'document_nib', nullable: true, type: 'text' })
  documentNib: string;

  @Column({ name: 'document_siup', nullable: true, type: 'text' })
  documentSiup: string;

  @Column({ name: 'document_akta', nullable: true, type: 'text' })
  documentAkta: string;

  @Column({ name: 'document_npwp', nullable: true, type: 'text' })
  documentNpwp: string;

  @Column({ name: 'document_brand', nullable: true, type: 'text' })
  documentBrand: string;

  @Column({ name: 'notes_from_seller', nullable: true, type: 'text' })
  notesFromSeller: string;

  @Column({ name: 'notes_from_admin', nullable: true, type: 'text' })
  notesFromAdmin: string;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({ name: 'submitted_at', nullable: true, type: 'timestamp', default: () => 'now()' })
  submittedAt: Date;

  @Column({ name: 'reviewed_at', nullable: true, type: 'timestamp' })
  reviewedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewed_by' })
  reviewer: User;

  @Column({ name: 'reviewed_by', nullable: true, type: 'uuid' })
  reviewedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
