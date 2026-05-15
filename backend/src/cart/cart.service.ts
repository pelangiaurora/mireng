import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepo: Repository<Cart>,

        @InjectRepository(CartItem)
        private cartItemRepo: Repository<CartItem>,

        @InjectRepository(Product)
        private productRepo: Repository<Product>,
    ) { }

    async addToCart(userId, productId, quantity) {
        // cari product
        const product = await this.productRepo.findOne({
            where: { id: productId },
        });

        if (!product) {
            return {
                message: 'Product not found',
            };
        }

        // cari cart user
        let cart = await this.cartRepo.findOne({
            where: {
                user: {
                    id: userId,
                },
            },
            relations: ['user'],
        });

        // kalau belum ada cart
        if (!cart) {
            cart = this.cartRepo.create({
                user: {
                    id: userId,
                } as any,
            });

            cart = await this.cartRepo.save(cart);
        }

        // buat item
        const item = this.cartItemRepo.create({
            cart,
            product,
            quantity,
        });

        return this.cartItemRepo.save(item);
    }

    async getMyCart(userId: string) {
        const cart = await this.cartRepo.findOne({
            where: {
                user: {
                    id: userId,
                },
            },
            relations: ['items', 'items.product'],
        });

        if (!cart) {
            return {
                items: [],
                total: 0,
            };
        }

        let total = 0;

        cart.items.forEach((item) => {
            total += Number(item.product.price) * item.quantity;
        });

        return {
            cartId: cart.id,
            items: cart.items,
            total,
        };
    }

    async removeItem(itemId: string) {
        const item = await this.cartItemRepo.findOne({
            where: {
                id: itemId,
            },
        });

        if (!item) {
            return {
                message: 'Item not found',
            };
        }

        await this.cartItemRepo.remove(item);

        return {
            message: 'Item removed from cart',
        };
    }
}