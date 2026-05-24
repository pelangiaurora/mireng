import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';
import { Category } from '../../categories/entities/category.entity';
import { ProductImage } from '../../product-images/entities/product-image.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true, unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({
    name: 'base_price',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: { to: (v: number) => v, from: (v: string) => Number(v) },
  })
  price!: number;

  // Tipe: physical = produk fisik, digital = produk digital (file/akun/lisensi), service = jasa
  @Column({ default: 'physical' })
  type!: string;

  // Kondisi produk (khusus fisik)
  @Column({ default: 'new' })
  condition!: string;

  // Berat dalam gram (khusus fisik, untuk kalkulasi ongkir)
  @Column({ default: 0 })
  weight!: number;

  @Column({ default: 0 })
  width!: number;

  @Column({ default: 0 })
  height!: number;

  @Column({ default: 0 })
  length!: number;

  @Column({ nullable: true })
  sku!: string;

  @Column({ default: 0 })
  stock!: number;

  @Column({ name: 'min_order', default: 1 })
  minOrder!: number;

  // Untuk produk digital
  @Column({ name: 'is_digital', default: false })
  isDigital!: boolean;

  @Column({ name: 'digital_file', nullable: true })
  digitalFile!: string;

  @Column({ name: 'digital_note', nullable: true, type: 'text' })
  digitalNote!: string;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ name: 'total_sold', default: 0 })
  totalSold!: number;

  @Column({ type: 'numeric', precision: 3, scale: 2, default: 0 })
  rating!: number;

  @Column({ name: 'total_reviews', default: 0 })
  totalReviews!: number;

  // Relasi ke Toko
  @ManyToOne(() => Store, { nullable: true })
  @JoinColumn({ name: 'store_id' })
  store!: Store;

  @Column({ name: 'store_id', nullable: true })
  storeId!: string;

  // Relasi ke Seller (user)
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'seller_id' })
  seller!: User;

  @Column({ name: 'seller_id', nullable: true })
  sellerId!: string;

  // Relasi ke Kategori
  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @Column({ name: 'category_id', nullable: true })
  categoryId!: string;

  // Gambar produk
  @OneToMany(() => ProductImage, (img) => img.product, { cascade: true })
  images!: ProductImage[];

  @Column({ nullable: true, select: false })
  imageUrl!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
