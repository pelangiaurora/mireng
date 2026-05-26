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
import { SellerApplicationsService } from './seller-applications.service';
import { CreateSellerApplicationDto, ReviewApplicationDto } from './dto/seller-application.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Seller Applications')
@Controller()
export class SellerApplicationsController {
  constructor(private readonly service: SellerApplicationsService) {}

  // ─── BUYER: ajukan permohonan seller ──────────────────────────────
  @Post('seller-applications')
  @UseGuards(JwtAuthGuard, new RolesGuard(['buyer']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buyer ajukan permohonan seller (saat pendaftaran ditutup)' })
  async create(@Body() dto: CreateSellerApplicationDto, @Request() req) {
    return this.service.create(req.user.userId, dto);
  }

  // ─── BUYER: cek status permohonan sendiri ─────────────────────────
  @Get('seller-applications/mine')
  @UseGuards(JwtAuthGuard, new RolesGuard(['buyer', 'seller']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cek status permohonan seller milik sendiri' })
  async getMyApplication(@Request() req) {
    return this.service.getMyApplication(req.user.userId);
  }

  // ─── ADMIN: list semua permohonan ─────────────────────────────────
  @Get('admin/seller-applications')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: list semua permohonan seller' })
  @ApiQuery({ name: 'status', required: false, example: 'pending' })
  async findAll(@Query('status') status?: string) {
    return this.service.findAll(status);
  }

  // ─── ADMIN: detail satu permohonan ────────────────────────────────
  @Get('admin/seller-applications/:id')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: detail permohonan seller' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ─── ADMIN: approve / reject permohonan ───────────────────────────
  @Patch('admin/seller-applications/:id/review')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: approve/reject permohonan seller' })
  async review(
    @Param('id') id: string,
    @Body() dto: ReviewApplicationDto,
    @Request() req,
  ) {
    return this.service.review(id, dto, req.user.userId);
  }
}