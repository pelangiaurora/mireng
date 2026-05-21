import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  // ── PUBLIC ──────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Daftar semua toko aktif' })
  findAll(@Query('city') city?: string, @Query('search') search?: string) {
    return this.storesService.findAll({ city, search });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Detail toko by slug (halaman toko)' })
  findBySlug(@Param('slug') slug: string) {
    return this.storesService.findBySlug(slug);
  }

  // ── SELLER (butuh login) ─────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buka toko baru (seller)' })
  create(@Request() req, @Body() dto: CreateStoreDto) {
    return this.storesService.create(req.user.userId, dto);
  }

  @Get('seller/mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ambil toko milik seller yang login' })
  findMine(@Request() req) {
    return this.storesService.findMine(req.user.userId);
  }

  @Patch('seller/mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update info toko' })
  update(@Request() req, @Body() dto: UpdateStoreDto) {
    return this.storesService.update(req.user.userId, dto);
  }

  @Patch('seller/mine/holiday')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle mode liburan toko' })
  toggleHoliday(@Request() req, @Body('note') note?: string) {
    return this.storesService.toggleHoliday(req.user.userId, note);
  }

  // ── ADMIN ────────────────────────────────────────────────

  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: verifikasi toko' })
  verify(@Param('id') id: string) {
    return this.storesService.verify(id);
  }
}
