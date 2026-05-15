import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User }
from '../../users/entities/user.entity';

import { ProductImage }
from '../../product-images/entities/product-image.entity';

@Entity()
export class Product {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  price: number;

  @Column({
    nullable: true,
  })
  imageUrl: string;

  @Column({
    default: true,
  })
  isActive: boolean;

  @ManyToOne(() => User)
  seller: User;

  @OneToMany(
    () => ProductImage,
    (image) => image.product,
    {
      cascade: true,
    },
  )
  images: ProductImage[];

  @CreateDateColumn()
  createdAt: Date;
}