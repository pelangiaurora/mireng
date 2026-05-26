import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerApplication } from './entities/seller-application.entity';
import { User } from '../users/entities/user.entity';
import { SellerApplicationsService } from './seller-applications.service';
import { SellerApplicationsController } from './seller-applications.controller';
import { PlatformSettingsModule } from '../platform-settings/platform-settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SellerApplication, User]),
    PlatformSettingsModule,
  ],
  controllers: [SellerApplicationsController],
  providers: [SellerApplicationsService],
  exports: [SellerApplicationsService],
})
export class SellerApplicationsModule {}