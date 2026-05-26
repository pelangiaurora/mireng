import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TierSystemService } from './tier-system.service';
import { AdminOverrideTierDto } from './dto/tier.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Tier System')
@Controller()
export class TierSystemController {
  constructor(private readonly service: TierSystemService) {}

  // ─── SELLER: lihat info tier & progress ───────────────────────────
  @Get('stores/seller/mine/tier')
  @UseGuards(JwtAuthGuard, new RolesGuard(['seller']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seller: lihat info tier & progress' })
  async getMyTierInfo(@Request() req) {
    return this.service.getMyTierInfo(req.user.userId);
  }

  // ─── SELLER: toggle tampilan badge ────────────────────────────────
  @Patch('stores/seller/mine/badge-toggle')
  @UseGuards(JwtAuthGuard, new RolesGuard(['seller']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seller: sembunyikan/tampilkan badge tier' })
  async toggleBadge(@Request() req) {
    return this.service.toggleBadge(req.user.userId);
  }

  // ─── ADMIN: override tier seller ──────────────────────────────────
  @Patch('admin/stores/:id/tier')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: override tier seller' })
  async adminOverrideTier(
    @Param('id') storeId: string,
    @Body() dto: AdminOverrideTierDto,
    @Request() req,
  ) {
    return this.service.adminOverrideTier(storeId, dto, req.user.userId);
  }

  // ─── ADMIN: lihat riwayat tier sebuah toko ────────────────────────
  @Get('admin/stores/:id/tier-log')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: riwayat perubahan tier toko' })
  async getTierLog(@Param('id') storeId: string) {
    return this.service.getTierLog(storeId);
  }
}