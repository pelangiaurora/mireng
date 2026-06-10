import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storeRepo: Repository<Store>,
  ) {}

  // Buat toko baru (seller daftar toko)
  async create(sellerId: string, dto: CreateStoreDto): Promise<Store> {
    const existing = await this.storeRepo.findOne({ where: { sellerId } });
    if (existing) throw new ConflictException('Kamu sudah memiliki toko');

    const slug = this.generateSlug(dto.name);
    const slugExists = await this.storeRepo.findOne({ where: { slug } });
    if (slugExists) throw new ConflictException('Nama toko sudah digunakan');

    const store = this.storeRepo.create({
      ...dto,
      sellerId,
      slug,
      sellerType: dto.sellerType ?? 'digital',
      storeType: dto.storeType ?? 'personal',
      sellerTier: 'regular',
      verifStatus: 'unverified',
      badgeVisible: true,
      tierProgress: 0,
      totalTransactions: 0,
      activeSince: new Date(),
    });
    return this.storeRepo.save(store);
  }

  // Ambil semua toko (publik)
  async findAll(query?: { city?: string; search?: string }) {
    const qb = this.storeRepo
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.seller', 'seller')
      .where('store.is_active = true');

    if (query?.city)
      qb.andWhere('store.city ILIKE :city', { city: `%${query.city}%` });
    if (query?.search)
      qb.andWhere('store.name ILIKE :search', { search: `%${query.search}%` });

    return qb.orderBy('store.total_sales', 'DESC').getMany();
  }

  // Ambil toko by slug (halaman toko publik)
  async findBySlug(slug: string): Promise<Store> {
    const store = await this.storeRepo.findOne({
      where: { slug, isActive: true },
      relations: ['seller'],
    });
    if (!store) throw new NotFoundException('Toko tidak ditemukan');
    return store;
  }

  // Ambil toko milik seller yang login
  async findMine(sellerId: string): Promise<Store> {
    const store = await this.storeRepo.findOne({ where: { sellerId } });
    if (!store) throw new NotFoundException('Kamu belum memiliki toko');
    return store;
  }

  // Ambil toko by ID
  async findOne(id: string): Promise<Store> {
    const store = await this.storeRepo.findOne({
      where: { id },
      relations: ['seller'],
    });
    if (!store) throw new NotFoundException('Toko tidak ditemukan');
    return store;
  }

  // Update toko
  async update(sellerId: string, dto: UpdateStoreDto): Promise<Store> {
    const store = await this.findMine(sellerId);
    Object.assign(store, dto);
    return this.storeRepo.save(store);
  }

  // Update logo/banner
  async updateMedia(
    sellerId: string,
    field: 'logo' | 'banner',
    url: string,
  ): Promise<Store> {
    const store = await this.findMine(sellerId);
    store[field] = url;
    return this.storeRepo.save(store);
  }

  // Toggle holiday mode
  async toggleHoliday(sellerId: string, note?: string): Promise<Store> {
    const store = await this.findMine(sellerId);
    store.holidayMode = !store.holidayMode;
    if (note) store.holidayNote = note;
    return this.storeRepo.save(store);
  }

  // Admin: verifikasi toko
  async verify(id: string): Promise<Store> {
    const store = await this.findOne(id);
    store.isVerified = true;
    return this.storeRepo.save(store);
  }

  // Generate slug dari nama toko
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
