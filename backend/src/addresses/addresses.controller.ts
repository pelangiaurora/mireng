// ─── addresses.controller.ts ─────────────────────────────
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: 'Ambil semua alamat milik user' })
  findAll(@Request() req) {
    return this.addressesService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail satu alamat' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.addressesService.findOne(id, req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Tambah alamat baru' })
  create(@Request() req, @Body() dto: CreateAddressDto) {
    return this.addressesService.create(req.user.userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update alamat' })
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: Partial<CreateAddressDto>,
  ) {
    return this.addressesService.update(id, req.user.userId, dto);
  }

  @Patch(':id/set-default')
  @ApiOperation({ summary: 'Set sebagai alamat default' })
  setDefault(@Param('id') id: string, @Request() req) {
    return this.addressesService.setDefault(id, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus alamat' })
  remove(@Param('id') id: string, @Request() req) {
    return this.addressesService.remove(id, req.user.userId);
  }
}
