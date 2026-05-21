import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAddress } from './entities/user-address.entity';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(UserAddress)
    private addressRepo: Repository<UserAddress>,
  ) {}

  // Ambil semua alamat milik user
  async findAll(userId: string): Promise<UserAddress[]> {
    return this.addressRepo.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'ASC' },
    });
  }

  // Ambil satu alamat
  async findOne(id: string, userId: string): Promise<UserAddress> {
    const address = await this.addressRepo.findOne({ where: { id } });
    if (!address) throw new NotFoundException('Alamat tidak ditemukan');
    if (address.userId !== userId)
      throw new ForbiddenException('Bukan alamat kamu');
    return address;
  }

  // Tambah alamat baru
  async create(userId: string, dto: CreateAddressDto): Promise<UserAddress> {
    // Kalau isDefault true, reset semua alamat lain
    if (dto.isDefault) {
      await this.addressRepo.update({ userId }, { isDefault: false });
    }

    // Kalau belum ada alamat sama sekali, jadikan default otomatis
    const count = await this.addressRepo.count({ where: { userId } });
    if (count === 0) dto.isDefault = true;

    const address = this.addressRepo.create({ ...dto, userId });
    return this.addressRepo.save(address);
  }

  // Update alamat
  async update(
    id: string,
    userId: string,
    dto: Partial<CreateAddressDto>,
  ): Promise<UserAddress> {
    const address = await this.findOne(id, userId);

    if (dto.isDefault) {
      await this.addressRepo.update({ userId }, { isDefault: false });
    }

    Object.assign(address, dto);
    return this.addressRepo.save(address);
  }

  // Set sebagai alamat default
  async setDefault(id: string, userId: string): Promise<UserAddress> {
    const address = await this.findOne(id, userId);
    await this.addressRepo.update({ userId }, { isDefault: false });
    address.isDefault = true;
    return this.addressRepo.save(address);
  }

  // Hapus alamat
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const address = await this.findOne(id, userId);
    await this.addressRepo.remove(address);

    // Kalau yang dihapus adalah default, set alamat pertama jadi default
    const remaining = await this.findAll(userId);
    if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
      await this.addressRepo.update(remaining[0].id, { isDefault: true });
    }

    return { message: 'Alamat berhasil dihapus' };
  }
}
