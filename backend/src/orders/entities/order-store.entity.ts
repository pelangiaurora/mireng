import {
  Entity, Column, PrimaryGeneratedColumn,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Store } from '../../stores/entities/store.entity';

@Entity('order_stores')
export class OrderStore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.stores)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id' })
  orderId: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ name: 'store_id' })
  storeId: string;

  @Column({ type: 'bigint', default: 0 })
  subtotal: number;

  @Column({ name: 'shipping_fee', type: 'bigint', default: 0 })
  shippingFee: number;

  @Column({ nullable: true, length: 50 })
  courier: string;

  @Column({ name: 'courier_service', nullable: true, length: 50 })
  courierService: string;

  @Column({ name: 'tracking_number', nullable: true, length: 100 })
  trackingNumber: string;

  @Column({ type: 'varchar', length: 30, default: 'pending' })
  status: string;
  // pending|confirmed|processing|shipped|delivered|completed|cancelled|refunded

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ name: 'seller_notes', nullable: true, type: 'text' })
  sellerNotes: string;

  @Column({ name: 'shipped_at', nullable: true, type: 'timestamp' })
  shippedAt: Date;

  @Column({ name: 'delivered_at', nullable: true, type: 'timestamp' })
  deliveredAt: Date;

  @Column({ name: 'completed_at', nullable: true, type: 'timestamp' })
  completedAt: Date;

  @Column({ name: 'cancelled_at', nullable: true, type: 'timestamp' })
  cancelledAt: Date;

  @Column({ name: 'cancel_reason', nullable: true, type: 'text' })
  cancelReason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}