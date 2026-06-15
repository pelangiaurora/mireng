import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStore } from './entities/order-store.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { UserAddress } from '../addresses/entities/user-address.entity';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(OrderStore)
    private orderStoreRepo: Repository<OrderStore>,
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepo: Repository<CartItem>,
    @InjectRepository(UserAddress)
    private addressRepo: Repository<UserAddress>,
  ) {}

  // ─── Checkout Baru (multi-toko + alamat + ongkir) ─────────────────
  async checkout(userId: string, dto: CheckoutDto) {
    // 1. Validasi alamat
    const address = await this.addressRepo.findOne({
      where: { id: dto.addressId, userId },
    });
    if (!address) throw new NotFoundException('Alamat tidak ditemukan');

    // 2. Ambil cart
    const cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'items.product.store', 'user'],
    });
    if (!cart) throw new NotFoundException('Keranjang tidak ditemukan');
    if (cart.items.length === 0)
      throw new BadRequestException('Keranjang kosong');

    // 3. Kelompokkan item per toko
    const storeMap = new Map<string, typeof cart.items>();
    for (const item of cart.items) {
      const storeId = item.product?.storeId ?? 'unknown';
      if (!storeMap.has(storeId)) storeMap.set(storeId, []);
      storeMap.get(storeId)!.push(item);
    }

    // 4. Validasi shipping options (satu per toko)
    for (const [storeId] of storeMap) {
      const hasShipping = dto.shippingOptions.some(
        (s) => s.storeId === storeId,
      );
      if (!hasShipping) {
        throw new BadRequestException(`Pilih ekspedisi untuk toko ${storeId}`);
      }
    }

    // 5. Hitung total
    let subtotal = 0;
    let shippingTotal = 0;

    for (const item of cart.items) {
      subtotal += Number(item.product.price) * item.quantity;
    }

    for (const shipping of dto.shippingOptions) {
      shippingTotal += Number(shipping.shippingFee);
    }

    const total = subtotal + shippingTotal;

    // 6. Simpan snapshot alamat
    const shippingAddress = {
      recipientName: address.recipientName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      province: address.province,
      district: address.district,
      postalCode: address.postalCode,
    };

    // 7. Buat order
    const order = this.orderRepo.create({
      userId,
      addressId: address.id,
      shippingAddress,
      subtotal,
      shippingTotal,
      total,
      paymentMethod: dto.paymentMethod,
      notes: dto.notes,
      status: 'pending',
    });
    const savedOrder = await this.orderRepo.save(order);

    // 8. Buat order items
    for (const item of cart.items) {
      await this.orderItemRepo.save(
        this.orderItemRepo.create({
          order: savedOrder,
          product: item.product,
          quantity: item.quantity,
          price: item.product.price,
        }),
      );
    }

    // 9. Buat order stores (per toko)
    for (const [storeId, items] of storeMap) {
      const shipping = dto.shippingOptions.find((s) => s.storeId === storeId);
      const storeSubtotal = items.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0,
      );

      await this.orderStoreRepo.save(
        this.orderStoreRepo.create({
          orderId: savedOrder.id,
          storeId,
          subtotal: storeSubtotal,
          shippingFee: shipping?.shippingFee ?? 0,
          courier: shipping?.courier ?? '',
          courierService: shipping?.service ?? '',
          status: 'pending',
        }),
      );
    }

    // 10. Kosongkan cart
    await this.cartItemRepo.remove(cart.items);

    return {
      orderId: savedOrder.id,
      subtotal,
      shippingTotal,
      total,
      status: 'pending',
      paymentMethod: dto.paymentMethod,
    };
  }

  // ─── Get My Orders ─────────────────────────────────────────────────
  async getMyOrders(userId: string) {
    return this.orderRepo.find({
      where: { userId },
      relations: ['items', 'items.product', 'stores'],
      order: { createdAt: 'DESC' },
    });
  }

  // ─── Get Order Detail ──────────────────────────────────────────────
  async getOrderDetail(userId: string, orderId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, userId },
      relations: ['items', 'items.product', 'stores', 'address', 'payment'],
    });
    if (!order) throw new NotFoundException('Order tidak ditemukan');
    return order;
  }
}
