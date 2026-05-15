import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Product }
from '../../products/entities/product.entity';

@Entity()
export class ProductImage {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageUrl: string;

  @Column({
    default: false,
  })
  isThumbnail: boolean;

  @ManyToOne(
    () => Product,
    (product) => product.images,
    {
      onDelete: 'CASCADE',
    },
  )
  product: Product;
}