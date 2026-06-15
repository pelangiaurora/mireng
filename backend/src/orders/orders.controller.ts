import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CheckoutDto } from './dto/checkout.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Checkout dari keranjang (multi-toko + ongkir)' })
  checkout(@Request() req, @Body() dto: CheckoutDto) {
    return this.ordersService.checkout(req.user.userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Daftar pesanan milik user' })
  getMyOrders(@Request() req) {
    return this.ordersService.getMyOrders(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Detail pesanan' })
  getDetail(@Request() req, @Param('id') id: string) {
    return this.ordersService.getOrderDetail(req.user.userId, id);
  }
}
