import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // ─── Buat transaksi Snap (dipanggil setelah checkout) ──────────────
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buat transaksi pembayaran Midtrans Snap' })
  create(@Request() req, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(req.user.userId, dto.orderId);
  }

  // ─── Callback dari Midtrans (PUBLIC, tanpa auth) ──────────────────
  @Post('callback')
  @HttpCode(200)
  @ApiOperation({ summary: 'Webhook notification dari Midtrans (publik)' })
  callback(@Body() notification: any) {
    return this.paymentsService.handleNotification(notification);
  }

  // ─── Cek status pembayaran (polling dari frontend) ────────────────
  @Get('status/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cek status pembayaran order' })
  getStatus(@Request() req, @Param('orderId') orderId: string) {
    return this.paymentsService.getPaymentStatus(req.user.userId, orderId);
  }
}
