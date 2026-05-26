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
import { PlatformSettingsService } from './platform-settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Platform Settings')
@Controller()
export class PlatformSettingsController {
  constructor(private readonly service: PlatformSettingsService) {}

  // ─── PUBLIC: cek status pendaftaran seller ─────────────────────────
  @Get('platform-settings/registration-status')
  @ApiOperation({ summary: 'Cek apakah pendaftaran seller dibuka (publik)' })
  async getRegistrationStatus() {
    const open = await this.service.isSellerRegistrationOpen();
    return { seller_registration_open: open };
  }

  // ─── ADMIN: ambil semua setting ───────────────────────────────────
  @Get('admin/platform-settings')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ambil semua platform settings (admin)' })
  async findAll() {
    return this.service.findAll();
  }

  // ─── ADMIN: ambil satu setting ────────────────────────────────────
  @Get('admin/platform-settings/:key')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ambil setting by key (admin)' })
  async findOne(@Param('key') key: string) {
    return this.service.findByKey(key);
  }

  // ─── ADMIN: update setting ────────────────────────────────────────
  @Patch('admin/platform-settings/:key')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update platform setting (admin)' })
  async update(
    @Param('key') key: string,
    @Body() dto: UpdateSettingDto,
    @Request() req,
  ) {
    return this.service.update(key, dto, req.user.userId);
  }
}
