import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,

    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private cartItemRepo: Repository<CartItem>,
  ) { }

  async checkout(userId: string) {
    // ambil cart user
    const cart = await this.cartRepo.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: [
        'items',
        'items.product',
        'user',
      ],
    });

    if (!cart) {
      return {
        message: 'Cart not found',
      };
    }

    if (cart.items.length === 0) {
      return {
        message: 'Cart is empty',
      };
    }

    // hitung total
    let total = 0;

    for (const item of cart.items) {
      total += Number(item.product.price) * item.quantity;
    }

    // buat order
    const order = this.orderRepo.create({
      user: cart.user,
      total,
      status: 'pending',
    });

    const savedOrder = await this.orderRepo.save(order);

    // copy cart item -> order item
    for (const item of cart.items) {
      const orderItem = this.orderItemRepo.create({
        order: savedOrder,
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
      });

      await this.orderItemRepo.save(orderItem);
    }

    // kosongkan cart
    await this.cartItemRepo.remove(cart.items);

    return {
      message: 'Checkout success',
      orderId: savedOrder.id,
      total,
    };
  }

  async getMyOrders(userId: string) {
    const orders = await this.orderRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: [
        'items',
        'items.product',
      ],
      order: {
        createdAt: 'DESC',
      },
    });

    return orders;
  }

  async getOrderDetail(userId: string, orderId: string) {
    const order = await this.orderRepo.findOne({
      where: {
        id: orderId,
        user: {
          id: userId,
        },
      },
      relations: [
        'items',
        'items.product',
        'user',
      ],
    });

    if (!order) {
      return {
        message: 'Order not found',
      };
    }

    return order;
  }
}