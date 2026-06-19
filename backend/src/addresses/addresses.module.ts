import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddress } from './entities/user-address.entity';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { ShippingModule } from '../shipping/shipping.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddress]), ShippingModule],
  controllers: [AddressesController],
  providers: [AddressesService],
  exports: [AddressesService],
})
export class AddressesModule {}
