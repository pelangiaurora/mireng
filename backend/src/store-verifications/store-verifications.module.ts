import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreVerification } from './entities/store-verification.entity';
import { Store } from '../stores/entities/store.entity';
import { StoreVerificationsService } from './store-verifications.service';
import { StoreVerificationsController } from './store-verifications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StoreVerification, Store])],
  controllers: [StoreVerificationsController],
  providers: [StoreVerificationsService],
  exports: [StoreVerificationsService],
})
export class StoreVerificationsModule {}