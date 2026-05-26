import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreVerification } from './entities/store-verification.entity';
import { Store } from '../stores/entities/store.entity';
import { SubmitVerificationDto, ReviewVerificationDto } from './dto/submit-verification.dto';

@Injectable()
export class StoreVerificationsService {
  constructor(
    @InjectRepository(StoreVerification)
    private readonly verifRepo: Repository<StoreVerification>,
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
  ) {}

  // ─── Seller: submit dokumen verifikasi ────────────────────────────
  async submit(
    sellerId: string,
    dto: SubmitVerificationDto,
  ): Promise<StoreVerification> {
    // Cari toko milik seller
    const store = await this.storeRepo.findOne({ where: { sellerId } });
    if (!store) throw new NotFoundException('Toko tidak ditemukan');

    // Cek apakah sudah ada pengajuan pending
    const existing = await this.verifRepo.findOne({
      where: { storeId: store.id, status: 'pending' },
    });
    if (existing) {
      throw new BadRequestException(
        'Sudah ada pengajuan verifikasi yang sedang diproses',
      );
    }

    // Buat pengajuan baru
    const verif = this.verifRepo.create({
      storeId: store.id,
      sellerType: dto.sellerType,
      storeType: dto.storeType,
      documentKtp: dto.documentKtp,
      documentSelfie: dto.documentSelfie,
      documentNib: dto.documentNib,
      documentSiup: dto.documentSiup,
      documentAkta: dto.documentAkta,
      documentNpwp: dto.documentNpwp,
      documentBrand: dto.documentBrand,
      notesFromSeller: dto.notesFromSeller,
      status: 'pending',
    });

    const saved = await this.verifRepo.save(verif);

    // Update verif_status di stores
    await this.storeRepo.update(store.id, { verifStatus: 'pending' });

    return saved;
  }

  // ─── Seller: lihat status verifikasi toko sendiri ─────────────────
  async getMyVerification(sellerId: string): Promise<StoreVerification> {
    const store = await this.storeRepo.findOne({ where: { sellerId } });
    if (!store) throw new NotFoundException('Toko tidak ditemukan');

    const verif = await this.verifRepo.findOne({
      where: { storeId: store.id },
      order: { createdAt: 'DESC' },
    });
    if (!verif) throw new NotFoundException('Belum ada pengajuan verifikasi');

    return verif;
  }

  // ─── Admin: list semua antrian verifikasi ─────────────────────────
  async findAll(status?: string): Promise<StoreVerification[]> {
    const where = status ? { status } : {};
    return this.verifRepo.find({
      where,
      relations: ['store'],
      order: { createdAt: 'ASC' },
    });
  }

  // ─── Admin: detail satu verifikasi ────────────────────────────────
  async findOne(id: string): Promise<StoreVerification> {
    const verif = await this.verifRepo.findOne({
      where: { id },
      relations: ['store'],
    });
    if (!verif) throw new NotFoundException('Pengajuan verifikasi tidak ditemukan');
    return verif;
  }

  // ─── Admin: approve atau reject verifikasi ────────────────────────
  async review(
    id: string,
    dto: ReviewVerificationDto,
    adminId: string,
  ): Promise<StoreVerification> {
    const verif = await this.findOne(id);

    if (verif.status !== 'pending' && verif.status !== 'need_revision') {
      throw new BadRequestException('Verifikasi ini sudah diproses sebelumnya');
    }

    // Update verifikasi
    verif.status = dto.status;
    verif.notesFromAdmin = dto.notesFromAdmin ?? '';
    verif.reviewedBy = adminId;
    verif.reviewedAt = new Date();
    await this.verifRepo.save(verif);

    // Update status di tabel stores
    if (dto.status === 'approved') {
      await this.storeRepo.update(verif.storeId, {
        verifStatus: 'approved',
        isVerified: true,
        sellerType: verif.sellerType,
        storeType: verif.storeType,
      });
    } else if (dto.status === 'rejected') {
      await this.storeRepo.update(verif.storeId, {
        verifStatus: 'rejected',
      });
    } else {
      await this.storeRepo.update(verif.storeId, {
        verifStatus: 'pending',
      });
    }

    return verif;
  }
}