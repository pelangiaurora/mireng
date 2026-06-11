import {
  Entity, Column, PrimaryGeneratedColumn,
  OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Order, (order) => order.payment)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id' })
  orderId: string;

  @Column({ nullable: true, type: 'text' })
  method: string; // bank_transfer, qris, gopay, shopeepay, credit_card, cod

  @Column({ name: 'external_id', nullable: true, type: 'text' })
  externalId: string; // Midtrans order_id / transaction_id

  @Column({ type: 'text', default: 'pending' })
  status: string; // pending|paid|expired|failed

  @Column({ type: 'bigint', nullable: true })
  amount: number;

  @Column({ name: 'va_number', nullable: true, length: 50 })
  vaNumber: string;

  @Column({ name: 'payment_url', nullable: true, type: 'text' })
  paymentUrl: string;

  @Column({ name: 'paid_at', nullable: true, type: 'timestamp' })
  paidAt: Date;

  @Column({ name: 'expired_at', nullable: true, type: 'timestamp' })
  expiredAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}