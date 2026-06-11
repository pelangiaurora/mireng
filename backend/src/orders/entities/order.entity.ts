import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStore } from './order-store.entity';
import { Payment } from './payment.entity';
import { UserAddress } from '../../addresses/entities/user-address.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ nullable: true })
  userId: string;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @OneToMany(() => OrderStore, (os) => os.order)
  stores: OrderStore[];

  @OneToOne(() => Payment, (payment) => payment.order)
  payment: Payment;

  @ManyToOne(() => UserAddress, { nullable: true })
  @JoinColumn({ name: 'address_id' })
  address: UserAddress;

  @Column({ name: 'address_id', nullable: true })
  addressId: string;

  @Column({ name: 'shipping_address', type: 'jsonb', nullable: true })
  shippingAddress: object;

  @Column({ type: 'numeric', default: 0 })
  total: number;

  @Column({ type: 'bigint', default: 0 })
  subtotal: number;

  @Column({ name: 'shipping_total', type: 'bigint', default: 0 })
  shippingTotal: number;

  @Column({ name: 'payment_method', type: 'varchar', length: 30, nullable: true })
  paymentMethod: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}