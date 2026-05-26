import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../stores/entities/store.entity';
import { SellerTierLog } from '../seller-tier-log/entities/seller-tier-log.entity';
import { TierSystemService } from './tier-system.service';
import { TierSystemController } from './tier-system.controller';
import { PlatformSettingsModule } from '../platform-settings/platform-settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store, SellerTierLog]),
    PlatformSettingsModule,
  ],
  controllers: [TierSystemController],
  providers: [TierSystemService],
  exports: [TierSystemService],
})
export class TierSystemModule {}