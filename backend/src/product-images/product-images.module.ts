import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductImage }
from './entities/product-image.entity';

import { Product }
from '../products/entities/product.entity';

import { ProductImagesService }
from './product-images.service';

import { ProductImagesController }
from './product-images.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductImage,
      Product,
    ]),
  ],
  controllers: [ProductImagesController],
  providers: [ProductImagesService],
})
export class ProductImagesModule {}