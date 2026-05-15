import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';

import { OrdersService } from './orders.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  checkout(@Request() req) {
    return this.ordersService.checkout(
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getMyOrders(@Request() req) {
    return this.ordersService.getMyOrders(
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getDetail(
    @Request() req,
    @Param('id') id: string,
  ) {
    return this.ordersService.getOrderDetail(
      req.user.userId,
      id,
    );
  }
}