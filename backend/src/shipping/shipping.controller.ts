import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { ShippingService } from './shipping.service';
import { ShippingCostDto } from './dto/shipping-cost.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsArray, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateCouriersDto {
  @ApiProperty({ example: ['jne', 'jnt', 'pos'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsIn(['jne', 'jnt', 'sicepat', 'anteraja', 'pos', 'tiki', 'ninja'], {
    each: true,
  })
  couriers: string[];
}

@ApiTags('Shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  // ─── Cari destinasi (dipakai form alamat) ─────────────────────────
  @Get('destinations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cari kota/kecamatan untuk asal/tujuan' })
  @ApiQuery({ name: 'search', example: 'Surabaya' })
  searchDestination(@Query('search') search: string) {
    return this.shippingService.searchDestination(search);
  }

  // ─── Ongkir semua kurir aktif toko (dipakai checkout buyer) ──────
  @Get('store-cost')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Hitung ongkir semua kurir aktif toko ke tujuan buyer',
  })
  @ApiQuery({ name: 'storeId', example: 'store-uuid' })
  @ApiQuery({ name: 'destinationId', example: '507' })
  @ApiQuery({ name: 'weight', example: '1000' })
  async getStoreCost(
    @Query('storeId') storeId: string,
    @Query('destinationId') destinationId: string,
    @Query('weight') weight: string,
  ) {
    return this.shippingService.calculateStoreCost(
      storeId,
      destinationId,
      Number(weight) || 500,
    );
  }

  // ─── Resolve destination ID dari nama kota (dipakai form alamat) ─
  @Get('resolve-destination')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Resolve Raja Ongkir destination ID dari nama kota/kecamatan',
  })
  @ApiQuery({ name: 'keyword', example: 'Grogol Jakarta' })
  async resolveDestination(@Query('keyword') keyword: string) {
    const id = await this.shippingService.resolveDestinationId(keyword);
    return { destinationId: id };
  }

  // ─── Seller atur kurir aktif tokonya ─────────────────────────────
  @Patch('seller/couriers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seller update daftar kurir aktif toko' })
  async updateCouriers(@Request() req, @Body() dto: UpdateCouriersDto) {
    return this.shippingService.updateActiveCouriersByUserId(
      req.user.userId,
      dto.couriers,
    );
  }

  // ─── Hitung ongkir manual 1 kurir (admin/debug) ──────────────────
  @Post('cost')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hitung ongkir 1 kurir (manual/debug)' })
  calculateCost(@Body() dto: ShippingCostDto) {
    return this.shippingService.calculateCost(dto);
  }
}
