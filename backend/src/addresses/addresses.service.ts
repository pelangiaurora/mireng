import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAddress } from './entities/user-address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { ShippingService } from '../shipping/shipping.service';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(UserAddress)
    private addressRepo: Repository<UserAddress>,
    private shippingService: ShippingService,
  ) {}

  // ─── Auto-resolve Raja Ongkir destination ID ──────────────────────
  private async resolveDestId(
    dto: Partial<CreateAddressDto>,
  ): Promise<string | null> {
    // Keyword: "Kecamatan Kota" untuk hasil lebih akurat
    const keyword = [dto.district, dto.city, dto.province]
      .filter(Boolean)
      .join(' ');
    if (!keyword || keyword.length < 3) return null;
    return this.shippingService.resolveDestinationId(keyword);
  }

  // ─── Ambil semua alamat ───────────────────────────────────────────
  async findAll(userId: string): Promise<UserAddress[]> {
    return this.addressRepo.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'ASC' },
    });
  }

  // ─── Ambil satu alamat ────────────────────────────────────────────
  async findOne(id: string, userId: string): Promise<UserAddress> {
    const address = await this.addressRepo.findOne({ where: { id } });
    if (!address) throw new NotFoundException('Alamat tidak ditemukan');
    if (address.userId !== userId)
      throw new ForbiddenException('Bukan alamat kamu');
    return address;
  }

  // ─── Tambah alamat baru ───────────────────────────────────────────
  async create(userId: string, dto: CreateAddressDto): Promise<UserAddress> {
    if (dto.isDefault) {
      await this.addressRepo.update({ userId }, { isDefault: false });
    }
    const count = await this.addressRepo.count({ where: { userId } });
    if (count === 0) dto.isDefault = true;

    // Auto-resolve Raja Ongkir destination ID
    const rajaongkirDestinationId = await this.resolveDestId(dto);

    const address = this.addressRepo.create({
      ...dto,
      userId,
      ...(rajaongkirDestinationId ? { rajaongkirDestinationId } : {}),
    });
    return this.addressRepo.save(address);
  }

  // ─── Update alamat ────────────────────────────────────────────────
  async update(
    id: string,
    userId: string,
    dto: Partial<CreateAddressDto>,
  ): Promise<UserAddress> {
    const address = await this.findOne(id, userId);
    if (dto.isDefault) {
      await this.addressRepo.update({ userId }, { isDefault: false });
    }

    // Re-resolve jika kota/kecamatan berubah
    if (dto.city || dto.district || dto.province) {
      const merged = { ...address, ...dto };
      const rajaongkirDestinationId = await this.resolveDestId(merged);
      if (rajaongkirDestinationId) {
        (dto as any).rajaongkirDestinationId = rajaongkirDestinationId;
      }
    }

    Object.assign(address, dto);
    return this.addressRepo.save(address);
  }

  // ─── Set sebagai default ──────────────────────────────────────────
  async setDefault(id: string, userId: string): Promise<UserAddress> {
    const address = await this.findOne(id, userId);
    await this.addressRepo.update({ userId }, { isDefault: false });
    address.isDefault = true;
    return this.addressRepo.save(address);
  }

  // ─── Hapus alamat ────────────────────────────────────────────────
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const address = await this.findOne(id, userId);
    await this.addressRepo.remove(address);
    const remaining = await this.findAll(userId);
    if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
      await this.addressRepo.update(remaining[0].id, { isDefault: true });
    }
    return { message: 'Alamat berhasil dihapus' };
  }
}
