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

@Entity('user_addresses')
export class UserAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ default: 'Rumah' })
  label: string;

  @Column({ name: 'recipient_name' })
  recipientName: string;

  @Column()
  phone: string;

  @Column({ type: 'text' })
  address: string;

  @Column()
  city: string;

  @Column()
  province: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  village: string;

  @Column({ name: 'postal_code' })
  postalCode: string;

  @Column({ nullable: true, type: 'numeric', precision: 10, scale: 7 })
  latitude: number;

  @Column({ nullable: true, type: 'numeric', precision: 10, scale: 7 })
  longitude: number;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @Column({ name: 'rajaongkir_destination_id', nullable: true, length: 20 })
  rajaongkirDestinationId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
