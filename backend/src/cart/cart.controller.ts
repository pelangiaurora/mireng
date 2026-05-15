import {
    Body,
    Controller,
    Post,
    UseGuards,
    Request,
    Get,
    Delete,
    Param,
} from '@nestjs/common';

import { CartService } from './cart.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @UseGuards(JwtAuthGuard)
    @Post('add')
    add(
        @Request() req,
        @Body() body: any,
    ) {
        return this.cartService.addToCart(
            req.user.userId,
            body.productId,
            body.quantity,
        );
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getMyCart(@Request() req) {
        return this.cartService.getMyCart(req.user.userId);
    }

    @Delete('item/:id')
    @UseGuards(JwtAuthGuard)
    removeItem(@Param('id') id: string) {
        return this.cartService.removeItem(id);
    }
}