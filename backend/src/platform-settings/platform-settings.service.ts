import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatformSetting } from './entities/platform-setting.entity';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class PlatformSettingsService {
  constructor(
    @InjectRepository(PlatformSetting)
    private readonly settingRepo: Repository<PlatformSetting>,
  ) {}

  // ─── Ambil semua setting ───────────────────────────────────────────
  async findAll(): Promise<PlatformSetting[]> {
    return this.settingRepo.find({ order: { key: 'ASC' } });
  }

  // ─── Ambil satu setting by key ────────────────────────────────────
  async findByKey(key: string): Promise<PlatformSetting> {
    const setting = await this.settingRepo.findOne({ where: { key } });
    if (!setting) throw new NotFoundException(`Setting '${key}' tidak ditemukan`);
    return setting;
  }

  // ─── Helper: ambil value langsung (typed) ─────────────────────────
  async getValue(key: string, fallback: string = ''): Promise<string> {
    try {
      const setting = await this.findByKey(key);
      return setting.value;
    } catch {
      return fallback;
    }
  }

  async getBooleanValue(key: string, fallback: boolean = true): Promise<boolean> {
    const value = await this.getValue(key, String(fallback));
    return value === 'true';
  }

  // ─── Cek apakah pendaftaran seller dibuka ─────────────────────────
  async isSellerRegistrationOpen(): Promise<boolean> {
    return this.getBooleanValue('seller_registration_open', true);
  }

  // ─── Update setting ───────────────────────────────────────────────
  async update(
    key: string,
    dto: UpdateSettingDto,
    updatedBy: string,
  ): Promise<PlatformSetting> {
    const setting = await this.findByKey(key);

    if (dto.value !== undefined) setting.value = dto.value;
    if (dto.dataType !== undefined) setting.dataType = dto.dataType;
    if (dto.description !== undefined) setting.description = dto.description;
    setting.updatedBy = updatedBy;

    return this.settingRepo.save(setting);
  }

  // ─── Seed default settings (dipanggil saat init) ──────────────────
  async seedDefaults(): Promise<void> {
    const defaults = [
      { key: 'seller_registration_open', value: 'true', dataType: 'boolean', description: 'Buka/tutup pendaftaran seller baru' },
      { key: 'seller_upgrade_open', value: 'true', dataType: 'boolean', description: 'Buka/tutup upgrade buyer ke seller' },
      { key: 'maintenance_mode', value: 'false', dataType: 'boolean', description: 'Mode maintenance platform' },
      { key: 'commission_regular', value: '1.0', dataType: 'number', description: 'Komisi seller tier Regular (%)' },
      { key: 'commission_star', value: '1.5', dataType: 'number', description: 'Komisi seller tier Star (%)' },
      { key: 'commission_star_plus', value: '2.0', dataType: 'number', description: 'Komisi seller tier Star+ (%)' },
      { key: 'commission_top', value: '2.5', dataType: 'number', description: 'Komisi seller tier Top Seller (%)' },
    ];

    for (const item of defaults) {
      const exists = await this.settingRepo.findOne({ where: { key: item.key } });
      if (!exists) {
        await this.settingRepo.save(this.settingRepo.create(item));
      }
    }
  }
}