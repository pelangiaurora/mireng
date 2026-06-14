import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { ShippingService } from './shipping.service';
import { ShippingCostDto } from './dto/shipping-cost.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  // ─── Cari kota/kecamatan (dipakai di form alamat & checkout) ──────
  @Get('destinations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cari kota/kecamatan untuk asal/tujuan pengiriman' })
  @ApiQuery({ name: 'search', example: 'Surabaya' })
  searchDestination(@Query('search') search: string) {
    return this.shippingService.searchDestination(search);
  }

  // ─── Hitung ongkir ──────────────────────────────────────────────
  @Post('cost')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hitung ongkos kirim antar kota' })
  calculateCost(@Body() dto: ShippingCostDto) {
    return this.shippingService.calculateCost(dto);
  }
}
