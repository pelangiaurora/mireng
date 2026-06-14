import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { UploadModule } from './upload/upload.module';
import { StoresModule } from './stores/stores.module';
import { CategoriesModule } from './categories/categories.module';
import { AddressesModule } from './addresses/addresses.module';
import { R2Service } from './common/r2.service';
import { PlatformSettingsModule } from './platform-settings/platform-settings.module';
import { StoreVerificationsModule } from './store-verifications/store-verifications.module';
import { SellerApplicationsModule } from './seller-applications/seller-applications.module';
import { TierSystemModule } from './tier-system/tier-system.module';
import { ShippingModule } from './shipping/shipping.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: false, // Pakai migration manual, jangan auto-sync
      logging: ['error', 'warn'],
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretkey',
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any },
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    ProductImagesModule,
    UploadModule,
    StoresModule,
    CategoriesModule,
    AddressesModule,
    PlatformSettingsModule,
    StoreVerificationsModule,
    SellerApplicationsModule,
    TierSystemModule,
    ShippingModule,
    AdminModule,
  ],
  providers: [R2Service],
})
export class AppModule {}
