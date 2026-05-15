import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { Product }
from './entities/product.entity';

import { ProductImage }
from '../product-images/entities/product-image.entity';

import { User }
from '../users/entities/user.entity';
import { R2Service } from '../common/r2.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductImage,
      User,
    ]),
  ],
  controllers: [ProductsController],
  providers: [
  ProductsService,
  R2Service,
],
})
export class ProductsModule {}