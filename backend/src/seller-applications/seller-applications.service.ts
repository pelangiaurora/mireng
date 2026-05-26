import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SellerApplication } from './entities/seller-application.entity';
import { User } from '../users/entities/user.entity';
import { PlatformSettingsService } from '../platform-settings/platform-settings.service';
import { CreateSellerApplicationDto, ReviewApplicationDto } from './dto/seller-application.dto';

@Injectable()
export class SellerApplicationsService {
  constructor(
    @InjectRepository(SellerApplication)
    private readonly appRepo: Repository<SellerApplication>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly platformSettings: PlatformSettingsService,
  ) {}

  // ─── Buyer: ajukan permohonan seller ──────────────────────────────
  async create(
    userId: string,
    dto: CreateSellerApplicationDto,
  ): Promise<SellerApplication> {
    // Cek apakah pendaftaran seller sedang ditutup
    const isOpen = await this.platformSettings.isSellerRegistrationOpen();
    if (isOpen) {
      throw new BadRequestException(
        'Pendaftaran seller sedang dibuka. Silakan daftar langsung melalui form buka toko.',
      );
    }

    // Cek user ada dan masih buyer
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    if (user.role === 'seller') {
      throw new BadRequestException('Kamu sudah menjadi seller');
    }

    // Cek apakah sudah ada permohonan pending
    const existing = await this.appRepo.findOne({
      where: { userId, status: 'pending' },
    });
    if (existing) {
      throw new BadRequestException(
        'Kamu sudah memiliki permohonan yang sedang diproses',
      );
    }

    // Buat permohonan
    const application = this.appRepo.create({
      userId,
      sellerTypeRequested: dto.sellerTypeRequested,
      reason: dto.reason,
      marketplaceLinks: dto.marketplaceLinks,
      estimatedProducts: dto.estimatedProducts,
      estimatedRevenue: dto.estimatedRevenue,
      experienceYears: dto.experienceYears,
      documentKtp: dto.documentKtp,
      documentSupport: dto.documentSupport,
      status: 'pending',
    });

    // Update seller_reg_status di users
    await this.userRepo.update(userId, { sellerRegStatus: 'pending' });

    return this.appRepo.save(application);
  }

  // ─── Buyer: cek status permohonan sendiri ─────────────────────────
  async getMyApplication(userId: string): Promise<SellerApplication> {
    const app = await this.appRepo.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    if (!app) throw new NotFoundException('Belum ada permohonan');
    return app;
  }

  // ─── Admin: list semua permohonan ─────────────────────────────────
  async findAll(status?: string): Promise<SellerApplication[]> {
    const where = status ? { status } : {};
    return this.appRepo.find({
      where,
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  // ─── Admin: detail satu permohonan ────────────────────────────────
  async findOne(id: string): Promise<SellerApplication> {
    const app = await this.appRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!app) throw new NotFoundException('Permohonan tidak ditemukan');
    return app;
  }

  // ─── Admin: approve / reject permohonan ───────────────────────────
  async review(
    id: string,
    dto: ReviewApplicationDto,
    adminId: string,
  ): Promise<SellerApplication> {
    const app = await this.findOne(id);

    if (app.status !== 'pending' && app.status !== 'need_info') {
      throw new BadRequestException('Permohonan ini sudah diproses sebelumnya');
    }

    // Update permohonan
    app.status = dto.status;
    app.adminNotes = dto.adminNotes ?? '';
    app.rejectionReason = dto.rejectionReason ?? '';
    app.reviewedBy = adminId;
    app.reviewedAt = new Date();
    await this.appRepo.save(app);

    // Kalau approved → upgrade user ke seller
    if (dto.status === 'approved') {
      await this.userRepo.update(app.userId, {
        role: 'seller',
        sellerRegStatus: 'approved',
      });
    } else if (dto.status === 'rejected') {
      await this.userRepo.update(app.userId, {
        sellerRegStatus: 'rejected',
      });
    }

    return app;
  }
}