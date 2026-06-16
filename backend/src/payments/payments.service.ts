import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as midtransClient from 'midtrans-client';
import { Payment } from '../orders/entities/payment.entity';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class PaymentsService {
  private snap: any;

  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    private configService: ConfigService,
  ) {
    this.snap = new midtransClient.Snap({
      isProduction: this.configService.get('MIDTRANS_IS_PRODUCTION') === 'true',
      serverKey: this.configService.get('MIDTRANS_SERVER_KEY'),
      clientKey: this.configService.get('MIDTRANS_CLIENT_KEY'),
    });
  }

  // ─── Buat transaksi Snap untuk sebuah order ───────────────────────
  async createPayment(userId: string, orderId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, userId },
      relations: ['items', 'items.product', 'user', 'payment'],
    });
    if (!order) throw new NotFoundException('Order tidak ditemukan');

    if (order.status !== 'pending') {
      throw new BadRequestException('Order ini sudah diproses sebelumnya');
    }

    // Cek apakah sudah ada payment record
    let payment = order.payment;
    if (payment && payment.status === 'paid') {
      throw new BadRequestException('Order ini sudah dibayar');
    }

    const orderIdForMidtrans = `MIRENG-${order.id}-${Date.now()}`;

    const itemDetails = order.items.map((item) => ({
      id: item.product.id,
      price: Math.round(Number(item.price)),
      quantity: item.quantity,
      name: item.product.name.substring(0, 50),
    }));

    // Tambahkan ongkir sebagai item terpisah jika ada
    if (Number(order.shippingTotal) > 0) {
      itemDetails.push({
        id: 'SHIPPING',
        price: Math.round(Number(order.shippingTotal)),
        quantity: 1,
        name: 'Ongkos Kirim',
      });
    }

    const parameter = {
      transaction_details: {
        order_id: orderIdForMidtrans,
        gross_amount: Math.round(Number(order.total)),
      },
      item_details: itemDetails,
      customer_details: {
        first_name: order.user?.name ?? order.user?.email ?? 'Pembeli',
        email: order.user?.email,
        phone: (order.shippingAddress as any)?.phone ?? '',
      },
      credit_card: { secure: true },
    };

    try {
      const transaction = await this.snap.createTransaction(parameter);

      // Simpan / update payment record
      if (!payment) {
        payment = this.paymentRepo.create({
          orderId: order.id,
          method: order.paymentMethod,
          externalId: orderIdForMidtrans,
          status: 'pending',
          amount: Math.round(Number(order.total)),
          paymentUrl: transaction.redirect_url,
        });
      } else {
        payment.externalId = orderIdForMidtrans;
        payment.status = 'pending';
        payment.amount = Math.round(Number(order.total));
        payment.paymentUrl = transaction.redirect_url;
      }
      await this.paymentRepo.save(payment);

      return {
        token: transaction.token,
        redirectUrl: transaction.redirect_url,
        orderId: order.id,
        midtransOrderId: orderIdForMidtrans,
      };
    } catch (err: any) {
      throw new InternalServerErrorException(
        err?.message || 'Gagal membuat transaksi pembayaran',
      );
    }
  }

  // ─── Handle callback/notification dari Midtrans ───────────────────
  async handleNotification(notification: any) {
    const statusResponse =
      await this.snap.transaction.notification(notification);

    const orderIdMidtrans = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    const payment = await this.paymentRepo.findOne({
      where: { externalId: orderIdMidtrans },
      relations: ['order'],
    });
    if (!payment) {
      throw new NotFoundException('Payment record tidak ditemukan');
    }

    let newStatus = payment.status;

    if (transactionStatus === 'capture') {
      newStatus = fraudStatus === 'accept' ? 'paid' : 'pending';
    } else if (transactionStatus === 'settlement') {
      newStatus = 'paid';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny') {
      newStatus = 'failed';
    } else if (transactionStatus === 'expire') {
      newStatus = 'expired';
    } else if (transactionStatus === 'pending') {
      newStatus = 'pending';
    }

    payment.status = newStatus;
    if (newStatus === 'paid') {
      payment.paidAt = new Date();
    }
    await this.paymentRepo.save(payment);

    // Update status order juga
    if (newStatus === 'paid') {
      await this.orderRepo.update(payment.orderId, { status: 'processing' });
    } else if (newStatus === 'failed' || newStatus === 'expired') {
      await this.orderRepo.update(payment.orderId, { status: 'cancelled' });
    }

    return { received: true, status: newStatus };
  }

  // ─── Cek status pembayaran (untuk polling dari frontend) ──────────
  async getPaymentStatus(userId: string, orderId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, userId },
      relations: ['payment'],
    });
    if (!order) throw new NotFoundException('Order tidak ditemukan');

    return {
      orderId: order.id,
      orderStatus: order.status,
      paymentStatus: order.payment?.status ?? 'pending',
      paymentMethod: order.payment?.method,
    };
  }
}
