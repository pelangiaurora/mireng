import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { StoreVerificationsService } from './store-verifications.service';
import { SubmitVerificationDto, ReviewVerificationDto } from './dto/submit-verification.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Store Verifications')
@Controller()
export class StoreVerificationsController {
  constructor(private readonly service: StoreVerificationsService) {}

  // ─── SELLER: submit dokumen verifikasi ────────────────────────────
  @Post('stores/verify/submit')
  @UseGuards(JwtAuthGuard, new RolesGuard(['seller']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seller submit dokumen verifikasi toko' })
  async submit(@Body() dto: SubmitVerificationDto, @Request() req) {
    return this.service.submit(req.user.userId, dto);
  }

  // ─── SELLER: cek status verifikasi toko sendiri ───────────────────
  @Get('stores/verify/status')
  @UseGuards(JwtAuthGuard, new RolesGuard(['seller']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seller cek status verifikasi toko' })
  async getMyStatus(@Request() req) {
    return this.service.getMyVerification(req.user.userId);
  }

  // ─── ADMIN: list antrian verifikasi ───────────────────────────────
  @Get('admin/verifications')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: list semua pengajuan verifikasi' })
  @ApiQuery({ name: 'status', required: false, example: 'pending' })
  async findAll(@Query('status') status?: string) {
    return this.service.findAll(status);
  }

  // ─── ADMIN: detail satu verifikasi ────────────────────────────────
  @Get('admin/verifications/:id')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: detail pengajuan verifikasi' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ─── ADMIN: approve / reject verifikasi ───────────────────────────
  @Patch('admin/verifications/:id/review')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: approve/reject pengajuan verifikasi' })
  async review(
    @Param('id') id: string,
    @Body() dto: ReviewVerificationDto,
    @Request() req,
  ) {
    return this.service.review(id, dto, req.user.userId);
  }
}