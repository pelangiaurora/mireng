import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../stores/entities/store.entity';
import { SellerTierLog } from '../seller-tier-log/entities/seller-tier-log.entity';
import { PlatformSettingsService } from '../platform-settings/platform-settings.service';
import { AdminOverrideTierDto } from './dto/tier.dto';

const TIER_ORDER = ['regular', 'star', 'star_plus', 'top', 'official'];

@Injectable()
export class TierSystemService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
    @InjectRepository(SellerTierLog)
    private readonly tierLogRepo: Repository<SellerTierLog>,
    private readonly platformSettings: PlatformSettingsService,
  ) {}

  // ─── Seller: lihat info tier & progress ───────────────────────────
  async getMyTierInfo(sellerId: string) {
    const store = await this.storeRepo.findOne({ where: { sellerId } });
    if (!store) throw new NotFoundException('Toko tidak ditemukan');

    const nextTier = this.getNextTier(store.sellerTier);
    const criteria = await this.getTierCriteria(nextTier);

    return {
      currentTier: store.sellerTier,
      tierProgress: store.tierProgress,
      badgeVisible: store.badgeVisible,
      nextTier,
      criteria,
      metrics: {
        totalTransactions: store.totalTransactions,
        avgRating: store.avgRating,
        responseRate: store.responseRate,
        complaintRate: store.complaintRate,
        activeSince: store.activeSince,
      },
    };
  }

  // ─── Helper: tier berikutnya ──────────────────────────────────────
  private getNextTier(currentTier: string): string | null {
    const idx = TIER_ORDER.indexOf(currentTier);
    if (idx === -1 || idx === TIER_ORDER.length - 1) return null;
    return TIER_ORDER[idx + 1];
  }

  // ─── Helper: ambil kriteria naik tier dari platform_settings ──────
  private async getTierCriteria(tier: string | null) {
    if (!tier || tier === 'official') return null;

    if (tier === 'star') {
      return {
        minTransactions: await this.platformSettings.getValue('tier_star_min_transactions', '50'),
        minRating: await this.platformSettings.getValue('tier_star_min_rating', '4.5'),
        minMonths: await this.platformSettings.getValue('tier_star_min_months', '3'),
      };
    }
    if (tier === 'star_plus') {
      return {
        minTransactions: await this.platformSettings.getValue('tier_star_plus_min_tx', '150'),
        minRating: await this.platformSettings.getValue('tier_star_plus_min_rating', '4.7'),
      };
    }
    if (tier === 'top') {
      return {
        minTransactions: await this.platformSettings.getValue('tier_top_min_tx', '500'),
        minRating: await this.platformSettings.getValue('tier_top_min_rating', '4.8'),
      };
    }
    return null;
  }

  // ─── Seller: toggle badge visibility ─────────────────────────────
  async toggleBadge(sellerId: string): Promise<{ badgeVisible: boolean }> {
    const store = await this.storeRepo.findOne({ where: { sellerId } });
    if (!store) throw new NotFoundException('Toko tidak ditemukan');

    store.badgeVisible = !store.badgeVisible;
    await this.storeRepo.save(store);

    return { badgeVisible: store.badgeVisible };
  }

  // ─── Admin: override tier seller ─────────────────────────────────
  async adminOverrideTier(
    storeId: string,
    dto: AdminOverrideTierDto,
    adminId: string,
  ) {
    const store = await this.storeRepo.findOne({ where: { id: storeId } });
    if (!store) throw new NotFoundException('Toko tidak ditemukan');

    const fromTier = store.sellerTier;

    // Update tier di store
    store.sellerTier = dto.tier;
    await this.storeRepo.save(store);

    // Catat di log
    const log = this.tierLogRepo.create({
      storeId: store.id,
      fromTier,
      toTier: dto.tier,
      reason: dto.reason ?? 'Override manual oleh admin',
      changedById: adminId,
      isAuto: false,
    });
    await this.tierLogRepo.save(log);

    return {
      storeId: store.id,
      storeName: store.name,
      fromTier,
      toTier: dto.tier,
      reason: dto.reason,
    };
  }

  // ─── Admin: lihat riwayat tier sebuah toko ────────────────────────
  async getTierLog(storeId: string): Promise<SellerTierLog[]> {
    return this.tierLogRepo.find({
      where: { storeId },
      order: { createdAt: 'DESC' },
    });
  }
}