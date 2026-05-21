import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from '../product-images/entities/product-image.entity';
import { Store } from '../stores/entities/store.entity';
import { User } from '../users/entities/user.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { R2Service } from '../common/r2.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage, Store, User])],
  controllers: [ProductsController],
  providers: [ProductsService, R2Service],
  exports: [ProductsService],
})
export class ProductsModule {}
